import { Timestamp } from 'firebase/firestore';

/**
 * Admin approval status for new auctions
 * - pending: Awaiting admin review
 * - approved: Admin approved, auction can go live
 * - rejected: Admin rejected, auction won't be shown
 * - completed: Auction has ended and all bids have been processed
 */
export type AuctionApprovalStatus = 'pending' | 'approved' | 'rejected' | 'completed';

/**
 * Lifecycle status of an auction
 * - draft: Not yet submitted (user is creating it)
 * - active: Live and accepting bids (after admin approval)
 * - ended: Auction time has expired
 * - cancelled: Cancelled by admin or creator
 */
export type AuctionLifecycleStatus = 'draft' | 'active' | 'ended' | 'cancelled';

/**
 * Categories for organizing auctions
 * Used for filtering and displaying auction types
 */
export type AuctionCategory =
  | 'Electronics'
  | 'Art & Collectibles'
  | 'Jewelry'
  | 'Vehicles'
  | 'Real Estate'
  | 'Furniture'
  | 'Fashion'
  | 'Other';

/**
 * Sort options for auction listings
 * Determines how auctions are ordered in the grid
 */
export type SortOption =
  | 'ending-soon'    // Auctions ending soonest first
  | 'newly-listed'   // Most recently created first
  | 'price-low'      // Lowest current bid first
  | 'price-high'     // Highest current bid first
  | 'most-bids';     // Most bidding activity first

/**
 * Main Auction interface
 * Represents all data for a single auction item
 * Aligned with Firebase structure
 */
export interface Auction {
  id: string;                           // Unique identifier (from Firebase)
  title: string;                        // Auction title/name
  description: string;                  // Detailed description of the item
  category: string;                     // Item category (matches Firebase structure)
  imageUrls: string[];                  // Array of image URLs (Firebase: imageUrls)
  
  // Pricing & Bidding (matching Firebase field names)
  startPrice: number;                   // Starting price (Firebase: startPrice)
  currentBid: number;                   // Current highest bid (Firebase: currentBid)
  bidsCount: number;                    // Total number of bids (Firebase: bidsCount)
  
  // Timing
  createdAt: Date;                      // When auction was created
  endsAt: Date;                         // When auction ends (Firebase: endsAt)
  
  // Status & Ownership (matching Firebase)
  status: AuctionApprovalStatus;        // Admin approval status (pending/approved/rejected)
  ownerId: string;                      // User ID who created the auction (Firebase: ownerId)
  
  // Admin Review
  reviewedBy?: string;                  // Admin ID who reviewed
  reviewedAt?: Date;                    // When it was reviewed
  rejectionReason?: string;             // Reason if rejected
}

/**
 * Represents a bid placed on an auction
 * Aligned with Firebase structure
 */
export interface Bid {
  id: string;                    // Unique bid identifier
  auctionId: string;             // Which auction this bid is for (Firebase: auctionId)
  userId: string;                // Who placed the bid (Firebase: userId)
  amount: number;                // Bid amount (Firebase: amount)
  createdAt: Date;               // When bid was placed (Firebase: createdAt)
}

/**
 * Filter state for auction search/filtering
 * Tracks user's current filter selections
 */
export interface AuctionFilters {
  searchQuery: string;                              // Text search term
  category: string | 'All Categories';              // Selected category
  sortBy: SortOption;                               // Sort order
  status?: AuctionApprovalStatus;                   // Optional status filter
}

/**
 * Firestore version of Auction (uses Timestamp instead of Date)
 * Used when reading/writing to Firebase
 */
export interface AuctionFirestore extends Omit<Auction, 'createdAt' | 'endsAt' | 'reviewedAt'> {
  createdAt: Timestamp;
  endsAt: Timestamp;
  reviewedAt?: Timestamp;
}

/**
 * Firestore version of Bid (uses Timestamp instead of Date)
 * Used when reading/writing to Firebase
 */
export interface BidFirestore extends Omit<Bid, 'createdAt'> {
  createdAt: Timestamp;
}

/**
 * Data required to create a new auction (before Firebase adds id and timestamps)
 */
export type CreateAuctionData = Omit<Auction, 
  'id' | 'createdAt' | 'currentBid' | 'bidsCount' | 'status' | 'reviewedBy' | 'reviewedAt' | 'rejectionReason'
>;

/**
 * Data required to create a new bid
 */
export type CreateBidData = Omit<Bid, 'id' | 'createdAt'>;
