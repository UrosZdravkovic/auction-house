import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPendingAuctions, approveAuction, rejectAuction, fetchAllAuctions } from "../services/auctionService";
import { useAuth } from "./useAuth";
import type { Auction } from "../types";

/**
 * Hook to fetch all pending auctions (Admin only)
 */
export const usePendingAuctions = () => {
  const { isAdmin } = useAuth();

  return useQuery<Auction[]>({
    queryKey: ['auctions', 'pending'],
    queryFn: fetchPendingAuctions,
    enabled: isAdmin, // Only fetch if user is admin
  });
};

/**
 * Hook to fetch ALL auctions (admin view)
 */
export const useAllAuctions = () => {
  return useQuery({
    queryKey: ['auctions', 'all'],
    queryFn: fetchAllAuctions,
  });
};

/**
 * Hook to approve an auction (Admin only)
 */
export const useApproveAuction = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (auctionId: string) => {
      if (!user) throw new Error("User must be logged in");
      return approveAuction(auctionId, user.uid);
    },
    onSuccess: () => {
      // Invalidate all auction queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });
};

/**
 * Hook to reject an auction (Admin only)
 */
export const useRejectAuction = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ auctionId, reason }: { auctionId: string; reason?: string }) => {
      if (!user) throw new Error("User must be logged in");
      return rejectAuction(auctionId, user.uid, reason);
    },
    onSuccess: () => {
      // Invalidate all auction queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });
};
