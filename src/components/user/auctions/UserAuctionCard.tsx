import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import { useAuth } from "../../../hooks/useAuth";
import { usePlaceBid } from "../../../hooks/useBids";
import { getThumbnailUrl } from "../../../services/storageService";
import { getTimeRemaining } from "../../../utils/timeUtils";
import type { Auction } from "../../../types";

interface UserAuctionCardProps {
  auction: Auction;
}

export const UserAuctionCard = ({ auction }: UserAuctionCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [bidAmount, setBidAmount] = useState("");

  const placeBidMutation = usePlaceBid();

  const isEnded = new Date(auction.endsAt) < new Date();
  const minBid = auction.currentBid + 1;

  const handleCardClick = () => {
    navigate(`/auction/${auction.id}`);
  };

  const handlePlaceBid = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleBidButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBidDialog(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group bg-surface border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/30 cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
          {/* Image */}
          <div className="relative w-full h-32 xs:h-36 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 shrink-0 bg-surface-hover rounded-lg overflow-hidden">
            <img
              src={getThumbnailUrl(auction.imageUrls?.[0] || "", 480, 480)}
              alt={auction.title}
              className="w-full h-full object-cover"
            />
            {isEnded && (
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-gray-600/90 text-white text-xs font-medium rounded-md">
                Ended
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-text-primary line-clamp-1 group-hover:text-primary transition-colors mb-1">
                  {auction.title}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-1 sm:line-clamp-2">
                  {auction.description}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-x-2 xs:gap-x-3 gap-y-1 sm:gap-x-4 mb-2 sm:mb-3 text-xs">
              <div>
                <span className="text-text-secondary text-[10px] xs:text-xs">
                  {auction.bidsCount === 0 ? "Starting:" : "Current:"}
                </span>
                <span className="ml-1 sm:ml-1.5 font-bold text-primary text-xs xs:text-sm sm:text-base">
                  ${auction.currentBid.toLocaleString()}
                </span>
              </div>
              <div className="hidden xs:block w-px h-3 xs:h-4 bg-border" />
              <div>
                <span className="text-text-secondary text-[10px] xs:text-xs">Bids:</span>
                <span className="ml-1 sm:ml-1.5 font-semibold text-text-primary text-[10px] xs:text-xs">{auction.bidsCount}</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border" />
              <span className="hidden sm:inline text-text-secondary capitalize">{auction.category}</span>
              {!isEnded && (
                <>
                  <div className="hidden md:block w-px h-4 bg-border" />
                  <div className="hidden md:flex items-center gap-1.5 text-success">
                    <FiClock className="w-3.5 h-3.5" />
                    <span className="font-medium">{getTimeRemaining(new Date(auction.endsAt))}</span>
                  </div>
                </>
              )}
            </div>

            {/* Action Button */}
            <div className="flex flex-col xs:flex-row gap-2 mt-auto">
              {!user ? (
                <button
                  disabled
                  className="flex-1 px-3 sm:px-4 py-2 bg-gray-600/50 text-white text-sm font-medium rounded-lg cursor-not-allowed"
                >
                  Login to Bid
                </button>
              ) : isEnded ? (
                <button
                  disabled
                  className="flex-1 px-3 sm:px-4 py-2 bg-gray-600/50 text-white text-sm font-medium rounded-lg cursor-not-allowed"
                >
                  Auction Ended
                </button>
              ) : (
                <button
                  onClick={handleBidButtonClick}
                  className="flex-1 px-3 sm:px-4 py-2 bg-success hover:bg-success/90 text-white text-sm font-medium rounded-lg transition-all duration-250"
                >
                  Place Bid
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bid Dialog */}
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
                className="flex-1 px-4 py-2 bg-success hover:bg-success/90 text-white text-sm font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placeBidMutation.isPending ? "Placing Bid..." : "Place Bid"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
