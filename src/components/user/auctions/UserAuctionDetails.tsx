import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClock } from "react-icons/fi";
import ImageSlider from "@/components/ui/ImageSlider";
import { BidHistory } from "../../auction/BidsHistory";
import { useAuth } from "@/hooks/useAuth";
import { usePlaceBid } from "@/hooks/useBids";
import { getTimeRemaining } from "@/utils/timeUtils";
import type { Auction } from "@/types";

type UserAuctionDetailsProps = {
  auction: Auction;
  auctionId: string;
};

export const UserAuctionDetails = ({ auction, auctionId }: UserAuctionDetailsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bidAmount, setBidAmount] = useState("");

  const placeBidMutation = usePlaceBid();

  const isEnded = new Date(auction.endsAt) < new Date();
  const isOwner = user?.uid === auction.ownerId;
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
          setBidAmount("");
        },
      }
    );
  };

  return (
    <div className="flex flex-col xl-custom:flex-row gap-6 p-4 sm:p-6 xl-custom:p-8 max-w-7xl mx-auto">
      {/* Title - order 1 on mobile, stays in right column on desktop */}
      <div className="xl-custom:hidden order-1">
        <div className="bg-surface rounded-xl border border-border p-4 sm:p-6">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Auctions</span>
            </button>
          </div>
          <h1 className="text-xl font-bold text-text-primary">{auction.title}</h1>
          <p className="text-text-secondary mt-2">{auction.description}</p>

          {/* Category */}
          <div className="mt-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {auction.category}
            </span>
          </div>
        </div>
      </div>

      {/* Left column - Image and Bid history */}
      <div className="flex flex-col gap-6 xl-custom:w-1/2 order-2 xl-custom:order-1">
        {/* Image slider */}
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <ImageSlider images={auction.imageUrls} />
        </div>

        {/* Bid history */}
        <div className="bg-surface rounded-xl border border-border p-4 sm:p-6">
          <BidHistory auctionId={auctionId} />
        </div>
      </div>

      {/* Right column - Title, Bid, Stats */}
      <div className="flex flex-col gap-6 xl-custom:w-1/2 order-3 xl-custom:order-2">
        {/* Title, description, back button - hidden on mobile, shown on desktop */}
        <div className="hidden xl-custom:block bg-surface rounded-xl border border-border p-4 sm:p-6">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Auctions</span>
            </button>
          </div>
          <h1 className="text-xl font-bold text-text-primary">{auction.title}</h1>
          <p className="text-text-secondary mt-2">{auction.description}</p>

          {/* Category */}
          <div className="mt-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {auction.category}
            </span>
          </div>
        </div>

        {/* Place bid section */}
        <div className="bg-surface rounded-xl border border-border p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Place Your Bid</h3>

          {!user ? (
            <div className="text-center py-4">
              <p className="text-text-secondary mb-4">You need to be logged in to place a bid.</p>
              <button
                onClick={() => navigate("/auth?mode=login")}
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-all duration-200"
              >
                Sign In to Bid
              </button>
            </div>
          ) : isOwner ? (
            <div className="text-center py-4">
              <p className="text-text-secondary">You cannot bid on your own auction.</p>
            </div>
          ) : isEnded ? (
            <div className="text-center py-4">
              <p className="text-text-secondary">This auction has ended.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-text-secondary mb-4">
                Minimum bid: <span className="font-semibold text-primary">${minBid.toLocaleString()}</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={minBid}
                    step="1"
                    placeholder={`$${minBid}`}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  onClick={handlePlaceBid}
                  disabled={!bidAmount || parseFloat(bidAmount) < minBid || placeBidMutation.isPending}
                  className="px-6 py-3 bg-success hover:bg-success/90 text-white text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {placeBidMutation.isPending ? "Placing Bid..." : "Place Bid"}
                </button>
              </div>

              {placeBidMutation.isError && (
                <div className="mt-3 p-3 bg-error/10 border border-error/30 rounded-lg">
                  <p className="text-sm text-error">
                    {placeBidMutation.error?.message || "Failed to place bid"}
                  </p>
                </div>
              )}

              {placeBidMutation.isSuccess && (
                <div className="mt-3 p-3 bg-success/10 border border-success/30 rounded-lg">
                  <p className="text-sm text-success">Bid placed successfully!</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bid stats and time remaining */}
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface rounded-xl border border-border p-4">
              <p className="text-xs text-text-secondary uppercase tracking-wide">
                {auction.bidsCount === 0 ? "Starting Price" : "Current Bid"}
              </p>
              <p className="text-2xl font-bold text-primary mt-1">
                ${auction.currentBid.toLocaleString()}
              </p>
            </div>
            <div className="bg-surface rounded-xl border border-border p-4">
              <p className="text-xs text-text-secondary uppercase tracking-wide">Total Bids</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{auction.bidsCount}</p>
            </div>
          </div>

          {/* Time remaining */}
          <div className="mt-4 bg-surface rounded-xl border border-border p-4">
            <div className="flex items-center gap-2">
              <FiClock className={`w-5 h-5 ${isEnded ? "text-error" : "text-success"}`} />
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wide">
                  {isEnded ? "Auction Ended" : "Time Remaining"}
                </p>
                <p className={`text-lg font-bold mt-0.5 ${isEnded ? "text-error" : "text-success"}`}>
                  {isEnded ? "Ended" : getTimeRemaining(new Date(auction.endsAt))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
