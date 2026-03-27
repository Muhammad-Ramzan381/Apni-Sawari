import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderRole: "rider" | "driver";
  text: string;
  createdAt: number;
}

export async function sendMessage(
  rideId: string,
  senderId: string,
  senderRole: "rider" | "driver",
  text: string
): Promise<void> {
  await addDoc(collection(db, "rides", rideId, "messages"), {
    senderId,
    senderRole,
    text,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToMessages(
  rideId: string,
  callback: (messages: ChatMessage[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "rides", rideId, "messages"),
    orderBy("createdAt", "asc"),
    limit(100)
  );

  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        senderId: data.senderId,
        senderRole: data.senderRole,
        text: data.text,
        createdAt: data.createdAt?.toMillis?.() || Date.now(),
      };
    });
    callback(messages);
  });
}
