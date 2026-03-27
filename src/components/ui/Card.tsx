import { View, TouchableOpacity, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  style?: ViewStyle;
}

export default function Card({ children, onPress, className = "" }: CardProps) {
  const baseStyles = `bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${className}`;

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className={baseStyles}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View className={baseStyles}>{children}</View>;
}
