"use client";

import { createEvent, updateEvent } from "@/actions/event";
import { Event, FERIA, GARAGE_SALE, KERMESSE } from "@/types/event";
import { getDateAndTime } from "@/utils/date";
import Image from "next/image";
import { ChangeEvent, useActionState, useState } from "react";
import SubmitButton from "./SubmitButton";
import { getEventImageUrl } from "@/utils/image";
import {
  IMAGE_EXTENSION_BY_MIME_TYPE,
  MAX_IMAGE_SIZE,
  MAX_IMAGE_SIZE_MB,
} from "@/constants/image";

type EventFormProps = {
  event?: Event;
};

export default function EventForm({ event }: EventFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    event?.image ? getEventImageUrl(event.image) : null
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const { date, time } = getDateAndTime(event?.date);

  const action = event ? updateEvent.bind(null, event.id) : createEvent;

  const [state, formAction] = useActionState(action, {
    error: null,
  });

  const formTitle = event ? "Modificar evento" : "Crear evento";

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!IMAGE_EXTENSION_BY_MIME_TYPE[file.type]) {
      setImageError("Solo se permiten imagenes JPG, PNG o WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(`La imagen no puede superar los ${MAX_IMAGE_SIZE_MB} MB.`);
      event.target.value = "";
      return;
    }

    if (file.size === 0) {
      setImageError("El archivo esta vacio.");
      event.target.value = "";
      return;
    }

    setImageError(null);
    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  }

  return (
    <form className="max-w-2xl flex flex-col gap-4" action={formAction}>
      <h1 className="text-2xl font-semibold mb-4">{formTitle}</h1>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div className="flex flex-col gap-2">
        <label>Titulo</label>
        <input
          type="text"
          name="title"
          className="bg-surface border border-border rounded-md px-2 py-1 text-foreground"
          defaultValue={event?.title}
          required
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
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          name="image"
        />
        {imageError && <p className="text-sm text-red-500">{imageError}</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex flex-col gap-2">
          <label>Fecha</label>
          <input
            type="date"
            className="bg-surface border border-border rounded-md px-2 py-1 text-foreground"
            defaultValue={date}
            name="date"
            required
          />
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <label>Hora</label>
          <input
            type="time"
            className="bg-surface border border-border rounded-md px-2 py-1 text-foreground"
            defaultValue={time}
            name="time"
            required
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
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label>Descripcion</label>
        <textarea
          className="bg-surface border border-border rounded-md px-2 py-1 text-foreground min-h-30"
          defaultValue={event?.description}
          name="description"
          required
        />
      </div>

      <SubmitButton
        className="w-fit bg-primary hover:bg-primary-hover px-2 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        title={formTitle}
      />
    </form>
  );
}
