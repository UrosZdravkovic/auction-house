import { useState } from "react";
import { useApproveAuction, useRejectAuction } from "../../hooks/useAdminActions";
import type { Auction } from "../../types";

interface AdminAuctionCardProps {
  auction: Auction;
}

export const AdminAuctionCard = ({ auction }: AdminAuctionCardProps) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const approveMutation = useApproveAuction();
  const rejectMutation = useRejectAuction();

  const handleApprove = () => {
    approveMutation.mutate(auction.id);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    rejectMutation.mutate(
      { auctionId: auction.id, reason: rejectionReason },
      {
        onSuccess: () => {
          setShowRejectModal(false);
          setRejectionReason("");
        },
      }
    );
  };

  const isProcessing = approveMutation.isPending || rejectMutation.isPending;

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
      <div className="bg-surface border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          {auction.imageUrl ? (
            <div className="lg:w-64 h-48 lg:h-auto">
              <img
                src={auction.imageUrl}
                alt={auction.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="lg:w-64 h-48 lg:h-auto bg-active-bg flex items-center justify-center">
              <svg
                className="w-16 h-16 text-text-secondary/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Content Section */}
          <div className="flex-1 p-6">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
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

            {rejectMutation.isError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 mb-4">
                <p className="text-sm text-red-600">
                  {rejectMutation.error?.message || "Failed to reject auction"}
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
                    onClick={() => setShowRejectModal(true)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject
                  </button>
                </>
              )}

              {auction.status === "approved" && (
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rejectMutation.isPending ? "Rejecting..." : "Reject Auction"}
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
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg border border-border max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">
              Reject Auction
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              Please provide a reason for rejecting "{auction.title}"
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-4 py-2 bg-background border border-border rounded-md text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
              disabled={isProcessing}
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                  rejectMutation.reset();
                }}
                disabled={isProcessing}
                className="px-4 py-2 bg-active-bg hover:bg-hover-bg text-text-primary text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing || !rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {rejectMutation.isPending ? "Rejecting..." : "Reject Auction"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};