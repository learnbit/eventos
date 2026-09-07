import { FERIA, GARAGE_SALE, KERMESSE } from "@/types/event";

export default function NewEventPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <h1 className="text-2xl font-semibold mb-4">Crear evento</h1>
      <form className="max-w-2xl flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label>Titulo</label>
          <input
            type="text"
            className="bg-surface border border-border rounded-md px-2 py-1 text-foreground"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Categoria</label>
          <select className="bg-surface border border-border rounded-md px-2 py-1 text-foreground">
            <option value={GARAGE_SALE}>Venta de Garage</option>
            <option value={KERMESSE}>Kermesse</option>
            <option value={FERIA}>Feria</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label>Imagen</label>
          <input
            type="file"
            className="bg-surface border border-border rounded-md px-2 py-1 text-foreground"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex flex-col gap-2">
            <label>Fecha</label>
            <input
              type="date"
              className="bg-surface border border-border rounded-md px-2 py-1 text-foreground"
            />
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <label>Hora</label>
            <input
              type="time"
              className="bg-surface border border-border rounded-md px-2 py-1 text-foreground"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label>Ubicacion</label>
          <input
            type="text"
            className="bg-surface border border-border rounded-md px-2 py-1 text-foreground"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Descripcion</label>
          <textarea className="bg-surface border border-border rounded-md px-2 py-1 text-foreground min-h-30" />
        </div>

        <button className="w-fit bg-primary hover:bg-primary-hover px-2 py-2 rounded-md font-medium">
          Crear
        </button>
      </form>
    </div>
  );
}
