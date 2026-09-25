import CategoryFilter from "@/components/CategoryFilter";
import EventCard from "@/components/EventCard";
import { getEvents } from "@/data/events";

type AppPageProps = {
  searchParams: Promise<{
    category: string | undefined;
  }>;
};

export default async function AppPage({ searchParams }: AppPageProps) {
  const { category = "" } = await searchParams;
  const events = await getEvents(category);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Eventos en Cochabamba
        </h1>

        <p className="text-muted mt-2">
          Descubre ferias, kermesses y ventas de garage cerca de ti.
        </p>
      </div>

      <CategoryFilter activeCategory={category} />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
