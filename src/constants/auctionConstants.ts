import type { AuctionCategory, SortOption } from '../types/auction';

/**
 * Available auction categories
 * 'All Categories' is used for filtering UI - shows all auctions regardless of category
 * Other values match the AuctionCategory type for specific filtering
 */
export const AUCTION_CATEGORIES: ('All Categories' | AuctionCategory)[] = [
  'All Categories',
  'Electronics',
  'Art & Collectibles',
  'Jewelry',
  'Vehicles',
  'Real Estate',
  'Furniture',
  'Fashion',
  'Other',
];

/**
 * Sort options with display labels
 * value: Used in code for sorting logic
 * label: User-friendly text shown in UI dropdown
 */
export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'ending-soon', label: 'Ending Soon' },
  { value: 'newly-listed', label: 'Newly Listed' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'most-bids', label: 'Most Bids' },
];

/**
 * Default filter state
 * Used when resetting filters or initializing component state
 */
export const DEFAULT_FILTERS = {
  searchQuery: '',
  category: 'All Categories' as const,
  sortBy: 'ending-soon' as SortOption,
};

/**
 * Pagination settings
 * ITEMS_PER_PAGE: How many auctions to show at once
 * LOAD_MORE_INCREMENT: How many more to load when "Load More" is clicked
 */
export const ITEMS_PER_PAGE = 12;
export const LOAD_MORE_INCREMENT = 6;

/**
 * Time thresholds for display urgency
 * Used to style "ending soon" badges differently based on urgency
 */
export const TIME_THRESHOLDS = {
  CRITICAL: 60 * 60 * 1000,      // 1 hour in milliseconds (show red)
  WARNING: 24 * 60 * 60 * 1000,  // 24 hours in milliseconds (show yellow)
};

/**
 * Minimum bid increment
 * The minimum amount by which a new bid must exceed the current bid
 */
export const MIN_BID_INCREMENT = 10;
