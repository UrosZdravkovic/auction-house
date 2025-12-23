import { useState } from "react";
import { Link } from "react-router-dom";
import { useApproveAuction } from "../../hooks/useAdminActions";
import { RejectAuctionDialog } from "./RejectAuctionDialog";
import { DeleteAuctionDialog } from "./DeleteAuctionDialog";
import { getThumbnailUrl } from "../../services/storageService";
import { getTimeRemaining } from "../../utils/timeUtils";
import type { Auction } from "../../types";


interface AdminAuctionCardProps {
  auction: Auction;

}

export const AdminAuctionCard = ({ auction }: AdminAuctionCardProps) => {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const approveMutation = useApproveAuction();

  const isAuctionExpired = (endsAt: Date) => {
    return new Date() > new Date(endsAt);
  }

  const handleApprove = () => {
    approveMutation.mutate(auction.id);
  };

  const isProcessing = approveMutation.isPending;

  const getStatusConfig = () => {
    // Check if approved auction has expired
    if (auction.status === "approved" && isAuctionExpired(auction.endsAt)) {
      return {
        bgClass: "bg-info/15",
        textClass: "text-info",
        label: "Completed"
      };
    }

    switch (auction.status) {
      case "pending":
        return {
          bgClass: "bg-warning/15",
          textClass: "text-warning",
          label: "Awaiting Review"
        };
      case "approved":
        return {
          bgClass: "bg-success/15",
          textClass: "text-success",
          label: "Active"
        };
      case "rejected":
        return {
          bgClass: "bg-error/15",
          textClass: "text-error",
          label: "Declined"
        };
      default:
        return {
          bgClass: "bg-surface-hover",
          textClass: "text-text-secondary",
          label: auction.status
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <>
      <div className="group bg-surface border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/30">
        <div className="flex gap-4 p-4">
          {/* Compact Image - Left Side */}
          <Link to={`/auctions/${auction.id}`} className="relative w-28 h-28 shrink-0 bg-surface-hover rounded-lg overflow-hidden">
            <img
              src={getThumbnailUrl((auction.imageUrls?.[0] || (auction as any).imageUrl) || "", 300, 300)}
              alt={auction.title}
              className="w-full h-full object-cover"
            />
            {/* Status Indicator - Small Corner Badge */}
            <div className={`absolute top-2 left-2 w-2.5 h-2.5 rounded-full ${statusConfig.bgClass} border-2 border-surface shadow-sm`} />
          </Link>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header Row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <Link to={`/auctions/${auction.id}`} className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-text-primary line-clamp-1 hover:text-primary transition-colors">
                    {auction.title}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${statusConfig.bgClass} ${statusConfig.textClass} flex-shrink-0`}>
                    {statusConfig.label}
                  </span>
                </div>
                <p className="text-xs text-text-secondary line-clamp-1">
                  {auction.description}
                </p>
              </Link>
              <button
                onClick={() => setShowDeleteDialog(true)}
                disabled={isProcessing}
                className="p-1.5 hover:bg-error/10 text-text-secondary hover:text-error rounded-lg transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                title="Delete auction"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-4 mb-3 text-xs">
              <div>
                <span className="text-text-secondary">Current:</span>
                <span className="ml-1.5 font-bold text-primary text-base">${auction.currentBid.toLocaleString()}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div>
                <span className="text-text-secondary">Bids:</span>
                <span className="ml-1.5 font-semibold text-text-primary">{auction.bidsCount}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div>
                <span className="text-text-secondary capitalize">{auction.category}</span>
              </div>
              {auction.status === "approved" && (
                <>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center gap-1.5 text-success">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{getTimeRemaining(new Date(auction.endsAt))}</span>
                  </div>
                </>
              )}
            </div>

            {/* Error Messages */}
            {approveMutation.isError && (
              <div className="mb-3 py-1.5 px-2.5 bg-error/10 border border-error/25 rounded-lg">
                <p className="text-xs text-error">
                  {approveMutation.error?.message || "Failed to approve auction"}
                </p>
              </div>
            )}

            {/* Action Buttons Row */}
            <div className="flex gap-2 mt-auto">
              {auction.status === "pending" && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 bg-success hover:bg-success/90 text-white text-sm font-medium rounded-lg transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {approveMutation.isPending ? "Approving..." : "Approve"}
                  </button>
                  <button
                    onClick={() => setShowRejectDialog(true)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-surface-hover hover:bg-border/30 border border-border text-text-primary text-sm font-medium rounded-lg transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Decline
                  </button>
                </>
              )}

              {auction.status === "approved" && !isAuctionExpired(auction.endsAt) && (
                <>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center gap-1.5 text-success">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{getTimeRemaining(new Date(auction.endsAt))}</span>
                  </div>
                </>
              )}

              {auction.status === "rejected" && (
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-success hover:bg-success/90 text-white text-sm font-medium rounded-lg transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {approveMutation.isPending ? "Approving..." : "Approve"}
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