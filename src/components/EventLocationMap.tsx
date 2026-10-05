"use client";

import { useEffect, useRef } from "react";
import { importLibrary } from "@googlemaps/js-api-loader";
import { configureGoogleMaps } from "@/lib/googleMaps";

type EventLocationMapProps = {
  latitude: number;
  longitude: number;
};

export default function EventLocationMap({
  latitude,
  longitude,
}: EventLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    async function initMap() {
      configureGoogleMaps();

      const { Map } = await importLibrary("maps");
      const { AdvancedMarkerElement } = await importLibrary("marker");

      const position = {
        lat: latitude,
        lng: longitude,
      };

      const map = new Map(mapRef.current!, {
        center: position,
        zoom: 16,

        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
      });

      new AdvancedMarkerElement({
        map,
        position,
      });
    }

    initMap();
  }, [latitude, longitude]);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const wazeUrl = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;

  return (
    <div>
      <div
        ref={mapRef}
        className="h-64 w-full overflow-hidden rounded-lg lg:aspect-[16/9] lg:h-auto"
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-md border border-border px-3 py-2 text-center text-sm hover:bg-surface-hover"
        >
          Abrir en Google Maps
        </a>

        <a
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-md border border-border px-3 py-2 text-center text-sm hover:bg-surface-hover"
        >
          Abrir en Waze
        </a>
      </div>
    </div>
  );
}
