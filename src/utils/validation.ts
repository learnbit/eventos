export function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

export function isFile(value: unknown): value is File {
  return value instanceof File && value.size > 0;
}
