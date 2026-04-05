import { View, Text } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { GeoPoint } from "../../types/user";

interface DriverMarkerProps {
  location: GeoPoint;
  heading?: number;
  vehicleIcon?: string;
}

export default function DriverMarker({
  location,
  heading = 0,
  vehicleIcon = "🚗",
}: DriverMarkerProps) {
  return (
    <Mapbox.PointAnnotation
      id={`driver-${location.lat}-${location.lng}`}
      coordinate={[location.lng, location.lat]}
    >
      <View style={{ alignItems: "center", transform: [{ rotate: `${heading}deg` }] }}>
        <View className="bg-white rounded-full p-1.5 shadow-md border border-gray-200">
          <Text className="text-2xl">{vehicleIcon}</Text>
        </View>
      </View>
    </Mapbox.PointAnnotation>
  );
}
