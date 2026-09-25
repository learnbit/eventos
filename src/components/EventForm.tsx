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
  const inputClassName =
    "bg-surface border border-border rounded-md px-3 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors";

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
    <form className="max-w-2xl flex flex-col gap-5" action={formAction}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{formTitle}</h1>

        <p className="mt-2 text-sm text-muted">
          Completa la informacion del evento.
        </p>
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Titulo</label>
        <input
          type="text"
          name="title"
          className={inputClassName}
          defaultValue={event?.title}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Categoria</label>
        <select
          name="category"
          className={inputClassName}
          defaultValue={event?.category}
        >
          <option value={GARAGE_SALE}>Venta de Garage</option>
          <option value={KERMESSE}>Kermesse</option>
          <option value={FERIA}>Feria</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Imagen</label>
        {imagePreview && (
          <div className="relative w-full aspect-video overflow-hidden rounded-md border border-border bg-surface">
            <Image
              className="object-contain"
              src={imagePreview}
              alt="Vista previa del evento"
              fill
            />
          </div>
        )}

        <input
          className={inputClassName}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          name="image"
        />

        <p className="text-xs text-muted">
          JPG, PNG o WebP. Maximo {MAX_IMAGE_SIZE_MB} MB.
        </p>
        {imageError && <p className="text-sm text-red-500">{imageError}</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-sm font-medium">Fecha</label>
          <input
            type="date"
            className={inputClassName}
            defaultValue={date}
            name="date"
            required
          />
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <label className="text-sm font-medium">Hora</label>
          <input
            type="time"
            className={inputClassName}
            defaultValue={time}
            name="time"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Ubicacion</label>
        <input
          type="text"
          className={inputClassName}
          defaultValue={event?.location}
          name="location"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Descripcion</label>
        <textarea
          className={`${inputClassName} min-h-36 resize-y`}
          defaultValue={event?.description}
          name="description"
          required
        />
      </div>

      <p className="text-sm text-muted">
        {event
          ? "Al guardar cambios, el evento volverá a revisión antes de publicarse."
          : "El evento quedará pendiente de aprobación antes de publicarse."}
      </p>

      <SubmitButton
        className="w-fit bg-primary hover:bg-primary-hover px-4 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={formTitle}
      />
    </form>
  );
}
