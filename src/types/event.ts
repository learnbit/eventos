export type { Event } from "@/generated/prisma/client";

export const GARAGE_SALE = "garage-sale";
export const KERMESSE = "kermesse";
export const FERIA = "feria";
export const MEETUP = "meetup";

export type EventCategory =
  | typeof GARAGE_SALE
  | typeof KERMESSE
  | typeof FERIA
  | typeof MEETUP;
export const validCategoryOptions = [GARAGE_SALE, KERMESSE, FERIA, MEETUP];

export type EventFormValues = {
  title?: string;
  category?: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
};

export type CreateEventState = {
  error: string | null;
  values?: EventFormValues;
};
