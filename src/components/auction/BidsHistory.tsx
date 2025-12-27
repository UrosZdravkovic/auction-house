import { useState } from 'react';
import { useBids } from '@/hooks/useBids';
import { Timestamp } from 'firebase/firestore';
import type { Bid } from '@/types';


type BidHistoryProps = {
    auctionId: string;
};

export const BidHistory = ({ auctionId }: BidHistoryProps) => {


    const { data: allBids = [], isLoading, isError, error } = useBids(auctionId);
    const [showAll, setShowAll] = useState(false);

    const displayedBids = showAll ? allBids : allBids.slice(0, 5);
    const hasMore = allBids.length > 5;

    if (isLoading) return <p className="text-text-secondary">Loading bids...</p>;

    if (isError) {
        console.error('Error loading bids:', error);
        return <p className="text-error">Error loading bid history: {error?.message}</p>;
    }

    if (allBids.length === 0) return <p className="text-text-secondary">No bids yet</p>;

    const formatDate = (createdAt: any) => {
        if (createdAt instanceof Timestamp) {
            return createdAt.toDate().toLocaleString();
        }
        if (createdAt instanceof Date) {
            return createdAt.toLocaleString();
        }
        return new Date(createdAt).toLocaleString();
    };

    const highestBid = allBids.length > 0 ? allBids[0] : null;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Bid History</h3>

            <div className="space-y-2 max-h-96 overflow-y-auto">
                {displayedBids.map((bid: Bid) => {
                    const isCurrentBid = highestBid && bid.id === highestBid.id;

                    return (
                        <div
                            key={bid.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                isCurrentBid
                                    ? 'bg-success/10 border-success/30 ring-2 ring-success/20'
                                    : 'bg-surface-hover border-border'
                            }`}
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className={`text-sm font-medium ${
                                        isCurrentBid ? 'text-success font-bold' : 'text-text-primary'
                                    }`}>
                                        ${bid.amount.toLocaleString()}
                                    </p>
                                    {isCurrentBid && (
                                        <span className="px-2 py-0.5 text-xs font-semibold text-success bg-success/20 rounded-md">
                                            Current Bid
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-text-secondary mt-0.5">
                                    {formatDate(bid.createdAt)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {hasMore && !showAll && (
                <button
                    onClick={() => setShowAll(true)}
                    className="w-full px-4 py-2 bg-surface-hover hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-all duration-250"
                >
                    Show More ({allBids.length - 5} more bids)
                </button>
            )}

            {showAll && hasMore && (
                <button
                    onClick={() => setShowAll(false)}
                    className="w-full px-4 py-2 bg-surface-hover hover:bg-border/30 border border-border text-text-primary text-sm font-medium rounded-lg transition-all duration-250"
                >
                    Show Less
                </button>
            )}
        </div>
    );
};