import { create } from "zustand";
import { GeoPoint } from "../types/user";
import { RideLocation } from "../types/ride";

interface LocationState {
  currentLocation: GeoPoint | null;
  pickup: RideLocation | null;
  dropoff: RideLocation | null;
  stops: RideLocation[];
  isLocationLoading: boolean;

  setCurrentLocation: (location: GeoPoint) => void;
  setPickup: (location: RideLocation | null) => void;
  setDropoff: (location: RideLocation | null) => void;
  addStop: (location: RideLocation) => void;
  removeStop: (index: number) => void;
  clearStops: () => void;
  setLocationLoading: (loading: boolean) => void;
  resetLocations: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  pickup: null,
  dropoff: null,
  stops: [],
  isLocationLoading: true,

  setCurrentLocation: (location) => set({ currentLocation: location }),

  setPickup: (pickup) => set({ pickup }),

  setDropoff: (dropoff) => set({ dropoff }),

  addStop: (location) =>
    set((state) => ({ stops: [...state.stops, location] })),

  removeStop: (index) =>
    set((state) => ({
      stops: state.stops.filter((_, i) => i !== index),
    })),

  clearStops: () => set({ stops: [] }),

  setLocationLoading: (isLocationLoading) => set({ isLocationLoading }),

  resetLocations: () =>
    set({ pickup: null, dropoff: null, stops: [] }),
}));
