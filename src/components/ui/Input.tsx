import { View, TextInput, Text, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  ...props
}: InputProps) {
  return (
    <View className="mb-4">
      {label ? (
        <Text className="text-gray-700 font-medium mb-1.5 text-sm">
          {label}
        </Text>
      ) : null}
      <View
        className={`flex-row items-center bg-gray-50 rounded-xl border ${
          error ? "border-danger" : "border-gray-200"
        } px-4 py-3`}
      >
        {leftIcon ? <View className="mr-3">{leftIcon}</View> : null}
        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {rightIcon ? <View className="ml-3">{rightIcon}</View> : null}
      </View>
      {error ? (
        <Text className="text-danger text-xs mt-1">{error}</Text>
      ) : null}
    </View>
  );
}
