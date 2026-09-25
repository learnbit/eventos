"use client";

import Link from "next/link";

type ErrorPageProps = {
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="max-w-xl">
        <p className="text-sm text-primary">Error</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Algo salio mal
        </h1>

        <p className="mt-3 text-muted">
          No pudimos cargar esta pagina. Intenta nuevamente.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className="cursor-pointer rounded-md bg-primary px-4 py-2.5 font-medium transition-colors hover:bg-primary-hover"
            onClick={() => reset()}
          >
            Intentar nuevamente
          </button>

          <Link
            href="/"
            className="rounded-md border border-border px-4 py-2.5 font-medium transition-colors hover:bg-surface-hover"
          >
            Volver a inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
