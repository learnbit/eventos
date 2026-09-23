import { setEventHidden } from "@/actions/event";
import { Event } from "@/types/event";
import { formatDate } from "@/utils/date";
import Link from "next/link";

type MyEventCardProps = {
  event: Event;
};

export default function MyEventCard({ event }: MyEventCardProps) {
  return (
    <div className="relative bg-surface border border-border rounded-md p-4 space-y-2">
      {event.status === "approved" && (
        <form
          className="absolute top-3 right-3"
          action={setEventHidden.bind(null, event.id, !event.isHidden)}
        >
          <button
            className="text-xs text-muted hover:text-foreground underline"
            type="submit"
          >
            {event.isHidden ? "Mostrar" : "Ocultar"}
          </button>
        </form>
      )}

      <h2 className="text-lg font-semibold pr-20">{event.title}</h2>
      <p className="text-sm">{event.category}</p>
      <p className="text-muted">{formatDate(event.date)}</p>
      <p className="text-sm">
        Estado:{" "}
        <span
          className={`inline-block rounded-md border border-border px-2 py-1 text-xs ${getStatusBadgeClassName(
            event.status
          )}`}
        >
          {event.status}
        </span>
        {event.isHidden && (
          <span className="ml-2 text-xs text-muted">Oculto</span>
        )}
      </p>
      {event.status === "rejected" && event.rejectionReason && (
        <p className="text-sm text-muted">Motivo: {event.rejectionReason}</p>
      )}
      <Link
        href={`/events/${event.slug}/edit`}
        className="inline-block text-sm underline"
      >
        Editar
      </Link>
    </div>
  );
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
