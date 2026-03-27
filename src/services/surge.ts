import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface SurgeZone {
  id: string;
  center: { lat: number; lng: number };
  radius: number; // meters
  multiplier: number;
  expiresAt: number;
  isActive: boolean;
}

export async function getActiveSurgeZones(): Promise<SurgeZone[]> {
  try {
    const q = query(
      collection(db, "surge_zones"),
      where("isActive", "==", true)
    );

    const snapshot = await getDocs(q);
    const now = Date.now();

    return snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          center: data.center,
          radius: data.radius,
          multiplier: data.multiplier,
          expiresAt: data.expiresAt?.toMillis?.() || data.expiresAt,
          isActive: data.isActive,
        };
      })
      .filter((zone) => zone.expiresAt > now);
  } catch {
    return [];
  }
}

export function isPointInSurgeZone(
  point: { lat: number; lng: number },
  zones: SurgeZone[]
): { inSurge: boolean; multiplier: number } {
  for (const zone of zones) {
    const distance = getDistanceMeters(point, zone.center);
    if (distance <= zone.radius) {
      return { inSurge: true, multiplier: zone.multiplier };
    }
  }
  return { inSurge: false, multiplier: 1 };
}

function getDistanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const a2 =
    sinDLat * sinDLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinDLng * sinDLng;
  return R * 2 * Math.atan2(Math.sqrt(a2), Math.sqrt(1 - a2));
}
