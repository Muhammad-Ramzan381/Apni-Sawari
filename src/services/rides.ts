import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { Ride, RideStatus, PaymentMethod, RideLocation } from "../types/ride";
import { VehicleType } from "../types/user";
import { RideFare } from "../types/ride";

const RIDES_COLLECTION = "rides";

export async function createRide(params: {
  riderId: string;
  pickup: RideLocation;
  dropoff: RideLocation;
  stops: RideLocation[];
  vehicleType: VehicleType;
  fare: RideFare;
  estimatedDistance: number;
  estimatedDuration: number;
  isSurge: boolean;
  surgeMultiplier: number;
  paymentMethod: PaymentMethod;
  isCourier: boolean;
}): Promise<string> {
  const rideData = {
    riderId: params.riderId,
    driverId: null,
    status: "searching" as RideStatus,
    pickup: params.pickup,
    dropoff: params.dropoff,
    stops: params.stops,
    vehicleType: params.vehicleType,
    fare: params.fare,
    distance: { estimated: params.estimatedDistance, actual: 0 },
    duration: { estimated: params.estimatedDuration, actual: 0 },
    isSurge: params.isSurge,
    surgeMultiplier: params.surgeMultiplier,
    paymentMethod: params.paymentMethod,
    rating: {},
    isCourier: params.isCourier,
    routePath: [],
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, RIDES_COLLECTION), rideData);
  return docRef.id;
}

export async function getRide(rideId: string): Promise<Ride | null> {
  const docSnap = await getDoc(doc(db, RIDES_COLLECTION, rideId));
  if (!docSnap.exists()) return null;

  return { id: docSnap.id, ...docSnap.data() } as Ride;
}

export async function updateRideStatus(
  rideId: string,
  status: RideStatus,
  additionalData?: Record<string, any>
): Promise<void> {
  const updates: Record<string, any> = { status, ...additionalData };

  if (status === "started") {
    updates.startedAt = serverTimestamp();
  } else if (status === "completed") {
    updates.completedAt = serverTimestamp();
  }

  await updateDoc(doc(db, RIDES_COLLECTION, rideId), updates);
}

export async function assignDriver(
  rideId: string,
  driverId: string
): Promise<void> {
  await updateDoc(doc(db, RIDES_COLLECTION, rideId), {
    driverId,
    status: "accepted",
  });
}

export async function rateRide(
  rideId: string,
  by: "rider" | "driver",
  rating: number
): Promise<void> {
  await updateDoc(doc(db, RIDES_COLLECTION, rideId), {
    [`rating.${by}`]: rating,
  });
}

export function subscribeToRide(
  rideId: string,
  callback: (ride: Ride | null) => void
): Unsubscribe {
  return onSnapshot(doc(db, RIDES_COLLECTION, rideId), (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as Ride);
    } else {
      callback(null);
    }
  });
}

export async function getRiderHistory(
  riderId: string,
  maxResults: number = 20
): Promise<Ride[]> {
  const q = query(
    collection(db, RIDES_COLLECTION),
    where("riderId", "==", riderId),
    where("status", "in", ["completed", "cancelled"]),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Ride));
}

export async function getDriverHistory(
  driverId: string,
  maxResults: number = 20
): Promise<Ride[]> {
  const q = query(
    collection(db, RIDES_COLLECTION),
    where("driverId", "==", driverId),
    where("status", "in", ["completed", "cancelled"]),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Ride));
}
