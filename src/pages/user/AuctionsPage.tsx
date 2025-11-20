import { useEffect, useState } from "react";
import { fetchAuctions } from "../../services/auctionService";
import type { Auction } from "../../types";

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAuctions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAuctions();
        setAuctions(data);
      } catch (err) {
        console.error("Failed to fetch auctions:", err);
        setError("Failed to load auctions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadAuctions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Auctions</h1>
      
      {loading && (
        <div className="text-center py-12">
          <p className="text-text-secondary">Loading auctions...</p>
        </div>
      )}

      {error && (
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {!loading && !error && auctions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-secondary">No approved auctions found.</p>
        </div>
      )}

      {!loading && !error && auctions.length > 0 && (
        <div className="space-y-4">
          <p className="text-text-secondary mb-4">Found {auctions.length} auction(s)</p>
          
          {auctions.map((auction) => (
            <div 
              key={auction.id} 
              className="bg-surface border border-border rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-2">{auction.title}</h3>
              <p className="text-text-secondary mb-4">{auction.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">Category: </span>
                  <span className="font-medium">{auction.category}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Starting Price: </span>
                  <span className="font-medium">${auction.startPrice}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Current Bid: </span>
                  <span className="font-medium">${auction.currentBid}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Total Bids: </span>
                  <span className="font-medium">{auction.bidsCount}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Ends: </span>
                  <span className="font-medium">{new Date(auction.endsAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Status: </span>
                  <span className="font-medium capitalize">{auction.status}</span>
                </div>
              </div>
              
              {auction.imageUrl && (
                <div className="mt-4">
                  <img 
                    src={auction.imageUrl} 
                    alt={auction.title}
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}