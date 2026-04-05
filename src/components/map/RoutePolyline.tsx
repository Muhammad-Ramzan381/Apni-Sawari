import Mapbox from "@rnmapbox/maps";

interface RoutePolylineProps {
  coordinates: Array<{ latitude: number; longitude: number }>;
  color?: string;
  width?: number;
}

export default function RoutePolyline({
  coordinates,
  color = "#1E96E5",
  width = 4,
}: RoutePolylineProps) {
  if (coordinates.length < 2) return null;

  const geoJSON: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: coordinates.map((c) => [c.longitude, c.latitude]),
        },
      },
    ],
  };

  return (
    <Mapbox.ShapeSource id="route-source" shape={geoJSON}>
      <Mapbox.LineLayer
        id="route-line"
        style={{
          lineColor: color,
          lineWidth: width,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
    </Mapbox.ShapeSource>
  );
}
