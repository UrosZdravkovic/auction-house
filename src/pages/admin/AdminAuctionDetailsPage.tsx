import { useParams } from "react-router-dom";
import { useAuction, useSameCategoryAuctions } from "@/hooks/useAuctions";
import ImageSlider from "@/components/ui/ImageSlider";
import { BidHistory } from '../../components/auction/BidsHistory';

export const AdminAuctionDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: auction, isLoading, error } = useAuction(id!);
    const { data: similarAuctions } = useSameCategoryAuctions(auction?.category || '', auction?.id || '');

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
            <div className="bg-surface rounded-xl border border-border overflow-hidden self-start">
                <ImageSlider images={auction.imageUrls} />
            </div>

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


                {/* Similar Auctions Section */}
                <div className="bg-surface rounded-xl border border-border p-6">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Similar Auctions</h2>
                    {similarAuctions && similarAuctions.length > 0 ? (
                        <ul className="space-y-3">
                            {similarAuctions.map(similar => (
                                <li key={similar.id} className="border-b border-border pb-2">
                                    <h3 className="text-sm font-medium text-text-primary">{similar.title}</h3>
                                    <p className="text-xs text-text-secondary">Current Bid: ${similar.currentBid.toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-text-secondary">No similar auctions found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};