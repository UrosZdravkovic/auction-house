import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { Bid, CreateBidData } from "../types";

/**
 * Fetch all bids for a specific auction
 */
export const fetchBidsByAuction = async (auctionId: string): Promise<Bid[]> => {
  const q = query(
    collection(db, 'bids'),
    where('auctionId', '==', auctionId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Bid[];
};

/**
 * Create a new bid
 */
export const createBid = async (bidData: CreateBidData): Promise<string> => {
  const docRef = await addDoc(collection(db, 'bids'), {
    ...bidData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Count total bids for an auction
 */
export const countBidsByAuction = async (auctionId: string): Promise<number> => {
  const q = query(
    collection(db, 'bids'),
    where('auctionId', '==', auctionId)
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
};
