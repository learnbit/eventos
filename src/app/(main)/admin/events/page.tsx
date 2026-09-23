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
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Eventos Pendientes</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.slug}?from=admin`}
            className="block rounded-md border border-border bg-surface p-4 space-y-3 hover:bg-muted/50"
          >
            <h2 className="text-lg font-semibold">{event.title}</h2>

            <p className="mt-1 text-sm text-muted">
              Actualizado: {formatDate(event.updatedAt)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
