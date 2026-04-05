import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const variantStyles = {
  primary: "bg-primary-600 active:bg-primary-700",
  secondary: "bg-secondary-500 active:bg-secondary-600",
  outline: "bg-transparent border-2 border-primary-600",
  danger: "bg-red-500 active:bg-red-600",
};

const textVariantStyles = {
  primary: "text-white",
  secondary: "text-dark",
  outline: "text-primary-600",
  danger: "text-white",
};

const sizeStyles = {
  sm: "py-2 px-4",
  md: "py-3 px-6",
  lg: "py-4 px-8",
};

const textSizeStyles = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`rounded-xl items-center justify-center flex-row ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${disabled ? "opacity-50" : ""}`}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? "#1E96E5" : "#fff"}
          className="mr-2"
        />
      ) : null}
      <Text
        className={`font-semibold ${textVariantStyles[variant]} ${textSizeStyles[size]}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
