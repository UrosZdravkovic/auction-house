export const UserAuctionCardSkeleton = () => {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden h-64 animate-pulse">
      <div className="flex flex-col md:flex-row h-full">
        <div className="md:w-2/5 h-48 md:h-full bg-surface-hover" />
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-6 bg-surface-hover rounded w-3/4" />
            <div className="h-4 bg-surface-hover rounded w-1/4" />
            <div className="space-y-2 mt-4">
              <div className="h-3 bg-surface-hover rounded" />
              <div className="h-3 bg-surface-hover rounded w-5/6" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-4 bg-surface-hover rounded w-1/3" />
              <div className="h-4 bg-surface-hover rounded w-1/4" />
            </div>
            <div className="h-10 bg-surface-hover rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};
