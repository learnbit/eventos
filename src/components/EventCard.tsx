import { Event } from "@/types/event";
import Link from "next/link";

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  const { title, category, location, date, slug } = event;

  return (
    <div>
      <h2>{title}</h2>
      <p>
        <Link href={`/events/${slug}`}>{slug}</Link>
      </p>
      <p>{category}</p>
      <p>{location}</p>
      <p>{date}</p>
    </div>
  );
}
