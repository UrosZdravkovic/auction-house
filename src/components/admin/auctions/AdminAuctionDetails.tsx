import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";
import ImageSlider from "@/components/ui/ImageSlider";
import { BidHistory } from '../../auction/BidsHistory';
import SameCategoryAuctions from "./SameCategoryAuctions";
import { RejectAuctionDialog } from "./RejectAuctionDialog";
import { DeleteAuctionDialog } from "./DeleteAuctionDialog";
import { useApproveAuction } from "@/hooks/useAdminActions";
import type { Auction } from "@/types";

type AdminAuctionDetailsProps = {
  auction: Auction;
  auctionId: string;
}

export const AdminAuctionDetails = ({ auction, auctionId }: AdminAuctionDetailsProps) => {
  const navigate = useNavigate();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const approveMutation = useApproveAuction();
  const isProcessing = approveMutation.isPending;

  return (
    <div className="grid grid-cols-1 xl-custom:grid-cols-2 gap-6 p-4 sm:p-6 xl-custom:p-8">
      {/* Title, description, nav buttons - order 1 on mobile, stays in left column on desktop */}
      <div className="order-1 xl-custom:order-1 xl-custom:row-span-1">
        <div className="bg-surface rounded-xl border border-border p-4 sm:p-6">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-4 mb-4 pb-4 border-b border-border">
            <button
              onClick={() => navigate('/auctions')}
              className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to All Auctions</span>
            </button>

            <div className="flex items-center gap-2">
              {auction.status === "approved" && (
                <button
                  onClick={() => setShowRejectDialog(true)}
                  disabled={isProcessing}
                  className="px-3 py-1.5 bg-error/10 hover:bg-error/20 border border-error/30 text-error text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Revert to Declined
                </button>
              )}
              <button
                onClick={() => setShowDeleteDialog(true)}
                disabled={isProcessing}
                className="p-1.5 hover:bg-error/10 text-text-secondary hover:text-error rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete auction"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <h1 className="text-xl font-bold text-text-primary">{auction.title}</h1>
          <p className="text-text-secondary mt-2">{auction.description}</p>
        </div>
      </div>

      {/* Image slider - order 2 on mobile, first in right column on desktop */}
      <div className="order-2 xl-custom:order-2 xl-custom:row-start-1">
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <ImageSlider images={auction.imageUrls} />
        </div>
      </div>

      {/* Bid stats - order 3 on mobile, left column on desktop */}
      <div className="order-3 xl-custom:order-3">
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
      </div>

      {/* Bid history - order 4 on mobile, left column on desktop */}
      <div className="order-4 xl-custom:order-4">
        <div className="bg-surface rounded-xl border border-border p-6">
          <BidHistory auctionId={auctionId} />
        </div>
      </div>

      {/* Related auctions - order 5 on mobile, right column on desktop */}
      <div className="order-5 xl-custom:order-5 xl-custom:row-start-2 xl-custom:row-span-2">
        <div className="bg-surface">
          <SameCategoryAuctions categoryId={auction.category} currentAuctionId={auction.id} />
        </div>
      </div>

      <RejectAuctionDialog
        auctionId={auction.id}
        auctionTitle={auction.title}
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
      />

      <DeleteAuctionDialog
        auctionId={auction.id}
        auctionTitle={auction.title}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </div>
  );
};