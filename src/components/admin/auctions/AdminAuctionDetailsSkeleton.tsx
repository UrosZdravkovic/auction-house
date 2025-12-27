export const AdminAuctionDetailsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-6 p-8 animate-pulse">
      {/* Left column - Image and Related Auctions */}
      <div className="space-y-6">
        {/* Image Slider Skeleton */}
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="aspect-square bg-surface-hover" />
        </div>

        {/* Related Auctions Skeleton */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <div className="h-6 bg-surface-hover rounded w-48 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 p-3 bg-surface-hover/50 rounded-lg">
                <div className="w-16 h-16 bg-surface-hover rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-hover rounded w-3/4" />
                  <div className="h-3 bg-surface-hover rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column - Details and Bids */}
      <div className="space-y-4">
        {/* Title and Description Skeleton */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <div className="h-6 bg-surface-hover rounded w-3/4 mb-3" />
          <div className="space-y-2">
            <div className="h-4 bg-surface-hover rounded w-full" />
            <div className="h-4 bg-surface-hover rounded w-full" />
            <div className="h-4 bg-surface-hover rounded w-2/3" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface rounded-xl border border-border p-4">
            <div className="h-3 bg-surface-hover rounded w-20 mb-2" />
            <div className="h-8 bg-surface-hover rounded w-24" />
          </div>
          <div className="bg-surface rounded-xl border border-border p-4">
            <div className="h-3 bg-surface-hover rounded w-16 mb-2" />
            <div className="h-8 bg-surface-hover rounded w-12" />
          </div>
        </div>

        {/* Bid History Skeleton */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <div className="h-5 bg-surface-hover rounded w-32 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-surface-hover/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-surface-hover rounded-full" />
                  <div className="space-y-1">
                    <div className="h-4 bg-surface-hover rounded w-24" />
                    <div className="h-3 bg-surface-hover rounded w-16" />
                  </div>
                </div>
                <div className="h-5 bg-surface-hover rounded w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
