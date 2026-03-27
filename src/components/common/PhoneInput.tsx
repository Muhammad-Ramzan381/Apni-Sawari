import { View, Text, TextInput } from "react-native";
import { COUNTRY_CODE } from "../../utils/constants";

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
}

export default function PhoneInput({
  value,
  onChangeText,
  error,
  placeholder = "3XX XXXXXXX",
}: PhoneInputProps) {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-1.5 text-sm">
        Phone Number
      </Text>
      <View
        className={`flex-row items-center bg-gray-50 rounded-xl border ${
          error ? "border-danger" : "border-gray-200"
        } overflow-hidden`}
      >
        <View className="bg-gray-100 px-4 py-3.5 border-r border-gray-200">
          <Text className="text-base font-medium text-gray-600">
            {COUNTRY_CODE}
          </Text>
        </View>
        <TextInput
          className="flex-1 px-4 py-3 text-base text-gray-900"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          maxLength={11}
        />
      </View>
      {error ? (
        <Text className="text-danger text-xs mt-1">{error}</Text>
      ) : null}
    </View>
  );
}
