import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteAuction } from "../../../hooks/useAuctions";

interface DeleteAuctionDialogProps {
  auctionId: string;
  auctionTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteAuctionDialog = ({
  auctionId,
  auctionTitle,
  open,
  onOpenChange,
}: DeleteAuctionDialogProps) => {
  const deleteMutation = useDeleteAuction();

  const handleDelete = () => {
    deleteMutation.mutate(auctionId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Auction?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete <strong>"{auctionTitle}"</strong>?
            This action cannot be undone and will remove all auction data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
