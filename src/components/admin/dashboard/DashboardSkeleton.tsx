export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 bg-surface rounded-lg border border-border animate-pulse">
            <div className="h-4 bg-surface-hover rounded w-24 mb-2"></div>
            <div className="h-8 bg-surface-hover rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
};