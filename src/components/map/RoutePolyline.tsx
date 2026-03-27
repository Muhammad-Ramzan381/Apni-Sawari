import { Polyline } from "react-native-maps";

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

  return (
    <Polyline
      coordinates={coordinates}
      strokeColor={color}
      strokeWidth={width}
      lineDashPattern={undefined}
    />
  );
}
