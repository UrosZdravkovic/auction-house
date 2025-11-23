import { useState } from "react";
import { useRejectAuction } from "../../hooks/useAdminActions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface RejectAuctionDialogProps {
  auctionId: string;
  auctionTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RejectAuctionDialog = ({
  auctionId,
  auctionTitle,
  open,
  onOpenChange,
}: RejectAuctionDialogProps) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const rejectMutation = useRejectAuction();

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      return;
    }
    rejectMutation.mutate(
      { auctionId, reason: rejectionReason },
      {
        onSuccess: () => {
          onOpenChange(false);
          setRejectionReason("");
        },
      }
    );
  };

  const handleCancel = () => {
    onOpenChange(false);
    setRejectionReason("");
    rejectMutation.reset();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Auction</AlertDialogTitle>
          <AlertDialogDescription>
            Please provide a reason for rejecting "{auctionTitle}"
          </AlertDialogDescription>
        </AlertDialogHeader>

        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Enter rejection reason..."
          rows={4}
          className="w-full px-4 py-2 bg-background border border-border rounded-md text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
          disabled={rejectMutation.isPending}
        />

        {rejectMutation.isError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3">
            <p className="text-sm text-red-600">
              {rejectMutation.error?.message || "Failed to reject auction"}
            </p>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={rejectMutation.isPending}
            onClick={handleCancel}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReject}
            disabled={rejectMutation.isPending || !rejectionReason.trim()}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {rejectMutation.isPending ? "Rejecting..." : "Reject Auction"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
