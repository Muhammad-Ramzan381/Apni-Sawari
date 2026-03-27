import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { AppUser, UserRole, DriverProfile } from "../types/user";

const USERS_COLLECTION = "users";
const DRIVERS_COLLECTION = "drivers";

export async function createUser(
  uid: string,
  emailOrPhone: string,
  role: UserRole,
  displayName: string = ""
): Promise<AppUser> {
  const isEmail = emailOrPhone.includes("@");
  const now = Date.now();
  const user: AppUser = {
    id: uid,
    displayName,
    phone: isEmail ? "" : emailOrPhone,
    email: isEmail ? emailOrPhone : undefined,
    role,
    activeRole: role,
    language: "en",
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, USERS_COLLECTION, uid), {
    ...user,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return user;
}

export async function getUser(uid: string): Promise<AppUser | null> {
  const docSnap = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    id: docSnap.id,
    displayName: data.displayName,
    phone: data.phone,
    email: data.email,
    photoURL: data.photoURL,
    role: data.role,
    activeRole: data.activeRole,
    language: data.language,
    deviceToken: data.deviceToken,
    createdAt: data.createdAt?.toMillis?.() || data.createdAt,
    updatedAt: data.updatedAt?.toMillis?.() || data.updatedAt,
  };
}

export async function updateUser(
  uid: string,
  updates: Partial<AppUser>
): Promise<void> {
  await updateDoc(doc(db, USERS_COLLECTION, uid), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserRole(
  uid: string,
  activeRole: UserRole
): Promise<void> {
  await updateDoc(doc(db, USERS_COLLECTION, uid), {
    activeRole,
    updatedAt: serverTimestamp(),
  });
}

export async function createDriverProfile(
  uid: string,
  profile: Partial<DriverProfile>
): Promise<void> {
  await setDoc(doc(db, DRIVERS_COLLECTION, uid), {
    ...profile,
    isOnline: false,
    isAvailable: false,
    rating: 0,
    totalRides: 0,
    totalEarnings: 0,
    skipCount: 0,
    penaltyCount: 0,
    wallet: { balance: 0, minBalance: -200 },
    dailyStats: { rides: 0, earnings: 0, cancellations: 0, skips: 0 },
    createdAt: serverTimestamp(),
  });
}

export async function getDriverProfile(
  uid: string
): Promise<DriverProfile | null> {
  const docSnap = await getDoc(doc(db, DRIVERS_COLLECTION, uid));
  if (!docSnap.exists()) return null;
  return docSnap.data() as DriverProfile;
}
