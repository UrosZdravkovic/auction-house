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

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Bid History</h3>

            <div className="space-y-2 max-h-96 overflow-y-auto">
                {displayedBids.map((bid: Bid) => (
                    <div
                        key={bid.id}
                        className="flex items-center justify-between p-3 bg-surface-hover rounded-lg border border-border"
                    >
                        <div className="flex-1">
                            <p className="text-sm font-medium text-text-primary">
                                ${bid.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-text-secondary">
                                {formatDate(bid.createdAt)}
                            </p>
                        </div>
                    </div>
                ))}
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