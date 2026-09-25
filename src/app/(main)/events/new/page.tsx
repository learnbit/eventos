import EventForm from "@/components/EventForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function NewEventPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4">
      <EventForm />
    </div>
  );
}
