import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import ImageSlider from "@/components/ui/ImageSlider";
import { BidHistory } from '../../auction/BidsHistory';
import SameCategoryAuctions from "./SameCategoryAuctions";
import type { Auction } from "@/types";

type AdminAuctionDetailsProps = {
  auction: Auction;
  auctionId: string;
}

export const AdminAuctionDetails = ({ auction, auctionId }: AdminAuctionDetailsProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-6 p-8">
      {/* Left column - Image and Related Auctions */}
      <div className="space-y-6">
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <ImageSlider images={auction.imageUrls} />
        </div>

        <div className="bg-surface">
          <SameCategoryAuctions categoryId={auction.category} currentAuctionId={auction.id} />
        </div>
      </div>

      {/* Right column - Details and Bids */}
      <div className="space-y-4">
        <div className="bg-surface rounded-xl border border-border p-6">
          <button
            onClick={() => navigate('/auctions')}
            className="flex items-center gap-1.5 mb-4 pb-4 border-b border-border text-text-secondary hover:text-text-primary transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to All Auctions</span>
          </button>
          <h1 className="text-xl font-bold text-text-primary">{auction.title}</h1>
          <p className="text-text-secondary mt-2">{auction.description}</p>
        </div>

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
            <p className="text-2xl font-bold text-text-primary mt-1">
              {auction.bidsCount}
            </p>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6">
          <BidHistory auctionId={auctionId} />
        </div>
      </div>
    </div>
  );
};