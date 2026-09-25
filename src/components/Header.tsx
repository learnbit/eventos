import { isAdmin } from "@/lib/auth";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import NavLink from "./NavLink";

export default async function Header() {
  const { userId } = await auth();
  const admin = isAdmin(userId);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="max-w-7xl mx-auto px-3 py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight hover:text-primary transition-colors"
          >
            Eventos
          </Link>
          <Show when="signed-in">
            <nav className="flex items-center gap-6 text-sm">
              <NavLink href="/events/new">Crear evento</NavLink>

              <NavLink href="/my-events">Mis eventos</NavLink>

              {admin && <NavLink href="/admin/events">Pendientes</NavLink>}
            </nav>
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
