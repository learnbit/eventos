import { approveEvent, rejectEvent } from "@/actions/event";
import EventImage from "@/components/EventImage";
import EventLocationMap from "@/components/EventLocationMap";
import { categoryLabels } from "@/constants/event";
import { getEventBy } from "@/data/events";
import { isAdmin } from "@/lib/auth";
import { formatDate } from "@/utils/date";
import { getEventImageUrl } from "@/utils/image";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type EventDetailProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
};

export async function generateMetadata({
  params,
}: EventDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBy(slug);

  if (!event) {
    return {
      title: "Evento no encontrado.",
    };
  }

  const eventDescription =
    event.description.length > 160
      ? `${event.description.slice(0, 157)}...`
      : event.description;

  const imageUrl = event.image ? getEventImageUrl(event.image) : undefined;

  return {
    title: event.title,
    description: eventDescription,
    openGraph: {
      title: event.title,
      description: eventDescription,
      type: "article",
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function EventPage({
  params,
  searchParams,
}: EventDetailProps) {
  const { slug } = await params;
  const { from } = await searchParams;
  const backHref =
    from === "admin"
      ? "/admin/events"
      : from === "my-events"
      ? "/my-events"
      : "/";

  const event = await getEventBy(slug);
  const { userId } = await auth();

  if (!event) {
    notFound();
  }

  const canView =
    (event.status === "approved" && !event.isHidden) ||
    event.userId === userId ||
    isAdmin(userId);

  if (!canView) {
    notFound();
  }

  const eventImageUrl = event.image ? getEventImageUrl(event?.image) : null;
  const hasLocation = event.latitude != null && event.longitude != null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Link
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
          href={backHref}
        >
          <span aria-hidden="true">←</span>
          Volver
        </Link>

        {userId === event.userId && (
          <Link
            className="text-sm text-muted hover:text-foreground transition-colors"
            href={`/events/${event.slug}/edit`}
          >
            Editar
          </Link>
        )}
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="order-2 min-w-0 lg:order-1 mt-2 lg:mt-0">
          {eventImageUrl ? (
            <EventImage
              src={eventImageUrl}
              alt={event.title}
              stretchOnDesktop={hasLocation}
            />
          ) : (
            <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-surface">
              <div className="flex h-full items-center justify-center text-sm text-muted">
                Sin imagen
              </div>
            </div>
          )}
        </div>

        <div className="order-1 min-w-0 lg:order-2 flex flex-col">
          <p className="text-sm text-primary">
            {categoryLabels[event.category] ?? event.category}
          </p>

          <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
            {event.title}
          </h1>

          <div className="mt-4 space-y-2 text-sm text-muted">
            <p>{formatDate(event.date)}</p>
            <p>{event.location}</p>
            {event.latitude != null && event.longitude != null && (
              <div className="mt-6">
                <EventLocationMap
                  latitude={event.latitude}
                  longitude={event.longitude}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 max-w-3xl">
        <h2 className="mb-3 text-lg font-semibold">Descripción</h2>
        <p className="whitespace-pre-line break-words leading-7 text-foreground">
          {event.description}
        </p>
      </div>

      {isAdmin(userId) &&
        (event.status === "pending" || event.status === "approved") && (
          <div className="mt-10 border-t border-border pt-6">
            <p className="mb-4 text-sm font-medium">Administración</p>
            <div className="flex flex-wrap gap-3">
              {event.status === "pending" && (
                <ApproveButton eventId={event.id} />
              )}
              <RejectButton eventId={event.id} />
            </div>
          </div>
        )}
    </div>
  );
}

function ApproveButton({ eventId }: { eventId: string }) {
  return (
    <form action={approveEvent.bind(null, eventId)}>
      <button
        className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-surface-hover"
        type="submit"
      >
        Aprobar
      </button>
    </form>
  );
}

function RejectButton({ eventId }: { eventId: string }) {
  return (
    <form
      className="flex flex-col sm:flex-row gap-2"
      action={rejectEvent.bind(null, eventId)}
    >
      <input
        className="w-full sm:flex-1 border border-border rounded-md bg-background px-3 py-1.5 text-sm"
        type="text"
        name="reason"
        placeholder="Motivo del rechazo"
        required
      />
      <button
        className="border border-border rounded-md px-3 py-1.5 text-sm hover:bg-surface-hover"
        type="submit"
      >
        Rechazar
      </button>
    </form>
  );
}
