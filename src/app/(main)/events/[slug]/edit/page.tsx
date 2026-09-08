import EventForm from "@/components/EventForm";
import { events } from "@/data/events";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

type EditEventPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { slug } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const event = events.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <EventForm event={event} />
    </div>
  );
}
