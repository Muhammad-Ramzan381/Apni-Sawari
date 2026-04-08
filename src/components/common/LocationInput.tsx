import { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { MAPBOX_TOKEN } from "../../services/mapbox";

export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface LocationInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSelectPlace: (place: PlaceResult) => void;
  autoFocus?: boolean;
  leftIcon?: React.ReactNode;
}

export default function LocationInput({
  placeholder,
  value,
  onChangeText,
  onSelectPlace,
  autoFocus = false,
  leftIcon,
}: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const searchPlaces = useCallback(async (text: string) => {
    if (text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);

    try {
      if (MAPBOX_TOKEN) {
        // Mapbox Geocoding (forward search). Returns coordinates inline,
        // so no second "details" request needed (unlike Google Places).
        const url =
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json` +
          `?country=pk&autocomplete=true&limit=5&access_token=${MAPBOX_TOKEN}`;
        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data.features)) {
          const places: PlaceResult[] = data.features.map((feature: any) => {
            const [lng, lat] = feature.center ?? [0, 0];
            return {
              placeId: String(feature.id),
              name: feature.text || feature.place_name,
              address: feature.place_name,
              lat,
              lng,
            };
          });
          setSuggestions(places);
        }
      } else {
        // Fallback mock data for development
        setSuggestions(getMockSuggestions(text));
      }

      setShowSuggestions(true);
    } catch {
      setSuggestions(getMockSuggestions(text));
      setShowSuggestions(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChangeText = (text: string) => {
    onChangeText(text);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => searchPlaces(text), 400);
  };

  const handleSelectPlace = (place: PlaceResult) => {
    onChangeText(place.name);
    onSelectPlace(place);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <View>
      <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4 py-3">
        {leftIcon ? <View className="mr-3">{leftIcon}</View> : null}
        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={handleChangeText}
          autoFocus={autoFocus}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
        />
        {loading ? (
          <ActivityIndicator size="small" color="#1E96E5" />
        ) : null}
      </View>

      {showSuggestions && suggestions.length > 0 ? (
        <View className="bg-white border border-gray-200 rounded-xl mt-1 overflow-hidden shadow-sm">
          {suggestions.map((item) => (
            <TouchableOpacity
              key={item.placeId}
              onPress={() => handleSelectPlace(item)}
              className="flex-row items-center py-3 px-4 border-b border-gray-50"
            >
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
                <Text className="text-sm">📍</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-900" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text className="text-xs text-gray-500" numberOfLines={1}>
                  {item.address}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}

// Mock suggestions for development without API key
function getMockSuggestions(query: string): PlaceResult[] {
  const allPlaces: PlaceResult[] = [
    { placeId: "1", name: "Lahore Fort", address: "Fort Rd, Walled City, Lahore", lat: 31.588, lng: 74.316 },
    { placeId: "2", name: "Minar-e-Pakistan", address: "Circular Rd, Nasir Bagh, Lahore", lat: 31.592, lng: 74.309 },
    { placeId: "3", name: "Packages Mall", address: "Walton Rd, Lahore", lat: 31.516, lng: 74.354 },
    { placeId: "4", name: "Allama Iqbal Airport", address: "Airport Rd, Lahore", lat: 31.521, lng: 74.403 },
    { placeId: "5", name: "Model Town Park", address: "Model Town, Lahore", lat: 31.48, lng: 74.325 },
    { placeId: "6", name: "Emporium Mall", address: "Abdul Haque Rd, Johar Town, Lahore", lat: 31.469, lng: 74.271 },
    { placeId: "7", name: "Jinnah Hospital", address: "Jail Rd, Lahore", lat: 31.517, lng: 74.34 },
    { placeId: "8", name: "University of Punjab", address: "Canal Bank Rd, Lahore", lat: 31.504, lng: 74.302 },
    { placeId: "9", name: "Faisal Mosque", address: "Shah Faisal Ave, Islamabad", lat: 33.73, lng: 73.037 },
    { placeId: "10", name: "Centaurus Mall", address: "F-8, Islamabad", lat: 33.71, lng: 73.048 },
    { placeId: "11", name: "Clifton Beach", address: "Clifton, Karachi", lat: 24.814, lng: 67.026 },
    { placeId: "12", name: "Port Grand", address: "Native Jetty Bridge, Karachi", lat: 24.848, lng: 66.986 },
  ];

  const lower = query.toLowerCase();
  return allPlaces
    .filter((p) => p.name.toLowerCase().includes(lower) || p.address.toLowerCase().includes(lower))
    .slice(0, 5);
}
