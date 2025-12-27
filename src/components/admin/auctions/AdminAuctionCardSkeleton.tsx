export const AdminAuctionCardSkeleton = () => {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="flex gap-4 p-4">
        <div className="w-28 h-28 shrink-0 bg-surface-hover rounded-lg" />
        <div className="flex-1 flex flex-col min-w-0 space-y-3">
          <div className="space-y-2">
            <div className="h-5 bg-surface-hover rounded w-3/4" />
            <div className="h-3 bg-surface-hover rounded w-full" />
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="h-4 bg-surface-hover rounded w-20" />
            <div className="h-4 bg-surface-hover rounded w-16" />
            <div className="h-4 bg-surface-hover rounded w-24" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 bg-surface-hover rounded flex-1" />
            <div className="h-8 bg-surface-hover rounded flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
