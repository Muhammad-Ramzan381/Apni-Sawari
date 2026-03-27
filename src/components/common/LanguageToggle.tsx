import { TouchableOpacity, Text, View } from "react-native";
import { useSettingsStore } from "../../stores/settingsStore";

interface LanguageToggleProps {
  compact?: boolean;
}

export default function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const { language, setLanguage } = useSettingsStore();

  const toggle = () => {
    setLanguage(language === "en" ? "ur" : "en");
  };

  if (compact) {
    return (
      <TouchableOpacity
        onPress={toggle}
        className="bg-gray-100 rounded-full px-3 py-1.5"
      >
        <Text className="text-xs font-medium text-gray-700">
          {language === "en" ? "اردو" : "EN"}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View className="flex-row bg-gray-100 rounded-xl p-1">
      <TouchableOpacity
        onPress={() => setLanguage("en")}
        className={`flex-1 py-2 rounded-lg items-center ${
          language === "en" ? "bg-white shadow-sm" : ""
        }`}
      >
        <Text
          className={`text-sm font-medium ${
            language === "en" ? "text-primary-600" : "text-gray-500"
          }`}
        >
          English
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setLanguage("ur")}
        className={`flex-1 py-2 rounded-lg items-center ${
          language === "ur" ? "bg-white shadow-sm" : ""
        }`}
      >
        <Text
          className={`text-sm font-medium ${
            language === "ur" ? "text-primary-600" : "text-gray-500"
          }`}
        >
          اردو
        </Text>
      </TouchableOpacity>
    </View>
  );
}
