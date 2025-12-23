import { useParams } from "react-router-dom";
import { useAuction } from "@/hooks/useAuctions";
import ImageSlider from "@/components/ui/ImageSlider";
import { BidHistory } from '../../components/auction/BidsHistory';

export const AdminAuctionDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: auction, isLoading, error } = useAuction(id!);

    return (
        <div className="min-h-screen bg-background p-8">
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-error">Error: {error.message}</p>}
            {auction && (
                <>
                    <div className="flex gap-8 mb-6">
                        <div className="w-1/2">
                            <ImageSlider images={auction.imageUrls} />
                        </div>

                        <div className="flex-1 space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary mb-4">{auction.title}</h1>
                                <p className="text-text-secondary">{auction.description}</p>
                            </div>

                            <div className="bg-surface rounded-lg p-4 border border-border">
                                <div className="mb-2">
                                    <p className="text-sm text-text-secondary">Current Bid</p>
                                    <p className="text-2xl font-bold text-primary">
                                        ${auction.currentBid.toLocaleString()}
                                    </p>
                                </div>
                                <p className="text-xs text-text-secondary">
                                    Total Bids: {auction.bidsCount}
                                </p>
                            </div>

                            <BidHistory />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}