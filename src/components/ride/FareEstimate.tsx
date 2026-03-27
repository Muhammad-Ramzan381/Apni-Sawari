import { View, Text } from "react-native";
import { RideFare } from "../../types/ride";
import { formatFare } from "../../utils/fare";
import Card from "../ui/Card";

interface FareEstimateProps {
  fare: RideFare;
  isSurge: boolean;
  surgeMultiplier: number;
}

export default function FareEstimate({
  fare,
  isSurge,
  surgeMultiplier,
}: FareEstimateProps) {
  return (
    <Card>
      <Text className="text-sm font-bold text-gray-900 mb-3">
        Fare Breakdown
      </Text>

      <View className="flex-row justify-between mb-1.5">
        <Text className="text-sm text-gray-500">Base fare</Text>
        <Text className="text-sm text-gray-900">{formatFare(fare.base)}</Text>
      </View>

      <View className="flex-row justify-between mb-1.5">
        <Text className="text-sm text-gray-500">
          Distance ({fare.distance.toFixed(1)} km)
        </Text>
        <Text className="text-sm text-gray-900">{formatFare(fare.perKm)}</Text>
      </View>

      {fare.waiting > 0 ? (
        <View className="flex-row justify-between mb-1.5">
          <Text className="text-sm text-gray-500">Waiting</Text>
          <Text className="text-sm text-gray-900">
            {formatFare(fare.waiting)}
          </Text>
        </View>
      ) : null}

      {isSurge ? (
        <View className="flex-row justify-between mb-1.5">
          <Text className="text-sm text-orange-600">
            Surge ({surgeMultiplier}x)
          </Text>
          <Text className="text-sm text-orange-600">
            +{formatFare(fare.surge)}
          </Text>
        </View>
      ) : null}

      <View className="border-t border-gray-100 mt-2 pt-2 flex-row justify-between">
        <Text className="text-base font-bold text-gray-900">Total</Text>
        <Text className="text-base font-bold text-gray-900">
          {formatFare(fare.total)}
        </Text>
      </View>
    </Card>
  );
}
