"use client";

import Link from "next/link";
import { useState } from "react";

type MobileNavProps = {
  isAdmin: boolean;
};

export default function MobileNav({ isAdmin }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative sm:hidden">
      <button
        type="button"
        className="text-sm text-muted hover:text-foreground"
        onClick={() => setIsOpen((open) => !open)}
      >
        Menú
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-50 min-w-40 border border-border rounded-md bg-background p-2 shadow-lg">
          <nav className="flex flex-col text-sm">
            <Link
              href="/events/new"
              className="rounded px-3 py-2 hover:bg-surface-hover"
              onClick={() => setIsOpen(false)}
            >
              Crear evento
            </Link>
            <Link
              href="/my-events"
              className="rounded px-3 py-2 hover:bg-surface-hover"
              onClick={() => setIsOpen(false)}
            >
              Mis eventos
            </Link>
            {isAdmin && (
              <Link
                href="/admin/events"
                className="rounded px-3 py-2 hover:bg-surface-hover"
                onClick={() => setIsOpen(false)}
              >
                Pendientes
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
