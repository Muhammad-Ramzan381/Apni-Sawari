import { View, Text } from "react-native";
import { RideStatus } from "../../types/ride";

interface RideStatusBarProps {
  status: RideStatus;
}

const STATUS_STEPS: { key: RideStatus; label: string }[] = [
  { key: "searching", label: "Searching" },
  { key: "accepted", label: "Accepted" },
  { key: "arrived", label: "Arrived" },
  { key: "started", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

const STATUS_INDEX: Record<RideStatus, number> = {
  searching: 0,
  accepted: 1,
  arrived: 2,
  started: 3,
  completed: 4,
  cancelled: -1,
};

export default function RideStatusBar({ status }: RideStatusBarProps) {
  const currentIndex = STATUS_INDEX[status];

  if (status === "cancelled") {
    return (
      <View className="bg-red-50 rounded-lg px-4 py-2">
        <Text className="text-red-600 font-medium text-center">
          Ride Cancelled
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-between px-2">
      {STATUS_STEPS.map((step, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <View key={step.key} className="items-center flex-1">
            <View
              className={`w-6 h-6 rounded-full items-center justify-center ${
                isCurrent
                  ? "bg-primary-600"
                  : isActive
                    ? "bg-primary-400"
                    : "bg-gray-200"
              }`}
            >
              {isActive ? (
                <Text className="text-white text-xs font-bold">✓</Text>
              ) : (
                <Text className="text-gray-400 text-xs">{index + 1}</Text>
              )}
            </View>
            <Text
              className={`text-[10px] mt-1 ${
                isCurrent
                  ? "text-primary-600 font-bold"
                  : isActive
                    ? "text-primary-400"
                    : "text-gray-400"
              }`}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
