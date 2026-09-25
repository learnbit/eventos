export default function Footer() {
  return (
    <footer className="mt-12 border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-muted">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>Eventos Cochabamba · Hecho por Wilson Balderrama</p>

          <a
            href="https://wa.me/59174319337"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Contacto por WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
