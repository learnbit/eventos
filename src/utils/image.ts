export function getEventImageUrl(key: string) {
  return `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${key}`;
}
