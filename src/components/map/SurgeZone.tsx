import { Circle } from "react-native-maps";

interface SurgeZoneProps {
  center: { lat: number; lng: number };
  radiusMeters: number;
  multiplier: number;
}

const SURGE_COLORS: Record<number, { fill: string; stroke: string }> = {
  1.5: { fill: "rgba(255, 193, 7, 0.15)", stroke: "rgba(255, 193, 7, 0.5)" },
  2: { fill: "rgba(255, 152, 0, 0.2)", stroke: "rgba(255, 152, 0, 0.6)" },
  2.5: { fill: "rgba(244, 67, 54, 0.2)", stroke: "rgba(244, 67, 54, 0.6)" },
  3: { fill: "rgba(183, 28, 28, 0.25)", stroke: "rgba(183, 28, 28, 0.7)" },
};

export default function SurgeZone({
  center,
  radiusMeters,
  multiplier,
}: SurgeZoneProps) {
  const nearestMultiplier = Object.keys(SURGE_COLORS)
    .map(Number)
    .reduce((prev, curr) =>
      Math.abs(curr - multiplier) < Math.abs(prev - multiplier) ? curr : prev
    );

  const colors = SURGE_COLORS[nearestMultiplier] || SURGE_COLORS[2];

  return (
    <Circle
      center={{ latitude: center.lat, longitude: center.lng }}
      radius={radiusMeters}
      fillColor={colors.fill}
      strokeColor={colors.stroke}
      strokeWidth={2}
    />
  );
}
