export type TransactionType =
  | "ride_payment"
  | "commission"
  | "top_up"
  | "bonus"
  | "penalty"
  | "refund";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  rideId?: string;
  createdAt: number;
}

export interface Wallet {
  userId: string;
  balance: number;
  currency: "PKR";
  bonusBalance: number;
  transactions: Transaction[];
}

export const REWARD_MILESTONES = [
  { spent: 1000, bonus: 50 },
  { spent: 2000, bonus: 150 },
  { spent: 3000, bonus: 300 },
] as const;

export const COMMISSION_RATE = 0.05; // 5%
export const MIN_TOP_UP = 50; // PKR
