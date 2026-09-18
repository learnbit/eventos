export type { Event } from "@/generated/prisma/client";

export const GARAGE_SALE = "garage-sale";
export const KERMESSE = "kermesse";
export const FERIA = "feria";

export type EventCategory = typeof GARAGE_SALE | typeof KERMESSE | typeof FERIA;
export const validCategoryOptions = [GARAGE_SALE, KERMESSE, FERIA];

export type CreateEventState = {
  error: string | null;
};
