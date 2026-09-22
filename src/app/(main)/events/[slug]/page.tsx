import { getEventBy } from "@/data/events";
import { formatDate } from "@/utils/date";
import { getEventImageUrl } from "@/utils/image";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type EventDetailProps = {
  params: Promise<{ slug: string }>;
};

export default async function EventPage({ params }: EventDetailProps) {
  const { slug } = await params;

  const event = await getEventBy(slug);
  const { userId } = await auth();

  if (!event) {
    notFound();
  }

  const eventImageUrl = event?.image ? getEventImageUrl(event?.image) : null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4">
      <div className="py-4 flex items-center justify-between">
        <Link className="text-muted hover:text-foreground" href="/">
          ← Volver a eventos
        </Link>

        {userId === event.userId && (
          <Link
            className="text-muted hover:text-foreground"
            href={`/events/${event.slug}/edit`}
          >
            Editar
          </Link>
        )}
      </div>
      <div className="w-full relative aspect-16/7 overflow-hidden rounded-md border border-border bg-surface">
        {eventImageUrl ? (
          <Image
            className="object-cover"
            src={eventImageUrl}
            alt={event.title}
            fill
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            Sin imagen
          </div>
        )}
      </div>
      <div className="max-w-2xl flex flex-col gap-2 py-4">
        <p className="text-2xl font-semibold">{event.title}</p>
        <p className="text-sm text-muted">{event.category}</p>
        <p className="text-sm text-muted">{formatDate(event.date)}</p>
        <p className="text-sm text-muted">{event.location}</p>
        <p className="mt-2">{event.description}</p>
      </div>
    </div>
  );
}
