import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({
  visible,
  onClose,
  title,
  children,
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-end"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-t-3xl px-6 pt-6 pb-10"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />
          {title ? (
            <Text className="text-xl font-bold text-gray-900 mb-4">
              {title}
            </Text>
          ) : null}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
