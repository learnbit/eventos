import EventForm from "@/components/EventForm";
import { events } from "@/data/events";
import { notFound } from "next/navigation";

type EditEventPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <EventForm event={event} />
    </div>
  );
}
