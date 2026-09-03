import { Event } from "@/types/event";
import { formatDate } from "@/utils/date";
import Image from "next/image";
import Link from "next/link";

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  const { title, category, location, date, slug, image } = event;

  return (
    <div className="bg-surface border border-border rounded-md p-4 w-full space-y-2">
      <div className="w-full relative bg-surface-hover rounded-md mb-4 aspect-video overflow-hidden">
        <Image className="object-cover" src={image} alt={"event image"} fill />
      </div>
      <h2 className="text-lg font-semibold">
        <Link href={`/events/${slug}`}>{title}</Link>
      </h2>
      <p className="text-sm">{category}</p>
      <p className="text-muted">{location}</p>
      <p className="text-muted">{formatDate(date)}</p>
    </div>
  );
}
