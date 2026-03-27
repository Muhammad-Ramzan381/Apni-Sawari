import { VehicleType } from "./user";

export interface VehicleConfig {
  type: VehicleType;
  nameEn: string;
  nameUr: string;
  icon: string;
  baseFare: number;
  perKmRate: number;
  perMinRate: number;
  minimumFare: number;
  maxPassengers: number;
  waitingChargePerMin: number;
  driverMinBalance: number;
}

export const VEHICLE_CONFIGS: Record<VehicleType, VehicleConfig> = {
  bike: {
    type: "bike",
    nameEn: "Bike",
    nameUr: "بائیک",
    icon: "🏍️",
    baseFare: 30,
    perKmRate: 12,
    perMinRate: 2,
    minimumFare: 50,
    maxPassengers: 1,
    waitingChargePerMin: 2,
    driverMinBalance: -200,
  },
  rickshaw: {
    type: "rickshaw",
    nameEn: "Rickshaw",
    nameUr: "رکشہ",
    icon: "🛺",
    baseFare: 40,
    perKmRate: 18,
    perMinRate: 3,
    minimumFare: 70,
    maxPassengers: 3,
    waitingChargePerMin: 3,
    driverMinBalance: -300,
  },
  eco_car: {
    type: "eco_car",
    nameEn: "Eco Car",
    nameUr: "ایکو کار",
    icon: "🚗",
    baseFare: 70,
    perKmRate: 25,
    perMinRate: 4,
    minimumFare: 120,
    maxPassengers: 4,
    waitingChargePerMin: 4,
    driverMinBalance: -300,
  },
  non_ac_car: {
    type: "non_ac_car",
    nameEn: "Non-AC Car",
    nameUr: "نان اے سی کار",
    icon: "🚙",
    baseFare: 80,
    perKmRate: 30,
    perMinRate: 5,
    minimumFare: 150,
    maxPassengers: 4,
    waitingChargePerMin: 5,
    driverMinBalance: -500,
  },
  ac_car: {
    type: "ac_car",
    nameEn: "AC Car",
    nameUr: "اے سی کار",
    icon: "🚘",
    baseFare: 100,
    perKmRate: 40,
    perMinRate: 6,
    minimumFare: 200,
    maxPassengers: 4,
    waitingChargePerMin: 6,
    driverMinBalance: -500,
  },
  courier: {
    type: "courier",
    nameEn: "Courier",
    nameUr: "کورئیر",
    icon: "📦",
    baseFare: 50,
    perKmRate: 15,
    perMinRate: 2,
    minimumFare: 80,
    maxPassengers: 0,
    waitingChargePerMin: 3,
    driverMinBalance: -200,
  },
};
