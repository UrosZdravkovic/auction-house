import { HiSearch } from 'react-icons/hi';

export const AuctionEmptyState = () => {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center">
        <HiSearch className="w-8 h-8 text-text-tertiary" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        No auctions found
      </h3>
      <p className="text-text-secondary">
        Try adjusting your filters or search query
      </p>
    </div>
  );
};
