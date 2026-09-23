export function isAdmin(userId: string | null) {
  return userId === process.env.ADMIN_USER_ID;
}
