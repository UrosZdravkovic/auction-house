import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { Auction, AuctionFirestore, CreateAuctionData } from "../types";

/**
 * Convert Firestore auction data to app format
 */
const convertFirestoreToAuction = (id: string, data: any): Auction => {
  const firestoreData = data as AuctionFirestore;
  return {
    ...firestoreData,
    id,
    createdAt: firestoreData.createdAt.toDate(),
    endsAt: firestoreData.endsAt.toDate(),
    reviewedAt: firestoreData.reviewedAt?.toDate(),
  };
};

/**
 * Fetch all approved auctions from Firestore (public view)
 */
export const fetchAuctions = async (): Promise<Auction[]> => {
  const q = query(collection(db, 'auctions'), where('status', '==', 'approved'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => convertFirestoreToAuction(doc.id, doc.data()));
};

export const fetchActiveAuctions = async (): Promise<Auction[]> => {
  const q = query(collection(db, 'auctions'), where('status', '==', 'approved'));
  const snapshot = await getDocs(q);
  const now = new Date();
  return snapshot.docs
    .map(doc => convertFirestoreToAuction(doc.id, doc.data()))
    .filter(auction => new Date(auction.endsAt) > now);
};



export const fetchUsersAuction = async (userId: string) : Promise<Auction[]> => {
  const q = query(collection(db, 'auctions'), where('ownerId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => convertFirestoreToAuction(doc.id, doc.data()));
};

/**
 * Fetch ALL auctions from Firestore (for debugging)
 */
export const fetchAllAuctions = async (): Promise<Auction[]> => {
  const snapshot = await getDocs(collection(db, 'auctions'));
  return snapshot.docs.map(doc => convertFirestoreToAuction(doc.id, doc.data()));
};

/**
 * Fetch a single auction by ID
 */
export const fetchAuctionById = async (auctionId: string): Promise<Auction | null> => {
  const docSnap = await getDoc(doc(db, 'auctions', auctionId));
  if (!docSnap.exists()) {
    return null;
  }
  return convertFirestoreToAuction(docSnap.id, docSnap.data());
};

/**
 * Create a new auction (defaults to pending status for admin approval)
 */
export const createAuction = async (auctionData: CreateAuctionData): Promise<string> => {
  const docRef = await addDoc(collection(db, 'auctions'), {
    ...auctionData,
    currentBid: auctionData.startPrice,
    bidsCount: 0,
    status: 'pending', // New auctions start as pending for admin approval
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
  return snapshot.docs.map(doc => convertFirestoreToAuction(doc.id, doc.data()));
};

/**
 * Approve an auction (Admin only)
 * Sets status to 'approved' so it appears in public listings
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
 * Sets status to 'rejected' so it won't appear in public listings
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

/**
 * Delete an auction (Admin only)
 * Permanently removes the auction from Firestore
 */
export const deleteAuction = async (auctionId: string): Promise<void> => {
  const auctionRef = doc(db, 'auctions', auctionId);
  await deleteDoc(auctionRef);
};
