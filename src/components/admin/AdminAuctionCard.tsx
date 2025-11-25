import { useState } from "react";
import { useApproveAuction } from "../../hooks/useAdminActions";
import { RejectAuctionDialog } from "./RejectAuctionDialog";
import { DeleteAuctionDialog } from "./DeleteAuctionDialog";
import { getThumbnailUrl } from "../../services/storageService";
import type { Auction } from "../../types";

interface AdminAuctionCardProps {
  auction: Auction;
}

export const AdminAuctionCard = ({ auction }: AdminAuctionCardProps) => {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const approveMutation = useApproveAuction();

  const handleApprove = () => {
    approveMutation.mutate(auction.id);
  };

  const isProcessing = approveMutation.isPending;

  const getStatusBorderColor = () => {
    switch (auction.status) {
      case "pending":
        return "border-yellow-500";
      case "approved":
        return "border-green-500";
      case "rejected":
        return "border-red-500";
      default:
        return "border-border";
    }
  };

  return (
    <>
      <div className={`bg-surface border-2 ${getStatusBorderColor()} rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 h-64`}>
        {/* Horizontal Layout: Image Left, Content Right */}
        <div className="flex flex-col md:flex-row h-full">
          {/* Image Section - Takes 40% width on desktop */}
          <div className="relative md:w-2/5 h-48 md:h-full">
            <img
              src={getThumbnailUrl(auction.imageUrl, 600, 400)}
              alt={auction.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Section - Takes 60% width on desktop */}
          <div className="flex-1 p-5 flex flex-col relative">
            {/* Delete Button - Top Right Corner */}
            <button
              onClick={() => setShowDeleteDialog(true)}
              disabled={isProcessing}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete auction"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            {/* Header: Title and Price */}
            <div className="flex items-start justify-between mb-3 pr-8">
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

            {/* Dates - Compact Row */}
            <div className="flex items-center gap-4 text-xs text-text-secondary mt-3 mb-3">
              <div>
                <span className="opacity-75">Created:</span>{" "}
                <span className="font-medium">{new Date(auction.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="w-px h-3 bg-border" />
              <div>
                <span className="opacity-75">Ends:</span>{" "}
                <span className="font-medium">{new Date(auction.endsAt).toLocaleDateString()}</span>
              </div>
              {auction.reviewedAt && (
                <>
                  <div className="w-px h-3 bg-border" />
                  <div>
                    <span className="opacity-75">Reviewed:</span>{" "}
                    <span className="font-medium">{new Date(auction.reviewedAt).toLocaleDateString()}</span>
                  </div>
                </>
              )}
            </div>

            {/* Error Messages */}
            {approveMutation.isError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-md p-2.5 mb-3">
                <p className="text-xs text-red-600">
                  {approveMutation.error?.message || "Failed to approve auction"}
                </p>
              </div>
            )}

            {/* Action Buttons - Compact */}
            <div className="flex gap-2 mt-auto">
              {auction.status === "pending" && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {approveMutation.isPending ? "Approving..." : "✓ Approve"}
                  </button>
                  <button
                    onClick={() => setShowRejectDialog(true)}
                    disabled={isProcessing}
                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✕ Reject
                  </button>
                </>
              )}

              {auction.status === "approved" && (
                <button
                  onClick={() => setShowRejectDialog(true)}
                  disabled={isProcessing}
                  className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✕ Reject Auction
                </button>
              )}

              {auction.status === "rejected" && (
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {approveMutation.isPending ? "Approving..." : "✓ Approve Auction"}
                </button>
              )}
            </div>
          </div>
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
    </>
  );
};