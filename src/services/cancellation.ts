import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase";
import { updateRideStatus } from "./rides";
import { addTransaction } from "./wallet";
import {
  CANCELLATION_THRESHOLD,
  CANCELLATION_PENALTY_RATE,
} from "../utils/constants";

interface CancellationResult {
  cancelled: boolean;
  penalty: number;
  dailyCancellations: number;
  blocked: boolean;
}

export async function cancelRide(
  rideId: string,
  cancelledBy: "rider" | "driver",
  userId: string,
  reason: string,
  fareTotal: number
): Promise<CancellationResult> {
  // Get user's daily cancellation count
  let dailyCancellations = 0;

  try {
    if (cancelledBy === "driver") {
      const driverDoc = await getDoc(doc(db, "drivers", userId));
      if (driverDoc.exists()) {
        dailyCancellations = driverDoc.data().dailyStats?.cancellations || 0;
      }
    }
  } catch {
    // Firestore not configured
  }

  dailyCancellations += 1;

  // Calculate penalty
  let penalty = 0;
  let blocked = false;

  if (dailyCancellations > CANCELLATION_THRESHOLD) {
    // 20% penalty on last 3 rides' fare
    penalty = Math.round(fareTotal * CANCELLATION_PENALTY_RATE);
    blocked = true;

    // Deduct penalty from wallet
    try {
      await addTransaction(
        userId,
        "penalty",
        -penalty,
        `Cancellation penalty (${dailyCancellations} cancellations today)`,
        rideId
      );
    } catch {
      // Wallet deduction failed
    }
  }

  // Update ride status
  try {
    await updateRideStatus(rideId, "cancelled", {
      cancellation: {
        by: cancelledBy,
        reason,
        penalty,
      },
    });
  } catch {
    // Firestore update failed
  }

  // Update driver's daily stats
  if (cancelledBy === "driver") {
    try {
      await updateDoc(doc(db, "drivers", userId), {
        "dailyStats.cancellations": increment(1),
      });
    } catch {
      // Stats update failed
    }
  }

  return {
    cancelled: true,
    penalty,
    dailyCancellations,
    blocked,
  };
}

export async function getDailyCancellationCount(
  userId: string,
  role: "rider" | "driver"
): Promise<number> {
  try {
    const collectionName = role === "driver" ? "drivers" : "users";
    const userDoc = await getDoc(doc(db, collectionName, userId));
    if (!userDoc.exists()) return 0;
    return userDoc.data().dailyStats?.cancellations || 0;
  } catch {
    return 0;
  }
}
