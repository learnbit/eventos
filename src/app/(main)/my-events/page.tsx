import MyEventCard from "@/components/MyEventCard";
import { getEventsByUser } from "@/data/events";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function MyEventsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const events = await getEventsByUser(userId);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4">
      <h1 className="text-2xl font-semibold mb-4">Mis Eventos</h1>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <MyEventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
