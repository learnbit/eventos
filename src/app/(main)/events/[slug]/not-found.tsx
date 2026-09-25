import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="max-w-xl">
        <p className="text-sm text-primary">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Pagina no encontrada
        </h1>

        <p className="mt-3 text-muted">
          La pagina o el evento que buscas no existe o ya no esta disponible.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2.5 font-medium transition-colors hover:bg-primary-hover"
        >
          Volver a eventos
        </Link>
      </div>
    </div>
  );
}
