import { View, ActivityIndicator, Text } from "react-native";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "large";
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  message,
  size = "large",
  fullScreen = false,
}: LoadingSpinnerProps) {
  return (
    <View
      className={`items-center justify-center ${fullScreen ? "flex-1 bg-white" : "py-8"}`}
    >
      <ActivityIndicator size={size} color="#1E96E5" />
      {message ? (
        <Text className="text-gray-500 mt-3 text-sm">{message}</Text>
      ) : null}
    </View>
  );
}
