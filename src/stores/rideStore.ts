import { create } from "zustand";
import { Ride, RideStatus, PaymentMethod } from "../types/ride";
import { VehicleType, GeoPoint } from "../types/user";

interface RideState {
  activeRide: Ride | null;
  selectedVehicle: VehicleType | null;
  paymentMethod: PaymentMethod;
  driverLocation: GeoPoint | null;
  eta: number | null; // minutes

  setActiveRide: (ride: Ride | null) => void;
  updateRideStatus: (status: RideStatus) => void;
  setSelectedVehicle: (vehicle: VehicleType | null) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setDriverLocation: (location: GeoPoint) => void;
  setEta: (eta: number | null) => void;
  resetRide: () => void;
}

export const useRideStore = create<RideState>((set) => ({
  activeRide: null,
  selectedVehicle: null,
  paymentMethod: "cash",
  driverLocation: null,
  eta: null,

  setActiveRide: (activeRide) => set({ activeRide }),

  updateRideStatus: (status) =>
    set((state) => ({
      activeRide: state.activeRide
        ? { ...state.activeRide, status }
        : null,
    })),

  setSelectedVehicle: (selectedVehicle) => set({ selectedVehicle }),

  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

  setDriverLocation: (driverLocation) => set({ driverLocation }),

  setEta: (eta) => set({ eta }),

  resetRide: () =>
    set({
      activeRide: null,
      selectedVehicle: null,
      driverLocation: null,
      eta: null,
    }),
}));
