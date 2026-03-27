import { useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadParcelPhoto } from "../../services/storage";
import { MAX_PARCEL_WEIGHT_KG } from "../../utils/constants";
import Button from "../ui/Button";
import Card from "../ui/Card";

interface CourierParcelCaptureProps {
  rideId: string;
  onPhotoTaken: (url: string) => void;
}

export default function CourierParcelCapture({
  rideId,
  onPhotoTaken,
}: CourierParcelCaptureProps) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera access is required for parcel photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!photoUri) return;

    setUploading(true);
    try {
      const url = await uploadParcelPhoto(rideId, photoUri);
      onPhotoTaken(url);
    } catch {
      Alert.alert("Upload Failed", "Could not upload parcel photo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="mb-4">
      <Text className="text-base font-bold text-gray-900 mb-1">
        📦 Parcel Photo
      </Text>
      <Text className="text-xs text-gray-500 mb-3">
        Optional — Take a photo of the parcel (max {MAX_PARCEL_WEIGHT_KG}kg)
      </Text>

      {photoUri ? (
        <View className="mb-3">
          <Image
            source={{ uri: photoUri }}
            className="w-full h-48 rounded-xl"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => setPhotoUri(null)}
            className="absolute top-2 right-2 bg-black/50 rounded-full w-7 h-7 items-center justify-center"
          >
            <Text className="text-white text-sm">✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row mb-3">
          <TouchableOpacity
            onPress={handleTakePhoto}
            className="flex-1 bg-gray-100 rounded-xl py-6 items-center mr-2"
          >
            <Text className="text-2xl mb-1">📷</Text>
            <Text className="text-xs text-gray-600">Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePickPhoto}
            className="flex-1 bg-gray-100 rounded-xl py-6 items-center ml-2"
          >
            <Text className="text-2xl mb-1">🖼️</Text>
            <Text className="text-xs text-gray-600">Gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      {photoUri ? (
        <Button
          title="Upload Photo"
          onPress={handleUpload}
          loading={uploading}
          size="sm"
          fullWidth
        />
      ) : null}
    </Card>
  );
}
