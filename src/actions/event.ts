"use server";

import { prisma } from "@/lib/prisma";
import { deleteFileFromS3, uploadFileToS3 } from "@/lib/s3";
import {
  CreateEventState,
  EventCategory,
  FERIA,
  GARAGE_SALE,
  KERMESSE,
} from "@/types/event";
import { isString } from "@/utils/validation";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

function isValidCategory(value: unknown): value is EventCategory {
  return value === GARAGE_SALE || value === KERMESSE || value === FERIA;
}

async function createSlug(title: string) {
  const baseSlug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let slug = baseSlug;
  let counter = 2;

  while (await prisma.event.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter = counter + 1;
  }

  return slug;
}

export async function createEvent(
  _prevState: CreateEventState,
  formData: FormData
): Promise<CreateEventState> {
  const title = formData.get("title");
  const category = formData.get("category");
  const date = formData.get("date");
  const time = formData.get("time");
  const location = formData.get("location");
  const description = formData.get("description");
  const image = formData.get("image");

  const { userId } = await auth();

  if (!userId) {
    return { error: "User needs to be authenticated." };
  }

  if (!isString(title) || !title.trim()) {
    return { error: "Title is invalid." };
  }

  if (!isValidCategory(category)) {
    return { error: "Category is invalid." };
  }

  if (!isString(date) || !date.trim()) {
    return { error: "Date is invalid." };
  }

  if (!isString(time) || !time.trim()) {
    return { error: "Time is invalid." };
  }

  if (!isString(location) || !location.trim()) {
    return { error: "Location is invalid." };
  }

  if (!isString(description) || !description.trim()) {
    return { error: "Description is invalid." };
  }

  let imageKey: string | null = null;
  let event;

  try {
    if (image instanceof File && image.size > 0) {
      imageKey = await uploadFileToS3(image);
    }

    const eventDate = new Date(`${date}T${time}:00`);

    const payload = {
      slug: await createSlug(title),
      title,
      category,
      date: eventDate,
      location,
      description,
      userId,
      image: imageKey,
    };

    event = await prisma.event.create({
      data: payload,
    });
  } catch (e) {
    if (imageKey) {
      try {
        await deleteFileFromS3(imageKey);
      } catch (cleanupError) {
        console.error("Failed to delete orphaned S3 image:", cleanupError);
      }
    }

    throw e;
  }

  redirect(`/events/${event.slug}`);
}
