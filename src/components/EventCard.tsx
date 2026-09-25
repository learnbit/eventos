import { categoryLabels } from "@/constants/event";
import type { Event } from "@/generated/prisma/client";
import { formatDate } from "@/utils/date";
import { getEventImageUrl } from "@/utils/image";
import Image from "next/image";
import Link from "next/link";

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  const { title, category, location, date, slug, image } = event;
  const eventImageUrl = image ? getEventImageUrl(image) : null;

  return (
    <Link
      href={`/events/${slug}`}
      className="group w-full overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:bg-surface-hover"
    >
      <div className="relative aspect-video w-full bg-background overflow-hidden">
        {eventImageUrl ? (
          <Image
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            src={eventImageUrl}
            alt={title}
            fill
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted text-sm">
            Sin imagen
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="mb-1 text-sm text-primary">
          {categoryLabels[category] ?? category}
        </p>
        <h2 className="text-lg font-semibold tracking-tight line-clamp-2">
          {title}
        </h2>
        <div className="mt-4 space-y-1 text-sm text-muted">
          <p>{formatDate(date)}</p>
          <p>{location}</p>
        </div>
      </div>
    </Link>
  );
}
