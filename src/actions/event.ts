"use server";

import { prisma } from "@/lib/prisma";
import { EventCategory, FERIA, GARAGE_SALE, KERMESSE } from "@/types/event";
import { isFile, isString } from "@/utils/validation";
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

  const eventDate = new Date(`${date}T${time}:00`);

  const payload = {
    slug: await createSlug(title),
    title,
    category,
    date: eventDate,
    location,
    description,
    userId,
  };

  const event = await prisma.event.create({
    data: payload,
  });

  redirect(`/events/${event.slug}`);
}
