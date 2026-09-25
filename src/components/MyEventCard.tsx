import { setEventHidden } from "@/actions/event";
import { categoryLabels } from "@/constants/event";
import { Event } from "@/types/event";
import { formatDate } from "@/utils/date";
import Link from "next/link";

type MyEventCardProps = {
  event: Event;
};

export default function MyEventCard({ event }: MyEventCardProps) {
  return (
    <div className="flex flex-col h-full border border-border rounded-lg bg-surface p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-primary">
          {categoryLabels[event.category] ?? event.category}
        </p>

        {event.status === "approved" && (
          <form action={setEventHidden.bind(null, event.id, !event.isHidden)}>
            <button
              className="shrink-0 text-sm text-muted transition-colors hover:text-foreground"
              type="submit"
            >
              {event.isHidden ? "Mostrar" : "Ocultar"}
            </button>
          </form>
        )}
      </div>

      <h2 className="mt-2 text-lg font-semibold tracking-tight line-clamp-2">
        {event.title}
      </h2>

      <p className="mt-4 text-sm text-muted">{formatDate(event.date)}</p>

      <div className="mt-4 flex items-center gap-2">
        <span
          className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${getStatusBadgeClassName(
            event.status
          )}`}
        >
          {getStatusLabel(event.status)}
        </span>
        {event.isHidden && <span className="text-xs text-muted">Oculto</span>}
      </div>

      {event.status === "rejected" && event.rejectionReason && (
        <div className="mt-4 rounded-md border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-xs font-medium text-red-300">Motivo del rechazo</p>
          <p className="mt-1 text-sm text-muted">{event.rejectionReason}</p>
        </div>
      )}

      <div className="mt-auto pt-5">
        <Link
          href={`/events/${event.slug}/edit`}
          className="inline-flex rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-surface-hover"
        >
          Editar
        </Link>
      </div>
    </div>
  );
}

function getStatusLabel(status: Event["status"]) {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "approved":
      return "Aprobado";
    case "rejected":
      return "Rechazado";
  }
}

function getStatusBadgeClassName(status: Event["status"]) {
  switch (status) {
    case "pending":
      return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";
    case "approved":
      return "bg-green-500/10 text-green-300 border-green-500/30";
    case "rejected":
      return "bg-red-500/10 text-red-300 border-red-500/30";
    default:
      return "bg-surface text-foreground border-border";
  }
}
