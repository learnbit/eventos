import { events } from "@/data/events";
import { formatDate } from "@/utils/date";
import Image from "next/image";
import Link from "next/link";
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
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="py-4">
        <Link className="text-muted hover:text-foreground" href="/">
          ← Volver a eventos
        </Link>
      </div>
      <div className="w-full relative aspect-video overflow-hidden rounded-md">
        <Image
          className="object-cover"
          src={event.image}
          alt={"event image detail"}
          fill
        />
      </div>
      <div className="flex flex-col gap-2 py-2">
        <p className="text-2xl font-semibold">{event.title}</p>
        <p className="text-sm text-muted">{event.category}</p>
        <p className="text-sm text-muted">{formatDate(event.date)}</p>
        <p className="text-sm text-muted">{event.location}</p>
        <p className="mt-2">{event.description}</p>
      </div>
    </div>
  );
}
