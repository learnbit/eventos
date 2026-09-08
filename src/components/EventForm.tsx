"use client";

import { createEvent } from "@/actions/event";
import { Event, FERIA, GARAGE_SALE, KERMESSE } from "@/types/event";
import { getDateAndTime } from "@/utils/date";
import Image from "next/image";
import { ChangeEvent, useState } from "react";

type EventFormProps = {
  event?: Event;
};

export default function EventForm({ event }: EventFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    event?.image ?? null
  );
  const { date, time } = getDateAndTime(event?.date);

  const buttonTitle = event ? "Guardar cambios" : "Crear evento";
  const formTitle = event ? "Modificar evento" : "Crear evento";

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  }

  return (
    <form className="max-w-2xl flex flex-col gap-4" action={createEvent}>
      <h1 className="text-2xl font-semibold mb-4">{formTitle}</h1>
      <div className="flex flex-col gap-2">
        <label>Titulo</label>
        <input
          type="text"
          name="title"
          className="bg-surface border border-border rounded-md px-2 py-1 text-foreground"
          defaultValue={event?.title}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label>Categoria</label>
        <select
          name="category"
          className="bg-surface border border-border rounded-md px-2 py-1 text-foreground"
          defaultValue={event?.category}
        >
          <option value={GARAGE_SALE}>Venta de Garage</option>
          <option value={KERMESSE}>Kermesse</option>
          <option value={FERIA}>Feria</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label>Imagen</label>
        {imagePreview && (
          <div className="relative w-full aspect-video overflow-hidden rounded-md">
            <Image
              className="object-cover"
              src={imagePreview}
              alt="Vista previa del evento"
              fill
            />
          </div>
        )}

        <input
          className="bg-surface border border-border rounded-md px-2 py-1 text-foreground"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          name="image"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex flex-col gap-2">
          <label>Fecha</label>
          <input
            type="date"
            className="bg-surface border border-border rounded-md px-2 py-1 text-foreground"
            defaultValue={date}
            name="date"
          />
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <label>Hora</label>
          <input
            type="time"
            className="bg-surface border border-border rounded-md px-2 py-1 text-foreground"
            defaultValue={time}
            name="time"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label>Ubicacion</label>
        <input
          type="text"
          className="bg-surface border border-border rounded-md px-2 py-1 text-foreground"
          defaultValue={event?.location}
          name="location"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label>Descripcion</label>
        <textarea
          className="bg-surface border border-border rounded-md px-2 py-1 text-foreground min-h-30"
          defaultValue={event?.description}
          name="description"
        />
      </div>

      <button className="w-fit bg-primary hover:bg-primary-hover px-2 py-2 rounded-md font-medium">
        {buttonTitle}
      </button>
    </form>
  );
}
