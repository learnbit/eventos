import CategoryFilter from "@/components/CategoryFilter";
import EventCard from "@/components/EventCard";
import { events } from "@/data/events";
import { validCategoryOptions } from "@/types/event";

type AppPageProps = {
  searchParams: Promise<{ category: string | undefined }>;
};

export default async function AppPage({ searchParams }: AppPageProps) {
  const { category = "" } = await searchParams;
  let filteredEvents = [];

  if (validCategoryOptions.includes(category)) {
    filteredEvents = events.filter((event) => {
      const eventCategory = event.category;

      return eventCategory === category;
    });
  } else {
    filteredEvents = [...events];
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4">
      <CategoryFilter activeCategory={category} />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
