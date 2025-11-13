import { collection, getDocs, getDoc, doc, addDoc, updateDoc, serverTimestamp, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { Auction, CreateAuctionData } from "../types";

/**
 * Fetch all approved auctions from Firestore (public view)
 */
export const fetchAuctions = async (): Promise<Auction[]> => {
  const q = query(collection(db, 'auctions'), where('status', '==', 'approved'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Auction[];
};

/**
 * Fetch a single auction by ID
 */
export const fetchAuctionById = async (auctionId: string): Promise<Auction | null> => {
  const docSnap = await getDoc(doc(db, 'auctions', auctionId));
  if (!docSnap.exists()) {
    return null;
  }
  return {
    id: docSnap.id,
    ...docSnap.data()
  } as Auction;
};

/**
 * Create a new auction (defaults to pending status)
 */
export const createAuction = async (auctionData: CreateAuctionData): Promise<string> => {
  const docRef = await addDoc(collection(db, 'auctions'), {
    ...auctionData,
    currentBid: auctionData.startPrice,
    bidsCount: 0,
    status: 'pending', // New auctions start as pending
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Update auction's current bid and bid count
 */
export const updateAuctionBid = async (
  auctionId: string, 
  currentBid: number, 
  bidsCount: number
): Promise<void> => {
  const auctionRef = doc(db, 'auctions', auctionId);
  await updateDoc(auctionRef, {
    currentBid,
    bidsCount,
  });
};

/**
 * Fetch all pending auctions (Admin only)
 */
export const fetchPendingAuctions = async (): Promise<Auction[]> => {
  const q = query(collection(db, 'auctions'), where('status', '==', 'pending'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Auction[];
};

/**
 * Approve an auction (Admin only)
 */
export const approveAuction = async (auctionId: string, adminId: string): Promise<void> => {
  const auctionRef = doc(db, 'auctions', auctionId);
  await updateDoc(auctionRef, {
    status: 'approved',
    reviewedBy: adminId,
    reviewedAt: serverTimestamp(),
  });
};

/**
 * Reject an auction (Admin only)
 */
export const rejectAuction = async (
  auctionId: string, 
  adminId: string, 
  reason?: string
): Promise<void> => {
  const auctionRef = doc(db, 'auctions', auctionId);
  await updateDoc(auctionRef, {
    status: 'rejected',
    reviewedBy: adminId,
    reviewedAt: serverTimestamp(),
    ...(reason && { rejectionReason: reason }),
  });
};
