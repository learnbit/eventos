import { prisma } from "@/lib/prisma";

export function getEventBy(slug: string) {
  return prisma.event.findUnique({ where: { slug } });
}

export function getEventsByUser(userId: string) {
  return prisma.event.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export function getEvents(category: string) {
  return prisma.event.findMany({
    where: {
      status: "approved",
      isHidden: false,
      date: {
        gte: new Date(),
      },
      ...(category ? { category } : {}),
    },
    orderBy: {
      date: "asc",
    },
  });
}

export function getPendingEvents() {
  return prisma.event.findMany({
    where: {
      status: "pending",
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}
