import { Event } from "@/types/event";
import { formatDate } from "@/utils/date";
import Link from "next/link";

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  const { title, category, location, date, slug } = event;

  return (
    <div className="bg-surface border border-border rounded-md p-4 w-full space-y-2">
      <h2 className="text-lg font-semibold">
        <Link href={`/events/${slug}`}>{title}</Link>
      </h2>
      <p className="text-sm">{category}</p>
      <p className="text-muted">{location}</p>
      <p className="text-muted">{formatDate(date)}</p>
    </div>
  );
}
