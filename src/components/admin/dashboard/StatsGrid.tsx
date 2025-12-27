import { StatCard } from "./StatCard";
import type { DashboardStats } from "../../../hooks/useDashboardStats";

interface StatsGridProps {
  stats: DashboardStats;
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        title="Total Auctions"
        value={stats.totalAuctions}
        variant="default"
      />
      <StatCard
        title="Pending Approval"
        value={stats.pendingAuctions}
        variant="warning"
      />
      <StatCard
        title="Active Users"
        value={stats.activeUsers}
        variant="default"
      />
      <StatCard
        title="Total Bids"
        value={stats.totalBids}
        variant="success"
      />
    </div>
  );
};
