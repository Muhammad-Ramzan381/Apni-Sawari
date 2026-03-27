import { View, Text, TouchableOpacity, Linking } from "react-native";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card";

interface DriverInfoCardProps {
  name: string;
  vehicle: string;
  plate: string;
  rating: number;
  phone?: string;
  photoURL?: string;
  eta?: number;
}

export default function DriverInfoCard({
  name,
  vehicle,
  plate,
  rating,
  phone,
  eta,
}: DriverInfoCardProps) {
  const { t } = useTranslation();

  const handleCall = () => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (phone) {
      Linking.openURL(`https://wa.me/${phone.replace("+", "")}`);
    }
  };

  return (
    <Card className="shadow-lg">
      <View className="flex-row items-center mb-3">
        <View className="w-14 h-14 bg-gray-200 rounded-full items-center justify-center mr-3">
          <Text className="text-2xl">👤</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900">{name}</Text>
          <Text className="text-sm text-gray-500">
            {vehicle} • {plate}
          </Text>
          <Text className="text-xs text-gray-400">⭐ {rating.toFixed(1)}</Text>
        </View>
        {eta ? (
          <View className="items-center bg-primary-50 rounded-lg px-3 py-2">
            <Text className="text-xl font-bold text-primary-600">{eta}</Text>
            <Text className="text-[10px] text-primary-400">min</Text>
          </View>
        ) : null}
      </View>

      <View className="flex-row">
        <TouchableOpacity
          onPress={handleCall}
          className="flex-1 bg-gray-100 rounded-lg py-2.5 items-center mr-2"
        >
          <Text className="text-sm font-medium text-gray-700">📞 Call</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleWhatsApp}
          className="flex-1 bg-green-50 rounded-lg py-2.5 items-center ml-2"
        >
          <Text className="text-sm font-medium text-green-700">💬 WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
