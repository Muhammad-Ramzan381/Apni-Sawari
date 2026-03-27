import { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import { Marker } from "react-native-maps";
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
    <Marker
      coordinate={{
        latitude: location.lat,
        longitude: location.lng,
      }}
      anchor={{ x: 0.5, y: 0.5 }}
      flat
      rotation={heading}
    >
      <View className="items-center">
        <View className="bg-white rounded-full p-1.5 shadow-md border border-gray-200">
          <Text className="text-2xl">{vehicleIcon}</Text>
        </View>
      </View>
    </Marker>
  );
}
