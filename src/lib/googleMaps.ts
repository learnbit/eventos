// src/lib/googleMaps.ts

import { setOptions } from "@googlemaps/js-api-loader";

let configured = false;

export function configureGoogleMaps() {
  if (configured) {
    return;
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
  }

  setOptions({
    key: apiKey,
    v: "weekly",
  });

  configured = true;
}
