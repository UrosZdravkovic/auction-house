import { useQuery } from "@tanstack/react-query";
import { countAllBids } from "../services/bidService";
import { countAllUsers } from "../services/userService";
import { useAllAuctions } from "./useAdminActions";

export interface DashboardStats {
  totalAuctions: number;
  pendingAuctions: number;
  activeUsers: number;
  totalBids: number;
}

/**
 * Hook to fetch all dashboard statistics for admin
 */
export const useDashboardStats = () => {
  const { data: auctions = [] } = useAllAuctions();

  const { data: totalBids = 0, isLoading: bidsLoading } = useQuery({
    queryKey: ['stats', 'bids'],
    queryFn: countAllBids,
  });

  const { data: activeUsers = 0, isLoading: usersLoading } = useQuery({
    queryKey: ['stats', 'users'],
    queryFn: countAllUsers,
  });

  const stats: DashboardStats = {
    totalAuctions: auctions.length,
    pendingAuctions: auctions.filter(a => a.status === 'pending').length,
    activeUsers,
    totalBids,
  };

  return {
    stats,
    isLoading: bidsLoading || usersLoading,
  };
};