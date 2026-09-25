import { approveEvent, rejectEvent } from "@/actions/event";
import { categoryLabels } from "@/constants/event";
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
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
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
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-background">
          {eventImageUrl ? (
            <Image
              className="object-cover"
              src={eventImageUrl}
              alt={event.title}
              fill
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              Sin imagen
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-sm text-primary">
            {categoryLabels[event.category] ?? event.category}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {event.title}
          </h1>

          <div className="mt-6 space-y-2 text-sm text-muted">
            <p>{formatDate(event.date)}</p>
            <p>{event.location}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 max-w-3xl">
        <h2 className="mb-3 text-lg font-semibold">Descripcion</h2>
        <p className="whitespace-pre-line break-words leading-7 text-foreground">
          {event.description}
        </p>
      </div>

      {isAdmin(userId) &&
        (event.status === "pending" || event.status === "approved") && (
          <div className="mt-10 border-t border-border pt-6">
            <p className="mb-4 text-sm font-medium">Administracion</p>
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
    <form className="flex gap-2" action={rejectEvent.bind(null, eventId)}>
      <input
        className="flex-1 border border-border rounded-md bg-background px-3 py-1.5 text-sm"
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
