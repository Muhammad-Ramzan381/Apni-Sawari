import { GeoPoint } from "../types/user";

const DEG_TO_RAD = Math.PI / 180;
const EARTH_RADIUS_KM = 6371;

export function haversineDistance(from: GeoPoint, to: GeoPoint): number {
  const dLat = (to.lat - from.lat) * DEG_TO_RAD;
  const dLng = (to.lng - from.lng) * DEG_TO_RAD;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(from.lat * DEG_TO_RAD) *
      Math.cos(to.lat * DEG_TO_RAD) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 1) {
    return "< 1 min";
  }
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
