export const UserAuctionCardSkeleton = () => {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
        {/* Image Skeleton */}
        <div className="w-full h-32 xs:h-36 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 shrink-0 bg-surface-hover rounded-lg" />

        {/* Content Skeleton */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="mb-2 sm:mb-3">
            <div className="h-5 bg-surface-hover rounded w-3/4 mb-2" />
            <div className="h-3 bg-surface-hover rounded w-full" />
            <div className="h-3 bg-surface-hover rounded w-2/3 mt-1 hidden sm:block" />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
            <div className="h-6 bg-surface-hover rounded w-24" />
            <div className="hidden xs:block w-px h-4 bg-border" />
            <div className="h-4 bg-surface-hover rounded w-16" />
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="hidden sm:block h-4 bg-surface-hover rounded w-20" />
          </div>

          {/* Button */}
          <div className="mt-auto">
            <div className="h-10 bg-surface-hover rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
