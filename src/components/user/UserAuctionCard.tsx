import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { usePlaceBid } from "../../hooks/useBids";
import { getThumbnailUrl } from "../../services/storageService";
import { getTimeRemaining } from "../../utils/timeUtils";
import type { Auction } from "../../types";

interface UserAuctionCardProps {
  auction: Auction;
}

export const UserAuctionCard = ({ auction }: UserAuctionCardProps) => {
  const { user } = useAuth();
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [bidAmount, setBidAmount] = useState("");

  const placeBidMutation = usePlaceBid();

  const isOwner = user?.uid === auction.ownerId;
  const isEnded = new Date(auction.endsAt) < new Date();
  const minBid = auction.currentBid + 1;

  const handlePlaceBid = () => {
    if (!user || !bidAmount) return;

    const amount = parseFloat(bidAmount);
    if (amount < minBid) return;

    placeBidMutation.mutate(
      {
        auctionId: auction.id,
        amount,
        userId: user.uid,
      },
      {
        onSuccess: () => {
          setShowBidDialog(false);
          setBidAmount("");
        },
      }
    );
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 h-64">
      {/* Horizontal Layout: Image Left, Content Right */}
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Section - Takes 40% width on desktop */}
        <div className="relative md:w-2/5 h-48 md:h-full">
          <img
            src={getThumbnailUrl(auction.imageUrl, 600, 400)}
            alt={auction.title}
            className="w-full h-full object-cover"
          />
          {isOwner && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
              Your Auction
            </div>
          )}
          {isEnded && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-gray-600 text-white text-xs font-semibold rounded">
              Ended
            </div>
          )}
        </div>

        {/* Content Section - Takes 60% width on desktop */}
        <div className="flex-1 p-5 flex flex-col">
          {/* Header: Title and Current Bid */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 pr-4">
              <h3 className="text-lg font-bold text-text-primary mb-1 line-clamp-1">
                {auction.title}
              </h3>
              <p className="text-text-secondary text-xs line-clamp-2">
                {auction.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-text-secondary">Current Bid</div>
              <div className="text-xl font-bold text-primary">
                ${auction.currentBid.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Compact Info Grid */}
          <div className="grid grid-cols-3 gap-3 py-3 border-y border-border text-xs">
            <div>
              <div className="text-text-secondary mb-0.5">Category</div>
              <div className="font-semibold text-text-primary capitalize">{auction.category}</div>
            </div>
            <div>
              <div className="text-text-secondary mb-0.5">Start Price</div>
              <div className="font-semibold text-text-primary">${auction.startPrice.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-text-secondary mb-0.5">Total Bids</div>
              <div className="font-semibold text-text-primary">{auction.bidsCount}</div>
            </div>
          </div>

          {/* Time Information */}
          <div className="flex items-center gap-4 text-xs text-text-secondary mt-3 mb-3">
            <div>
              <span className="opacity-75">Ends:</span>{" "}
              <span className="font-medium">{new Date(auction.endsAt).toLocaleDateString()}</span>
            </div>
            {!isEnded && (
              <>
                <div className="w-px h-3 bg-border" />
                <div>
                  <span className="opacity-75">Time Left:</span>{" "}
                  <span className="font-medium text-green-600">
                    {getTimeRemaining(new Date(auction.endsAt))}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            {!user ? (
              <button
                disabled
                className="w-full px-3 py-2 bg-gray-600/50 text-white text-xs font-semibold rounded-md cursor-not-allowed"
              >
                Login to Bid
              </button>
            ) : isOwner ? (
              <button
                disabled
                className="w-full px-3 py-2 bg-blue-600/50 text-white text-xs font-semibold rounded-md cursor-not-allowed"
              >
                Your Auction
              </button>
            ) : isEnded ? (
              <button
                disabled
                className="w-full px-3 py-2 bg-gray-600/50 text-white text-xs font-semibold rounded-md cursor-not-allowed"
              >
                Auction Ended
              </button>
            ) : (
              <button
                onClick={() => setShowBidDialog(true)}
                className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-md transition-colors"
              >
                💰 Place Bid
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Simple Bid Dialog (inline for now) */}
      {showBidDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowBidDialog(false)}>
          <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-text-primary mb-4">Place Your Bid</h3>
            
            <div className="mb-4">
              <p className="text-sm text-text-secondary mb-2">
                Current Bid: <span className="font-bold text-primary">${auction.currentBid.toLocaleString()}</span>
              </p>
              <p className="text-xs text-text-secondary mb-4">
                Minimum bid: ${minBid.toLocaleString()}
              </p>
              
              <label className="block text-sm font-medium text-text-primary mb-2">
                Your Bid Amount
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={minBid}
                step="1"
                placeholder={`$${minBid}`}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Error Message */}
            {placeBidMutation.isError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-md p-2.5 mb-3">
                <p className="text-xs text-red-600">
                  {placeBidMutation.error?.message || "Failed to place bid"}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowBidDialog(false)}
                disabled={placeBidMutation.isPending}
                className="flex-1 px-4 py-2 bg-surface border border-border text-text-primary text-sm font-medium rounded-md hover:bg-hover-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceBid}
                disabled={!bidAmount || parseFloat(bidAmount) < minBid || placeBidMutation.isPending}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placeBidMutation.isPending ? "Placing Bid..." : "Place Bid"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
