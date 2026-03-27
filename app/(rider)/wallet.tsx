import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/stores/authStore";
import { useWalletStore } from "../../src/stores/walletStore";
import { getOrCreateWallet, getTransactions, topUpWallet } from "../../src/services/wallet";
import { formatFare } from "../../src/utils/fare";
import { Transaction } from "../../src/types/wallet";
import { MIN_TOP_UP } from "../../src/types/wallet";
import Card from "../../src/components/ui/Card";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";
import Modal from "../../src/components/ui/Modal";
import Badge from "../../src/components/ui/Badge";
import LoadingSpinner from "../../src/components/ui/LoadingSpinner";

const TX_ICONS: Record<string, string> = {
  ride_payment: "🚗",
  commission: "💼",
  top_up: "💳",
  bonus: "🎁",
  penalty: "⚠️",
  refund: "↩️",
};

export default function WalletScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { wallet, setWallet, setLoading } = useWalletStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpMethod, setTopUpMethod] = useState<"jazzcash" | "easypaisa">("jazzcash");
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [loading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const w = await getOrCreateWallet(user.id);
        const txs = await getTransactions(user.id);
        setWallet({ ...w, transactions: txs });
        setTransactions(txs);
      } catch {
        // Firestore not configured
      } finally {
        setPageLoading(false);
      }
    })();
  }, [user]);

  const handleTopUp = async () => {
    const amount = parseInt(topUpAmount, 10);
    if (!amount || amount < MIN_TOP_UP || !user) return;

    setTopUpLoading(true);
    try {
      const tx = await topUpWallet(user.id, amount, topUpMethod);
      setTransactions((prev) => [tx, ...prev]);
      setWallet(wallet ? { ...wallet, balance: wallet.balance + amount } : null);
      setShowTopUp(false);
      setTopUpAmount("");
    } catch {
      // Handle error
    } finally {
      setTopUpLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          {t("rider.wallet")}
        </Text>

        {/* Balance Card */}
        <Card className="mb-4 bg-primary-600">
          <View className="flex-row items-end justify-between">
            <View>
              <Text className="text-primary-200 text-sm mb-1">
                {t("driver.balance")}
              </Text>
              <Text className="text-white text-3xl font-bold">
                {formatFare(wallet?.balance || 0)}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-primary-200 text-xs">Bonus</Text>
              <Text className="text-white text-sm font-medium">
                {formatFare(wallet?.bonusBalance || 0)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Quick Top-up Amounts */}
        <View className="flex-row mb-4">
          {[100, 500, 1000, 2000].map((amount) => (
            <TouchableOpacity
              key={amount}
              onPress={() => {
                setTopUpAmount(amount.toString());
                setShowTopUp(true);
              }}
              className="flex-1 bg-white border border-gray-200 rounded-lg py-2.5 mx-1 items-center"
            >
              <Text className="text-xs text-gray-500">PKR</Text>
              <Text className="text-sm font-bold text-gray-900">{amount}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title={t("driver.topUp")}
          onPress={() => setShowTopUp(true)}
          size="md"
          fullWidth
        />

        {/* Transactions */}
        <Text className="text-lg font-bold text-gray-900 mt-6 mb-3">
          Transactions
        </Text>
      </View>

      {transactions.length === 0 ? (
        <View className="items-center py-8">
          <Text className="text-gray-400">No transactions yet</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          className="px-4"
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Card className="mb-2">
              <View className="flex-row items-center">
                <Text className="text-xl mr-3">
                  {TX_ICONS[item.type] || "💰"}
                </Text>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-900">
                    {item.description}
                  </Text>
                  <Text className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  className={`text-base font-bold ${
                    item.amount >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.amount >= 0 ? "+" : ""}
                  {formatFare(item.amount)}
                </Text>
              </View>
            </Card>
          )}
        />
      )}

      {/* Top-Up Modal */}
      <Modal
        visible={showTopUp}
        onClose={() => setShowTopUp(false)}
        title="Top Up Wallet"
      >
        <Input
          label="Amount (PKR)"
          placeholder={`Minimum ${MIN_TOP_UP} PKR`}
          value={topUpAmount}
          onChangeText={setTopUpAmount}
          keyboardType="number-pad"
        />

        <Text className="text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </Text>
        <View className="flex-row mb-4">
          {(["jazzcash", "easypaisa"] as const).map((method) => (
            <TouchableOpacity
              key={method}
              onPress={() => setTopUpMethod(method)}
              className={`flex-1 py-3 mx-1 rounded-xl items-center border-2 ${
                topUpMethod === method
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200"
              }`}
            >
              <Text className="text-lg mb-1">
                {method === "jazzcash" ? "📱" : "💚"}
              </Text>
              <Text
                className={`text-sm font-medium ${
                  topUpMethod === method ? "text-primary-600" : "text-gray-600"
                }`}
              >
                {method === "jazzcash" ? "JazzCash" : "EasyPaisa"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title={`Top Up ${topUpAmount ? formatFare(parseInt(topUpAmount, 10) || 0) : ""}`}
          onPress={handleTopUp}
          loading={topUpLoading}
          disabled={!topUpAmount || parseInt(topUpAmount, 10) < MIN_TOP_UP}
          size="lg"
          fullWidth
        />
      </Modal>
    </SafeAreaView>
  );
}
