import { prisma } from "@/lib/prisma";

export function getEventBy(slug: string) {
  return prisma.event.findUnique({ where: { slug } });
}

export function getEvents(category: string) {
  return prisma.event.findMany({
    where: category ? { category } : undefined,
    orderBy: {
      date: "asc",
    },
  });
}
