import { useParams } from "react-router-dom";
import { useAuction } from "@/hooks/useAuctions";
import { UserAuctionDetails } from "@/components/user/auctions/UserAuctionDetails";

export const AuctionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: auction, isLoading, error } = useAuction(id!);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-hover rounded w-1/3 mb-4" />
          <div className="h-4 bg-surface-hover rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-error">Error: {error.message}</p>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-text-secondary">Auction not found</p>
      </div>
    );
  }

  return <UserAuctionDetails auction={auction} auctionId={id!} />;
};
