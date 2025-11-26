import { useAuctions } from "../../hooks/useAuctions";
import { UserAuctionCard } from "../../components/user/UserAuctionCard";

export default function AuctionsPage() {
  const { data: auctions = [], isLoading, error } = useAuctions();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Active Auctions</h1>
      
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-text-secondary">Loading auctions...</p>
        </div>
      )}

      {error && (
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded mb-6">
          {error instanceof Error ? error.message : "Failed to load auctions. Please try again later."}
        </div>
      )}

      {!isLoading && !error && auctions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-secondary">No approved auctions found.</p>
        </div>
      )}

      {!isLoading && !error && auctions.length > 0 && (
        <div className="space-y-6">
          <p className="text-text-secondary mb-4">Found {auctions.length} active auction(s)</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-1">
            {auctions.map((auction) => (
              <UserAuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}