import { useParams } from "react-router-dom";
import { useAuction } from "@/hooks/useAuctions";
import ImageSlider from "@/components/ui/ImageSlider";
import { BidHistory } from '../../components/auction/BidsHistory';
import SameCategoryAuctions from "@/components/admin/auctions/SameCategoryAuctions";

export const AdminAuctionDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: auction, isLoading, error } = useAuction(id!);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-text-secondary">Loading auction...</p>
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

    return (
        <div className="grid grid-cols-2 gap-6 p-8">
            {/* Left column - Image and Related Auctions */}
            <div className="space-y-6">
                <div className="bg-surface rounded-xl border border-border overflow-hidden">
                    <ImageSlider images={auction.imageUrls} />
                </div>

                <div className="bg-surface">
                    <SameCategoryAuctions categoryId={auction.category} currentAuctionId={auction.id} />
                </div>
            </div>

            {/* Right column - Details and Bids */}
            <div className="space-y-4">
                <div className="bg-surface rounded-xl border border-border p-6">
                    <h1 className="text-xl font-bold text-text-primary">{auction.title}</h1>
                    <p className="text-text-secondary mt-2">{auction.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface rounded-xl border border-border p-4">
                        <p className="text-xs text-text-secondary uppercase tracking-wide">Current Bid</p>
                        <p className="text-2xl font-bold text-primary mt-1">
                            ${auction.currentBid.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-surface rounded-xl border border-border p-4">
                        <p className="text-xs text-text-secondary uppercase tracking-wide">Total Bids</p>
                        <p className="text-2xl font-bold text-text-primary mt-1">
                            {auction.bidsCount}
                        </p>
                    </div>
                </div>

                <div className="bg-surface rounded-xl border border-border p-6">
                    <BidHistory auctionId={id!} />
                </div>
            </div>
        </div>
    );
};