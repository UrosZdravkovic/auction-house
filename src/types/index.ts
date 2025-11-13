import { Timestamp } from "firebase/firestore";

// User role types
export type UserRole = "user" | "admin";

// Auction status types
export type AuctionStatus = "pending" | "approved" | "rejected";

export type Auction = {
  id: string;
  title: string;
  description: string;
  category: string;
  startPrice: number;
  currentBid: number;
  bidsCount: number;
  imageUrl: string;
  ownerId: string;
  status: AuctionStatus;
  reviewedBy?: string; // Admin ID who reviewed
  reviewedAt?: Timestamp; // When it was reviewed
  rejectionReason?: string; // Reason if rejected
  createdAt: Timestamp;
  endsAt: Timestamp;
};

export type Bid = {
  id: string;
  auctionId: string;
  userId: string;
  amount: number;
  createdAt: Timestamp;
};

export type CreateAuctionData = Omit<Auction, 'id' | 'createdAt' | 'currentBid' | 'bidsCount' | 'status' | 'reviewedBy' | 'reviewedAt' | 'rejectionReason'>;
export type CreateBidData = Omit<Bid, 'id' | 'createdAt'>;
