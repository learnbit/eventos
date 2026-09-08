"use server";

import { EventCategory, FERIA, GARAGE_SALE, KERMESSE } from "@/types/event";
import { isFile, isString } from "@/utils/validation";
import { auth } from "@clerk/nextjs/server";

function isValidCategory(value: unknown): value is EventCategory {
  return value === GARAGE_SALE || value === KERMESSE || value === FERIA;
}

function createSlug(title: string) {
  return title.toLowerCase().trim().replace(/\s+/g, "-");
}

export async function createEvent(formData: FormData) {
  const title = formData.get("title");
  const category = formData.get("category");
  const image = formData.get("image");
  const date = formData.get("date");
  const time = formData.get("time");
  const location = formData.get("location");
  const description = formData.get("description");

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User needs to be authenticated.");
  }

  if (!isString(title)) {
    throw new Error("Title is invalid.");
  }

  if (!isValidCategory(category)) {
    throw new Error("Category is invalid.");
  }

  if (!isFile(image)) {
    throw new Error("Image is invalid.");
  }

  if (!isString(date)) {
    throw new Error("Date is invalid.");
  }

  if (!isString(time)) {
    throw new Error("Time is invalid.");
  }

  if (!isString(location)) {
    throw new Error("Location is invalid.");
  }

  if (!isString(description)) {
    throw new Error("Description is invalid.");
  }

  const payload = {
    slug: createSlug(title),
    title,
    category,
    date: `${date}T${time}:00`,
    location,
    description,
    userId,
  };

  console.log({ payload, image });
}
