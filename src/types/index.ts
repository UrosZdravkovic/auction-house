import { Timestamp } from "firebase/firestore";

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

export type CreateAuctionData = Omit<Auction, 'id' | 'createdAt' | 'currentBid' | 'bidsCount'>;
export type CreateBidData = Omit<Bid, 'id' | 'createdAt'>;
