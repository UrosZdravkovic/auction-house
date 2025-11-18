import { Timestamp } from 'firebase/firestore';

/**
 * Admin approval status for new auctions
 * - pending: Awaiting admin review
 * - approved: Admin approved, auction can go live
 * - rejected: Admin rejected, auction won't be shown
 */
export type AuctionApprovalStatus = 'pending' | 'approved' | 'rejected';

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
 */
export interface Auction {
  id: string;                           // Unique identifier (from Firebase)
  title: string;                        // Auction title/name
  description: string;                  // Detailed description of the item
  category: AuctionCategory;            // Item category
  imageUrl: string;                     // Main image URL
  images?: string[];                    // Additional images (optional)
  
  // Pricing & Bidding
  startingBid: number;                  // Minimum bid to start auction
  currentBid: number;                   // Current highest bid
  bidCount: number;                     // Total number of bids placed
  
  // Timing
  startDate: Date;                      // When auction starts
  endDate: Date;                        // When auction ends
  createdAt: Date;                      // When auction was created
  
  // Status & Ownership
  lifecycleStatus: AuctionLifecycleStatus; // Current lifecycle status (draft/active/ended/cancelled)
  approvalStatus: AuctionApprovalStatus;   // Admin approval status (pending/approved/rejected)
  creatorId: string;                    // User ID who created the auction
  creatorName: string;                  // Display name of creator
  
  // Admin Review
  reviewedBy?: string;                  // Admin ID who reviewed
  reviewedAt?: Date;                    // When it was reviewed
  rejectionReason?: string;             // Reason if rejected
  
  // Winner info (after auction ends)
  winnerId?: string;                    // User ID of winning bidder (if ended)
  winningBid?: number;                  // Final winning bid amount (if ended)
}

/**
 * Represents a bid placed on an auction
 * Used for tracking bid history and user's bids
 */
export interface Bid {
  id: string;                    // Unique bid identifier
  auctionId: string;             // Which auction this bid is for
  userId: string;                // Who placed the bid
  userName: string;              // Bidder's display name
  amount: number;                // Bid amount
  timestamp: Date;               // When bid was placed
  isWinning: boolean;            // Is this currently the winning bid
}

/**
 * Filter state for auction search/filtering
 * Tracks user's current filter selections
 */
export interface AuctionFilters {
  searchQuery: string;                              // Text search term
  category: AuctionCategory | 'All Categories';     // Selected category
  sortBy: SortOption;                               // Sort order
  lifecycleStatus?: AuctionLifecycleStatus;         // Optional lifecycle status filter
  approvalStatus?: AuctionApprovalStatus;           // Optional approval status filter (for admin)
}

/**
 * Firebase Firestore version of Auction
 * Uses Timestamp instead of Date for Firebase compatibility
 */
export interface AuctionFirestore extends Omit<Auction, 'startDate' | 'endDate' | 'createdAt' | 'reviewedAt'> {
  startDate: Timestamp;
  endDate: Timestamp;
  createdAt: Timestamp;
  reviewedAt?: Timestamp;
}

/**
 * Firebase Firestore version of Bid
 * Uses Timestamp instead of Date
 */
export interface BidFirestore extends Omit<Bid, 'timestamp'> {
  timestamp: Timestamp;
}

/**
 * Data required to create a new auction (before Firebase adds id and timestamps)
 */
export type CreateAuctionData = Omit<Auction, 
  'id' | 'createdAt' | 'currentBid' | 'bidCount' | 'lifecycleStatus' | 'approvalStatus' | 'reviewedBy' | 'reviewedAt' | 'rejectionReason' | 'winnerId' | 'winningBid'
>;

/**
 * Data required to create a new bid
 */
export type CreateBidData = Omit<Bid, 'id' | 'timestamp' | 'isWinning'>;
