import { useState } from "react";
import { useApproveAuction } from "../../hooks/useAdminActions";
import { RejectAuctionDialog } from "./RejectAuctionDialog";
import type { Auction } from "../../types";

interface AdminAuctionCardProps {
  auction: Auction;
}

export const AdminAuctionCard = ({ auction }: AdminAuctionCardProps) => {
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const approveMutation = useApproveAuction();

  const handleApprove = () => {
    approveMutation.mutate(auction.id);
  };

  const isProcessing = approveMutation.isPending;

  const getStatusBadge = () => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide";

    switch (auction.status) {
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-500/10 text-yellow-600 border border-yellow-500/20`}>
            Pending Review
          </span>
        );
      case "approved":
        return (
          <span className={`${baseClasses} bg-green-500/10 text-green-600 border border-green-500/20`}>
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className={`${baseClasses} bg-red-500/10 text-red-600 border border-red-500/20`}>
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="bg-surface border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-colors flex flex-col">
        {/* Image Section */}
        <div className="w-full h-48">
          <img
            src={auction.imageUrl}
            alt={auction.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {auction.title}
              </h3>
              {getStatusBadge()}
            </div>
          </div>

          <p className="text-text-secondary text-sm mb-4 line-clamp-2">
            {auction.description}
          </p>

          {/* Auction Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-text-secondary block mb-1">Category</span>
              <span className="font-medium text-text-primary capitalize">
                {auction.category}
              </span>
            </div>
            <div>
              <span className="text-text-secondary block mb-1">Starting Price</span>
              <span className="font-medium text-text-primary">
                ${auction.startPrice.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-text-secondary block mb-1">Current Bid</span>
              <span className="font-medium text-text-primary">
                ${auction.currentBid.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-text-secondary block mb-1">Total Bids</span>
              <span className="font-medium text-text-primary">
                {auction.bidsCount}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-4 text-xs text-text-secondary mb-4 pb-4 border-b border-border">
            <div>
              <span>Created: </span>
              <span className="font-medium">
                {new Date(auction.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span>Ends: </span>
              <span className="font-medium">
                {new Date(auction.endsAt).toLocaleDateString()}
              </span>
            </div>
            {auction.reviewedAt && (
              <div>
                <span>Reviewed: </span>
                <span className="font-medium">
                  {new Date(auction.reviewedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Error Messages */}
          {approveMutation.isError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 mb-4">
              <p className="text-sm text-red-600">
                {approveMutation.error?.message || "Failed to approve auction"}
              </p>
            </div>
          )}

          {/* Rejection Reason (if rejected) */}
          {auction.status === "rejected" && auction.rejectionReason && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-md p-3 mb-4">
              <p className="text-xs text-red-600 font-medium mb-1">Rejection Reason:</p>
              <p className="text-sm text-red-700">{auction.rejectionReason}</p>
            </div>
          )}

          {/* Action Buttons Based on Status */}
          <div className="flex gap-3">
            {auction.status === "pending" && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {approveMutation.isPending ? "Approving..." : "Approve"}
                </button>
                <button
                  onClick={() => setShowRejectDialog(true)}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject
                </button>
              </>
            )}

            {auction.status === "approved" && (
              <button
                onClick={() => setShowRejectDialog(true)}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Auction
              </button>
            )}

            {auction.status === "rejected" && (
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {approveMutation.isPending ? "Approving..." : "Approve Auction"}
              </button>
            )}
          </div>
        </div>
      </div>


      <RejectAuctionDialog
        auctionId={auction.id}
        auctionTitle={auction.title}
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
      />
    </>
  );
};