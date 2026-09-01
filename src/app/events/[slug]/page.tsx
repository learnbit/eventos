import { events } from "@/data/events";
import { notFound } from "next/navigation";

type EventDetailProps = {
  params: Promise<{ slug: string }>;
};

export default async function EventPage({ params }: EventDetailProps) {
  const { slug } = await params;

  const event = events.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  return (
    <div>
      Title: {event.title}
      Category: {event.category}
      Location: {event.location}
    </div>
  );
}
