import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadImage(
  uri: string,
  path: string
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);

  return getDownloadURL(storageRef);
}

export async function uploadParcelPhoto(
  rideId: string,
  uri: string
): Promise<string> {
  return uploadImage(uri, `parcels/${rideId}/photo.jpg`);
}

export async function uploadProfilePhoto(
  userId: string,
  uri: string
): Promise<string> {
  return uploadImage(uri, `profiles/${userId}/avatar.jpg`);
}

export async function uploadDriverDocument(
  driverId: string,
  docType: "license" | "cnic" | "vehicleReg",
  uri: string
): Promise<string> {
  return uploadImage(uri, `drivers/${driverId}/${docType}.jpg`);
}
