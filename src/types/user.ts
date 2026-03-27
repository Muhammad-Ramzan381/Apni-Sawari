export type UserRole = "rider" | "driver";
export type Language = "en" | "ur";

export interface AppUser {
  id: string;
  displayName: string;
  phone: string;
  email?: string;
  photoURL?: string;
  role: UserRole;
  activeRole: UserRole;
  language: Language;
  deviceToken?: string;
  createdAt: number;
  updatedAt: number;
}

export interface RiderProfile {
  totalSpent: number;
  currentMilestone: number;
  bonusBalance: number;
  totalRides: number;
  rating: number;
}

export interface DriverProfile {
  vehicleType: VehicleType;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleColor: string;
  isOnline: boolean;
  isAvailable: boolean;
  location: GeoPoint;
  rating: number;
  totalRides: number;
  totalEarnings: number;
  wallet: {
    balance: number;
    minBalance: number;
  };
  skipCount: number;
  penaltyCount: number;
  documents: {
    license?: string;
    cnic?: string;
    vehicleReg?: string;
  };
  dailyStats: {
    rides: number;
    earnings: number;
    cancellations: number;
    skips: number;
  };
}

export interface GeoPoint {
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
}

export type VehicleType =
  | "bike"
  | "rickshaw"
  | "eco_car"
  | "non_ac_car"
  | "ac_car"
  | "courier";
