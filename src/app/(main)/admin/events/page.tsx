import { getPendingEvents } from "@/data/events";
import { isAdmin } from "@/lib/auth";
import { formatDate } from "@/utils/date";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AdminEventsPage() {
  const { userId } = await auth();

  if (!isAdmin(userId)) {
    notFound();
  }

  const events = await getPendingEvents();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Eventos Pendientes
        </h1>
        <p className="mt-2 text-sm text-muted">
          Revisa los eventos que esperan aprobacion
        </p>
      </div>
      {events.length === 0 ? (
        <p className="text-sm text-muted">No hay eventos pendientes.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug}?from=admin`}
              className="block rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface-hover"
            >
              <h2 className="text-lg font-semibold tracking-tight line-clamp-2">
                {event.title}
              </h2>

              <p className="mt-3 text-sm text-muted">
                Actualizado: {formatDate(event.updatedAt)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
