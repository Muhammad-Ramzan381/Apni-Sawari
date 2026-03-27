import { create } from "zustand";
import { Transaction, Wallet } from "../types/wallet";

interface WalletState {
  wallet: Wallet | null;
  isLoading: boolean;

  setWallet: (wallet: Wallet | null) => void;
  updateBalance: (amount: number) => void;
  addTransaction: (transaction: Transaction) => void;
  setLoading: (loading: boolean) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  isLoading: false,

  setWallet: (wallet) => set({ wallet }),

  updateBalance: (amount) =>
    set((state) => ({
      wallet: state.wallet
        ? { ...state.wallet, balance: state.wallet.balance + amount }
        : null,
    })),

  addTransaction: (transaction) =>
    set((state) => ({
      wallet: state.wallet
        ? {
            ...state.wallet,
            transactions: [transaction, ...state.wallet.transactions],
          }
        : null,
    })),

  setLoading: (isLoading) => set({ isLoading }),
}));
