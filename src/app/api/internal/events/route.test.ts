import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const { createMock, findUniqueMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
  findUniqueMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    event: { create: createMock, findUnique: findUniqueMock },
  },
}));

const apiKey = "test-internal-api-key";
const candidate = {
  title: "Feria gastronómica de Tiquipaya",
  category: "feria",
  date: "2026-12-06",
  time: "09:00",
  location: "Tiquipaya, Cochabamba",
  description: "Feria de platos tradicionales.",
};
const createdEvent = {
  id: "event-1",
  slug: "feria-gastronomica-de-tiquipaya",
  status: "pending",
};

function request(body = JSON.stringify(candidate), key: string | null = apiKey) {
  const headers = new Headers({ "Content-Type": "application/json" });

  if (key !== null) {
    headers.set("x-internal-api-key", key);
  }

  return new Request("http://localhost/api/internal/events", {
    method: "POST",
    headers,
    body,
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-12-01T00:00:00Z"));
  vi.stubEnv("INTERNAL_API_KEY", apiKey);
  vi.stubEnv("ADMIN_USER_ID", "admin-1");

  findUniqueMock.mockResolvedValue(null);
  createMock.mockResolvedValue(createdEvent);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("POST /api/internal/events", () => {
  it.each([null, "wrong-key", "test-internal-api-kéy"])(
    "rejects missing or invalid credentials (%s)",
    async (key) => {
      const response = await POST(request("{", key));

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
      expect(findUniqueMock).not.toHaveBeenCalled();
      expect(createMock).not.toHaveBeenCalled();
    }
  );

  it.each([undefined, "", "   "])(
    "fails closed without an API key configured (%s)",
    async (configuredKey) => {
      vi.stubEnv("INTERNAL_API_KEY", configuredKey);

      const response = await POST(request());

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
      expect(createMock).not.toHaveBeenCalled();
    }
  );

  it("fails before persistence if the server has no admin ID", async () => {
    vi.stubEnv("ADMIN_USER_ID", undefined);

    const response = await POST(
      request(JSON.stringify({ ...candidate, userId: "caller-admin" }))
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Internal server error",
    });
    expect(findUniqueMock).not.toHaveBeenCalled();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON", async () => {
    const response = await POST(request("{"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Malformed JSON" });
    expect(createMock).not.toHaveBeenCalled();
  });

  it.each(Object.keys(candidate))("rejects a missing %s", async (field) => {
    const payload = { ...candidate, [field]: undefined };

    const response = await POST(request(JSON.stringify(payload)));

    expect(response.status).toBe(400);
    expect(createMock).not.toHaveBeenCalled();
  });

  it.each([
    ["null body", null],
    ["array body", []],
    ["blank title", { ...candidate, title: "   " }],
    ["non-string location", { ...candidate, location: 123 }],
    ["unsupported category", { ...candidate, category: "concert" }],
    ["non-ISO date", { ...candidate, date: "2026-12-6" }],
    ["invalid calendar date", { ...candidate, date: "2027-02-29" }],
    ["invalid time", { ...candidate, time: "24:00" }],
    ["non-padded time", { ...candidate, time: "9:00" }],
    ["unusable slug", { ...candidate, title: "🎉" }],
  ])("rejects invalid input with %s", async (_label, payload) => {
    const response = await POST(request(JSON.stringify(payload)));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: expect.any(String) });
    expect(findUniqueMock).not.toHaveBeenCalled();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("rejects an event that already started on the same Bolivia date", async () => {
    vi.setSystemTime(new Date("2026-12-06T13:01:00Z"));

    const response = await POST(request());

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Event start cannot be in the past",
    });
    expect(createMock).not.toHaveBeenCalled();
  });

  it("creates a pending event with trimmed input and server-owned fields", async () => {
    const payload = {
      title: `  ${candidate.title}  `,
      category: " feria ",
      date: " 2026-12-06 ",
      time: " 09:00 ",
      location: `  ${candidate.location}  `,
      description: `  ${candidate.description}  `,
      id: "caller-id",
      slug: "caller-slug",
      userId: "caller-user",
      status: "approved",
      isHidden: true,
      image: "caller-image",
      latitude: -17.34,
      longitude: -66.22,
      rejectionReason: "caller-reason",
    };

    const response = await POST(request(JSON.stringify(payload)));

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual(createdEvent);
    expect(findUniqueMock).toHaveBeenCalledExactlyOnceWith({
      where: { slug: createdEvent.slug },
      select: { id: true },
    });
    expect(createMock).toHaveBeenCalledExactlyOnceWith({
      data: {
        slug: createdEvent.slug,
        title: candidate.title,
        category: candidate.category,
        date: new Date("2026-12-06T13:00:00Z"),
        location: candidate.location,
        description: candidate.description,
        userId: "admin-1",
        status: "pending",
        isHidden: false,
        image: null,
        latitude: null,
        longitude: null,
        rejectionReason: null,
      },
      select: { id: true, slug: true, status: true },
    });
  });

  it("handles a valid leap day that rolls into the next UTC date", async () => {
    const response = await POST(
      request(JSON.stringify({ ...candidate, date: "2028-02-29", time: "23:30" }))
    );

    expect(response.status).toBe(201);
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ date: new Date("2028-03-01T03:30:00Z") }),
      })
    );
  });

  it.each(["slug lookup", "event creation"])(
    "returns a generic error when the database fails during %s",
    async (operation) => {
      const failingQuery = operation === "slug lookup" ? findUniqueMock : createMock;
      failingQuery.mockRejectedValueOnce(new Error("Database connection details"));

      const response = await POST(request());

      expect(response.status).toBe(500);
      await expect(response.json()).resolves.toEqual({
        error: "Internal server error",
      });
    }
  );
});
