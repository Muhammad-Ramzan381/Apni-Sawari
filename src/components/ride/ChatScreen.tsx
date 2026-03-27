import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sendMessage, subscribeToMessages, ChatMessage } from "../../services/chat";
import { maskPhone } from "../../utils/validation";

interface ChatScreenProps {
  rideId: string;
  userId: string;
  userRole: "rider" | "driver";
  otherName: string;
  onClose: () => void;
}

export default function ChatScreen({
  rideId,
  userId,
  userRole,
  otherName,
  onClose,
}: ChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(rideId, (msgs) => {
      setMessages(msgs);
    });

    return unsubscribe;
  }, [rideId]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setInput("");
    setSending(true);
    try {
      await sendMessage(rideId, userId, userRole, text);
    } catch {
      // Failed to send
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={onClose} className="mr-3">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center mr-3">
          <Text className="text-lg">💬</Text>
        </View>
        <View>
          <Text className="text-base font-bold text-gray-900">{otherName}</Text>
          <Text className="text-xs text-gray-500">In-app chat</Text>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          className="flex-1 px-4"
          contentContainerStyle={{ paddingVertical: 16 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          renderItem={({ item }) => {
            const isMe = item.senderId === userId;
            return (
              <View
                className={`mb-2 max-w-[80%] ${isMe ? "self-end" : "self-start"}`}
              >
                <View
                  className={`rounded-2xl px-4 py-2.5 ${
                    isMe ? "bg-primary-600 rounded-br-sm" : "bg-gray-100 rounded-bl-sm"
                  }`}
                >
                  <Text
                    className={`text-sm ${isMe ? "text-white" : "text-gray-900"}`}
                  >
                    {item.text}
                  </Text>
                </View>
                <Text
                  className={`text-[10px] text-gray-400 mt-0.5 ${
                    isMe ? "text-right" : "text-left"
                  }`}
                >
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            );
          }}
          ListEmptyComponent={
            <View className="items-center py-8">
              <Text className="text-gray-400 text-sm">
                Send a message to your {userRole === "rider" ? "driver" : "rider"}
              </Text>
            </View>
          }
        />

        {/* Input */}
        <View className="flex-row items-center px-4 py-3 border-t border-gray-100">
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm text-gray-900 mr-3"
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || sending}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              input.trim() ? "bg-primary-600" : "bg-gray-200"
            }`}
          >
            <Text className="text-white text-lg">↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
