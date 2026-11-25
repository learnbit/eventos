import { createSlug } from "@/lib/event";
import { prisma } from "@/lib/prisma";
import { CreateEventInput } from "@/types/event";

export async function createEventRecord(input: CreateEventInput) {
  const existingEvent = await prisma.event.findFirst({
    where: {
      title: input.title,
      date: input.date,
      location: input.location,
    },
  });

  if (existingEvent) {
    return {
      created: false,
      event: existingEvent,
    };
  }

  const slug = await createSlug(input.title);

  const event = await prisma.event.create({
    data: {
      ...input,
      slug,
      status: "pending",
    },
  });

  return {
    created: true,
    event,
  };
}
