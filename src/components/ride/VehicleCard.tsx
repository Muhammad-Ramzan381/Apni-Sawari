import { View, Text } from "react-native";
import { VehicleConfig } from "../../types/vehicle";
import { formatFare } from "../../utils/fare";
import { formatDuration } from "../../utils/distance";
import Card from "../ui/Card";

interface VehicleCardProps {
  config: VehicleConfig;
  fare: number;
  duration: number;
  isSelected: boolean;
  isSurge?: boolean;
  surgeMultiplier?: number;
  onPress: () => void;
}

export default function VehicleCard({
  config,
  fare,
  duration,
  isSelected,
  isSurge = false,
  surgeMultiplier = 1,
  onPress,
}: VehicleCardProps) {
  return (
    <Card
      onPress={onPress}
      className={`mb-3 ${isSelected ? "border-primary-600 border-2" : ""}`}
    >
      <View className="flex-row items-center">
        <Text className="text-3xl mr-4">{config.icon}</Text>
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="text-base font-bold text-gray-900">
              {config.nameEn}
            </Text>
            {isSurge ? (
              <View className="ml-2 bg-orange-100 rounded-full px-2 py-0.5">
                <Text className="text-[10px] text-orange-700 font-bold">
                  {surgeMultiplier}x SURGE
                </Text>
              </View>
            ) : null}
          </View>
          <Text className="text-xs text-gray-500 mt-0.5">
            {formatDuration(duration)} •{" "}
            {config.maxPassengers > 0
              ? `${config.maxPassengers} seats`
              : "Parcel delivery"}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-lg font-bold text-gray-900">
            {formatFare(fare)}
          </Text>
          {isSurge ? (
            <Text className="text-[10px] text-orange-500 line-through">
              {formatFare(Math.round(fare / surgeMultiplier))}
            </Text>
          ) : null}
        </View>
      </View>
    </Card>
  );
}
