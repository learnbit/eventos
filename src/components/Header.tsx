import { Show, SignInButton, UserAvatar } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
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
          </Show>
        </div>

        <div className="flex items-center">
          <Show when="signed-out">
            <SignInButton />
          </Show>

          <Show when="signed-in">
            <UserAvatar />
          </Show>
        </div>
      </div>
    </header>
  );
}
