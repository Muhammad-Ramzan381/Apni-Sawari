import { View, Text } from "react-native";

interface BadgeProps {
  text: string;
  variant?: "primary" | "success" | "warning" | "danger" | "gray";
}

const variantStyles = {
  primary: "bg-primary-100",
  success: "bg-green-100",
  warning: "bg-yellow-100",
  danger: "bg-red-100",
  gray: "bg-gray-100",
};

const textStyles = {
  primary: "text-primary-700",
  success: "text-green-700",
  warning: "text-yellow-700",
  danger: "text-red-700",
  gray: "text-gray-700",
};

export default function Badge({ text, variant = "primary" }: BadgeProps) {
  return (
    <View className={`px-3 py-1 rounded-full ${variantStyles[variant]}`}>
      <Text className={`text-xs font-medium ${textStyles[variant]}`}>
        {text}
      </Text>
    </View>
  );
}
