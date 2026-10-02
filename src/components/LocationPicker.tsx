import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

type LocationPickerProps = {
  defaultValue?: string;
  onPlaceSelect: (place: {
    location: string;
    latitude: number;
    longitude: number;
  }) => void;
};

export default function LocationPicker({
  defaultValue = "",
  onPlaceSelect,
}: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef =
    useRef<google.maps.places.PlaceAutocompleteElement | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const container = containerRef.current;

    if (!apiKey || !containerRef.current) {
      return;
    }

    let cancelled = false;

    setOptions({
      key: apiKey,
      v: "weekly",
    });

    async function initAutocomplete() {
      const { PlaceAutocompleteElement } = await importLibrary("places");

      if (cancelled) {
        return;
      }

      const autocomplete = new PlaceAutocompleteElement();
      autocompleteRef.current = autocomplete;
      autocomplete.style.colorScheme = "dark";
      autocomplete.style.width = "100%";
      autocomplete.value = defaultValue;

      container?.replaceChildren(autocomplete);

      autocomplete.addEventListener("gmp-select", async (event) => {
        const { placePrediction } =
          event as google.maps.places.PlacePredictionSelectEvent;

        const place = placePrediction.toPlace();

        await place.fetchFields({
          fields: ["formattedAddress", "location"],
        });

        if (!place.location) {
          return;
        }

        onPlaceSelect({
          location: place.formattedAddress ?? "",
          latitude: place.location.lat(),
          longitude: place.location.lng(),
        });
      });
    }

    initAutocomplete();

    return () => {
      cancelled = true;
      container?.replaceChildren();
    };
  }, [onPlaceSelect]);

  useEffect(() => {
    if (!autocompleteRef.current) {
      return;
    }

    autocompleteRef.current.value = defaultValue;
  }, [defaultValue]);

  return <div ref={containerRef} />;
}
