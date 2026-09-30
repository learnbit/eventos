import { prisma } from "@/lib/prisma";

export function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createSlug(title: string, eventIdToIgnore?: string) {
  const baseSlug = slugify(title);

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existingEvent = await prisma.event.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existingEvent || existingEvent.id === eventIdToIgnore) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
