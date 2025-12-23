import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    e.stopPropagation(); // Prevent card navigation
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
        <div className="flex gap-4 p-4">
          {/* Image */}
          <div className="relative w-48 h-48 shrink-0 bg-surface-hover rounded-lg overflow-hidden">
            <img
              src={getThumbnailUrl(auction.imageUrls?.[0] || "", 480, 480)}
              alt={auction.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className={`absolute top-2 left-2 w-2.5 h-2.5 rounded-full ${statusConfig.bgClass} border-2 border-surface shadow-sm`} />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
                    {auction.title}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${statusConfig.bgClass} ${statusConfig.textClass} shrink-0`}>
                    {statusConfig.label}
                  </span>
                </div>
                <p className="text-xs text-text-secondary line-clamp-1">
                  {auction.description}
                </p>
              </div>

              <button
                onClick={handleDelete}
                disabled={isProcessing}
                className="p-1.5 hover:bg-error/10 text-text-secondary hover:text-error rounded-lg transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                title="Delete auction"
              >
                <TrashIcon />
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-3 text-xs">
              <Stat label="Current" value={`$${auction.currentBid.toLocaleString()}`} highlight />
              <Divider />
              <Stat label="Bids" value={auction.bidsCount} />
              <Divider />
              <span className="text-text-secondary capitalize">{auction.category}</span>
              {auction.status === "approved" && !isExpired && (
                <>
                  <Divider />
                  <TimeRemaining endsAt={auction.endsAt} />
                </>
              )}
            </div>

            {/* Error */}
            {approveMutation.isError && (
              <div className="mb-3 py-1.5 px-2.5 bg-error/10 border border-error/25 rounded-lg">
                <p className="text-xs text-error">
                  {approveMutation.error?.message || "Failed to approve auction"}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
              {auction.status === "pending" && (
                <>
                  <ActionButton onClick={handleApprove} disabled={isProcessing} variant="success">
                    {approveMutation.isPending ? "Approving..." : "Approve"}
                  </ActionButton>
                  <ActionButton onClick={handleReject} disabled={isProcessing} variant="secondary">
                    Decline
                  </ActionButton>
                </>
              )}

              {auction.status === "rejected" && (
                <ActionButton onClick={handleApprove} disabled={isProcessing} variant="success">
                  {approveMutation.isPending ? "Approving..." : "Approve"}
                </ActionButton>
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

// Helper components
const Divider = () => <div className="w-px h-4 bg-border" />;

const Stat = ({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) => (
  <div>
    <span className="text-text-secondary">{label}:</span>
    <span className={`ml-1.5 font-semibold ${highlight ? "text-primary text-base font-bold" : "text-text-primary"}`}>
      {value}
    </span>
  </div>
);

const TimeRemaining = ({ endsAt }: { endsAt: Date }) => (
  <div className="flex items-center gap-1.5 text-success">
    <ClockIcon />
    <span className="font-medium">{getTimeRemaining(new Date(endsAt))}</span>
  </div>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface ActionButtonProps {
  onClick: (e: React.MouseEvent) => void;
  disabled: boolean;
  variant: "success" | "secondary";
  children: React.ReactNode;
}

const ActionButton = ({ onClick, disabled, variant, children }: ActionButtonProps) => {
  const styles = {
    success: "bg-success hover:bg-success/90 text-white",
    secondary: "bg-surface-hover hover:bg-border/30 border border-border text-text-primary",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

// Extract status logic
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