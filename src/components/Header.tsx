import { isAdmin } from "@/lib/auth";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Header() {
  const { userId } = await auth();
  const admin = isAdmin(userId);

  return (
    <header className="w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold">
            Eventos
          </Link>
          <Show when="signed-in">
            <Link href="/events/new" className="text-muted">
              Crear evento
            </Link>

            <Link href="/my-events" className="text-muted">
              Mis eventos
            </Link>

            {admin && (
              <Link href="/admin/events" className="text-muted">
                Pendientes
              </Link>
            )}
          </Show>
        </div>

        <div className="flex items-center">
          <Show when="signed-out">
            <SignInButton />
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
