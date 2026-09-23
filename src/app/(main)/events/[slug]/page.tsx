import { approveEvent, rejectEvent } from "@/actions/event";
import { getEventBy } from "@/data/events";
import { isAdmin } from "@/lib/auth";
import { formatDate } from "@/utils/date";
import { getEventImageUrl } from "@/utils/image";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type EventDetailProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
};

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

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4">
      <div className="py-4 flex items-center justify-between">
        <Link className="text-muted hover:text-foreground" href={backHref}>
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
      <div className="w-full flex flex-col gap-2 py-4">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold">{event.title}</p>
          {isAdmin(userId) && event.status === "pending" && (
            <div className="flex gap-2">
              <ApproveButton eventId={event.id} />
              <RejectButton eventId={event.id} />
            </div>
          )}

          {isAdmin(userId) && event.status === "approved" && (
            <div className="flex gap-2">
              <RejectButton eventId={event.id} />
            </div>
          )}
        </div>

        <p className="text-sm text-muted">{event.category}</p>
        <p className="text-sm text-muted">{formatDate(event.date)}</p>
        <p className="text-sm text-muted">{event.location}</p>
        <p className="mt-2">{event.description}</p>
      </div>
    </div>
  );
}

function ApproveButton({ eventId }: { eventId: string }) {
  return (
    <form action={approveEvent.bind(null, eventId)}>
      <button
        className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
        type="submit"
      >
        Aprobar
      </button>
    </form>
  );
}

function RejectButton({ eventId }: { eventId: string }) {
  return (
    <form className="flex gap-2" action={rejectEvent.bind(null, eventId)}>
      <input
        className="flex-1 border border-border rounded-md bg-background px-3 py-1.5 text-sm"
        type="text"
        name="reason"
        placeholder="Motivo del rechazo"
        required
      />
      <button
        className="border border-border rounded-md px-3 py-1.5 text-sm hover:bg-muted"
        type="submit"
      >
        Rechazar
      </button>
    </form>
  );
}
