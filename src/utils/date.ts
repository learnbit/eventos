export function formatDate(date: string): string {
  const formatter = new Intl.DateTimeFormat("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return formatter.format(new Date(date));
}
