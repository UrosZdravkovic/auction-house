import { useParams } from "react-router-dom";
import { useAuction } from "@/hooks/useAuctions";
import { AdminAuctionDetails } from "@/components/admin/auctions/AdminAuctionDetails";
import { AdminAuctionDetailsSkeleton } from "@/components/admin/auctions/AdminAuctionDetailsSkeleton";

export const AdminAuctionDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: auction, isLoading, error } = useAuction(id!);

    if (isLoading) {
        return <AdminAuctionDetailsSkeleton />;
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

    return <AdminAuctionDetails auction={auction} auctionId={id!} />;
};