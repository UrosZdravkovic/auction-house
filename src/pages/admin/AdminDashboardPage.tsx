import { useDashboardStats } from "../../hooks/useDashboardStats";
import { DashboardSkeleton } from "../../components/admin/dashboard/DashboardSkeleton";
import { StatsGrid } from "../../components/admin/dashboard/StatsGrid";
import { RecentActivity } from "../../components/admin/dashboard/RecentActivity";

export const AdminDashboardPage = () => {
  const { stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
      <StatsGrid stats={stats} />
      <RecentActivity />
    </div>
  );
};
