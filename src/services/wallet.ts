import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import { Wallet, Transaction, TransactionType, COMMISSION_RATE } from "../types/wallet";

const WALLETS_COLLECTION = "wallets";

export async function getOrCreateWallet(userId: string): Promise<Wallet> {
  const walletRef = doc(db, WALLETS_COLLECTION, userId);
  const docSnap = await getDoc(walletRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      userId,
      balance: data.balance || 0,
      currency: "PKR",
      bonusBalance: data.bonusBalance || 0,
      transactions: [],
    };
  }

  // Create new wallet
  const newWallet: Omit<Wallet, "transactions"> = {
    userId,
    balance: 0,
    currency: "PKR",
    bonusBalance: 0,
  };

  await setDoc(walletRef, { ...newWallet, createdAt: serverTimestamp() });

  return { ...newWallet, transactions: [] };
}

export async function addTransaction(
  userId: string,
  type: TransactionType,
  amount: number,
  description: string,
  rideId?: string
): Promise<Transaction> {
  const txRef = collection(db, WALLETS_COLLECTION, userId, "transactions");

  const tx: Omit<Transaction, "id"> = {
    type,
    amount,
    description,
    rideId,
    createdAt: Date.now(),
  };

  const docRef = await addDoc(txRef, {
    ...tx,
    createdAt: serverTimestamp(),
  });

  // Update wallet balance
  const walletRef = doc(db, WALLETS_COLLECTION, userId);
  if (type === "bonus") {
    await updateDoc(walletRef, { bonusBalance: increment(amount) });
  } else {
    await updateDoc(walletRef, { balance: increment(amount) });
  }

  return { id: docRef.id, ...tx };
}

export async function deductCommission(
  driverId: string,
  fareTotal: number,
  rideId: string
): Promise<void> {
  const commission = Math.round(fareTotal * COMMISSION_RATE);

  await addTransaction(
    driverId,
    "commission",
    -commission,
    `5% commission on ride`,
    rideId
  );
}

export async function topUpWallet(
  userId: string,
  amount: number,
  method: "jazzcash" | "easypaisa"
): Promise<Transaction> {
  return addTransaction(
    userId,
    "top_up",
    amount,
    `Top up via ${method === "jazzcash" ? "JazzCash" : "EasyPaisa"}`
  );
}

export async function getTransactions(
  userId: string,
  maxResults: number = 50
): Promise<Transaction[]> {
  const q = query(
    collection(db, WALLETS_COLLECTION, userId, "transactions"),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction));
}
