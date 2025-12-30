import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiClock } from "react-icons/fi";
import { useApproveAuction } from "../../../hooks/useAdminActions";
import { RejectAuctionDialog } from "./RejectAuctionDialog";
import { DeleteAuctionDialog } from "./DeleteAuctionDialog";
import { getThumbnailUrl } from "../../../services/storageService"
import { getTimeRemaining } from "../../../utils/timeUtils";
import type { Auction } from "../../../types";

type AdminAuctionCardProps = {
  auction: Auction;
}

export const AdminAuctionCard = ({ auction }: AdminAuctionCardProps) => {
  const navigate = useNavigate();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const approveMutation = useApproveAuction();
  const isProcessing = approveMutation.isPending;
  const isExpired = new Date() > new Date(auction.endsAt);

  const handleCardClick = () => {
    navigate(`/auctions/${auction.id}`);
  };

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    approveMutation.mutate(auction.id);
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRejectDialog(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const statusConfig = getStatusConfig(auction.status, isExpired);

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
            <div className={`absolute top-2 left-2 w-2.5 h-2.5 rounded-full ${statusConfig.bgClass} border-2 border-surface shadow-sm`} />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <h3 className="text-sm sm:text-base font-semibold text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
                    {auction.title}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${statusConfig.bgClass} ${statusConfig.textClass} shrink-0`}>
                    {statusConfig.label}
                  </span>
                </div>
                <p className="text-xs text-text-secondary line-clamp-1 sm:line-clamp-2">
                  {auction.description}
                </p>
              </div>

              <button
                onClick={handleDelete}
                disabled={isProcessing}
                className="p-1.5 hover:bg-error/10 text-text-secondary hover:text-error rounded-lg transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                title="Delete auction"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
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
              {auction.status === "approved" && !isExpired && (
                <>
                  <div className="hidden md:block w-px h-4 bg-border" />
                  <div className="hidden md:flex items-center gap-1.5 text-success">
                    <FiClock className="w-3.5 h-3.5" />
                    <span className="font-medium">{getTimeRemaining(new Date(auction.endsAt))}</span>
                  </div>
                </>
              )}
            </div>

            {/* Error */}
            {approveMutation.isError && (
              <div className="mb-2 sm:mb-3 py-1.5 px-2.5 bg-error/10 border border-error/25 rounded-lg">
                <p className="text-xs text-error">
                  {approveMutation.error?.message || "Failed to approve auction"}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col xs:flex-row gap-2 mt-auto">
              {(auction.status === "pending" || auction.status === "rejected") && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="flex-1 px-3 sm:px-4 py-2 bg-success hover:bg-success/90 text-white text-sm font-medium rounded-lg transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {approveMutation.isPending ? "Approving..." : "Approve"}
                  </button>
                  {auction.status === "pending" && (
                    <button
                      onClick={handleReject}
                      disabled={isProcessing}
                      className="px-3 sm:px-4 py-2 bg-surface-hover hover:bg-border/30 border border-border text-text-primary text-sm font-medium rounded-lg transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Decline
                    </button>
                  )}
                </>
              )}

              {auction.status === "approved" && (
                <button
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="flex-1 px-3 sm:px-4 py-2 bg-error/10 hover:bg-error/20 border border-error/30 text-error text-sm font-medium rounded-lg transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Revert to Declined
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

const getStatusConfig = (status: string, isExpired: boolean) => {
  if (status === "approved" && isExpired) {
    return { bgClass: "bg-info/15", textClass: "text-info", label: "Completed" };
  }

  const configs: Record<string, { bgClass: string; textClass: string; label: string }> = {
    pending: { bgClass: "bg-warning/15", textClass: "text-warning", label: "Awaiting Review" },
    approved: { bgClass: "bg-success/15", textClass: "text-success", label: "Active" },
    rejected: { bgClass: "bg-error/15", textClass: "text-error", label: "Declined" },
  };

  return configs[status] || { bgClass: "bg-surface-hover", textClass: "text-text-secondary", label: status };
};