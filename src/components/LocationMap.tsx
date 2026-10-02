import { importLibrary } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

type LocationMapProps = {
  latitude: number;
  longitude: number;
  recenterKey: number;
  onLocationChange: (
    latitude: number,
    longitude: number,
    location: string
  ) => void;
};

export default function LocationMap({
  latitude,
  longitude,
  onLocationChange,
  recenterKey,
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    async function initMap() {
      const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
        importLibrary("maps"),
        importLibrary("marker"),
      ]);

      const position = {
        lat: latitude,
        lng: longitude,
      };

      const map = new Map(mapRef.current!, {
        center: position,
        zoom: 16,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
      });

      const marker = new AdvancedMarkerElement({
        map,
        position,
      });

      const geocoder = new google.maps.Geocoder();

      mapInstanceRef.current = map;
      markerRef.current = marker;

      map.addListener("click", async (event: google.maps.MapMouseEvent) => {
        if (!event.latLng) {
          return;
        }

        const latitude = event.latLng.lat();
        const longitude = event.latLng.lng();

        try {
          const { results } = await geocoder.geocode({
            location: {
              lat: latitude,
              lng: longitude,
            },
          });

          const location = results[0]?.formatted_address ?? "";

          onLocationChange(latitude, longitude, location);
        } catch (error) {
          console.error("Failed to reverse geocode location:", error);
        }
      });
    }

    initMap();
  }, [onLocationChange]);

  useEffect(() => {
    if (!markerRef.current) {
      return;
    }

    markerRef.current.position = {
      lat: latitude,
      lng: longitude,
    };
  }, [latitude, longitude]);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      return;
    }

    mapInstanceRef.current.setCenter({
      lat: latitude,
      lng: longitude,
    });
  }, [recenterKey]);

  return (
    <div
      ref={mapRef}
      className="h-72 w-full rounded-md border border-border overflow-hidden"
    />
  );
}
