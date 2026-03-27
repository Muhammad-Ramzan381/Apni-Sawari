import { useEffect } from "react";
import { useWalletStore } from "../stores/walletStore";
import { getOrCreateWallet, getTransactions } from "../services/wallet";

export function useWallet(userId: string | null) {
  const { wallet, setWallet, setLoading } = useWalletStore();

  useEffect(() => {
    if (!userId) return;

    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const w = await getOrCreateWallet(userId);
        const txs = await getTransactions(userId);

        if (mounted) {
          setWallet({ ...w, transactions: txs });
        }
      } catch {
        // Wallet fetch failed
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  return wallet;
}
