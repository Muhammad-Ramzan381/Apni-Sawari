import Mapbox from "@rnmapbox/maps";

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

Mapbox.setAccessToken(MAPBOX_TOKEN);

export interface DirectionsResult {
  distance: number; // km
  duration: number; // minutes
  coordinates: Array<{ latitude: number; longitude: number }>;
}

/**
 * Fetch a driving route between two points using the Mapbox Directions API.
 * Returns distance (km), duration (minutes), and the route as lat/lng pairs.
 */
export async function getDirections(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<DirectionsResult> {
  const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}` +
    `?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Mapbox Directions request failed: ${response.status}`);
  }
  const data = await response.json();

  if (!data.routes || data.routes.length === 0) {
    throw new Error("No route found");
  }

  const route = data.routes[0];
  const geometry = route.geometry as { coordinates: [number, number][] };

  return {
    distance: route.distance / 1000, // meters → km
    duration: route.duration / 60, // seconds → minutes
    coordinates: geometry.coordinates.map(([lng, lat]) => ({
      latitude: lat,
      longitude: lng,
    })),
  };
}

export { MAPBOX_TOKEN };
export default Mapbox;
