export const GARAGE_SALE = "garage-sale";
export const KERMESSE = "kermesse";
export const FERIA = "feria";

export type EventCategory = typeof GARAGE_SALE | typeof KERMESSE | typeof FERIA;
export const validCategoryOptions = [GARAGE_SALE, KERMESSE, FERIA];

export type Event = {
  id: string;
  slug: string;
  title: string;
  image: string;
  date: string;
  location: string;
  description: string;
  category: EventCategory;
};
