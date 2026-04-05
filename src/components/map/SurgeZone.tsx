import Mapbox from "@rnmapbox/maps";

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

function createCircleGeoJSON(
  center: [number, number],
  radiusKm: number
): GeoJSON.FeatureCollection {
  // Approximate circle with a polygon (64 sides)
  const points = 64;
  const coords: [number, number][] = [];
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const dx = radiusKm / 111.32 * Math.cos(angle);
    const dy = radiusKm / (111.32 * Math.cos(center[1] * Math.PI / 180)) * Math.sin(angle);
    coords.push([center[0] + dy, center[1] + dx]);
  }

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [coords],
        },
      },
    ],
  };
}

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
  const radiusKm = radiusMeters / 1000;
  const circleGeoJSON = createCircleGeoJSON([center.lng, center.lat], radiusKm);
  const sourceId = `surge-${center.lat}-${center.lng}`;

  return (
    <Mapbox.ShapeSource id={sourceId} shape={circleGeoJSON}>
      <Mapbox.FillLayer
        id={`${sourceId}-fill`}
        style={{
          fillColor: colors.fill,
          fillOpacity: 1,
        }}
      />
      <Mapbox.LineLayer
        id={`${sourceId}-stroke`}
        style={{
          lineColor: colors.stroke,
          lineWidth: 2,
        }}
      />
    </Mapbox.ShapeSource>
  );
}
