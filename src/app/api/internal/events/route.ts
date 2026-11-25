import { createHash, timingSafeEqual } from "node:crypto";
import { createSlug, slugify } from "@/lib/event";
import { prisma } from "@/lib/prisma";
import { validCategoryOptions } from "@/types/event";
import { isString } from "@/utils/validation";

const boliviaOffset = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/La_Paz",
  timeZoneName: "longOffset",
});

function keysMatch(provided: string, expected: string) {
  return timingSafeEqual(
    createHash("sha256").update(provided).digest(),
    createHash("sha256").update(expected).digest()
  );
}

function parseBoliviaDateTime(date: string, time: string) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
  ) {
    return null;
  }

  const wallTime = `${date}T${time}:00`;
  const utcReference = new Date(`${wallTime}Z`);

  // Date can normalize impossible dates such as February 30.
  if (
    !Number.isFinite(utcReference.getTime()) ||
    utcReference.toISOString().slice(0, 10) !== date
  ) {
    return null;
  }

  const offset = boliviaOffset
    .formatToParts(utcReference)
    .find((part) => part.type === "timeZoneName")?.value;

  if (!offset) {
    return null;
  }

  const eventDate = new Date(`${wallTime}${offset.slice(3)}`);

  return Number.isFinite(eventDate.getTime()) ? eventDate : null;
}

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status });
}

export async function POST(request: Request) {
  const expectedKey = process.env.INTERNAL_API_KEY;
  const providedKey = request.headers.get("x-internal-api-key");

  if (
    !isString(expectedKey) ||
    !providedKey ||
    !keysMatch(providedKey, expectedKey)
  ) {
    return errorResponse("Unauthorized", 401);
  }

  const userId = process.env.ADMIN_USER_ID?.trim();

  if (!userId) {
    return errorResponse("Internal server error", 500);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Malformed JSON", 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return errorResponse("Expected a JSON object", 400);
  }

  const { title, category, date, time, location, description } = body as Record<
    string,
    unknown
  >;

  if (
    !isString(title) ||
    !isString(category) ||
    !isString(date) ||
    !isString(time) ||
    !isString(location) ||
    !isString(description)
  ) {
    return errorResponse(
      "Title, category, date, time, location, and description are required strings",
      400
    );
  }

  const trimmedCategory = category.trim();

  if (!validCategoryOptions.includes(trimmedCategory)) {
    return errorResponse("Unsupported category", 400);
  }

  const eventDate = parseBoliviaDateTime(date.trim(), time.trim());

  if (!eventDate) {
    return errorResponse("Invalid date or time", 400);
  }

  if (eventDate.getTime() < Date.now()) {
    return errorResponse("Event start cannot be in the past", 400);
  }

  const trimmedTitle = title.trim();

  if (!slugify(trimmedTitle)) {
    return errorResponse("Title must contain characters that can form a slug", 400);
  }

  try {
    const event = await prisma.event.create({
      data: {
        slug: await createSlug(trimmedTitle),
        title: trimmedTitle,
        category: trimmedCategory,
        date: eventDate,
        location: location.trim(),
        description: description.trim(),
        userId,
        status: "pending",
        isHidden: false,
        image: null,
        latitude: null,
        longitude: null,
        rejectionReason: null,
      },
      select: { id: true, slug: true, status: true },
    });

    return Response.json(event, { status: 201 });
  } catch {
    return errorResponse("Internal server error", 500);
  }
}
