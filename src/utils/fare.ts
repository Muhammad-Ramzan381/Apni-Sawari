import { VehicleType } from "../types/user";
import { VEHICLE_CONFIGS } from "../types/vehicle";
import { RideFare } from "../types/ride";
import { COMMISSION_RATE } from "../types/wallet";

export function calculateFare(
  vehicleType: VehicleType,
  distanceKm: number,
  durationMin: number,
  surgeMultiplier: number = 1
): RideFare {
  const config = VEHICLE_CONFIGS[vehicleType];

  const base = config.baseFare;
  const distanceCharge = distanceKm * config.perKmRate;
  const timeCharge = durationMin * config.perMinRate;
  const subtotal = base + distanceCharge + timeCharge;
  const surgeCharge = surgeMultiplier > 1 ? subtotal * (surgeMultiplier - 1) : 0;
  const total = Math.max(subtotal + surgeCharge, config.minimumFare);
  const commission = Math.round(total * COMMISSION_RATE);

  return {
    base,
    perKm: distanceCharge,
    distance: distanceKm,
    waiting: 0,
    surge: surgeCharge,
    total: Math.round(total),
    commission,
  };
}

export function formatFare(amount: number): string {
  return `PKR ${amount.toLocaleString()}`;
}
