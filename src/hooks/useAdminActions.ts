import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPendingAuctions, approveAuction, rejectAuction } from "../services/auctionService";
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
      // Invalidate pending auctions (remove from pending list)
      queryClient.invalidateQueries({ queryKey: ['auctions', 'pending'] });
      // Invalidate approved auctions (add to public list)
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
      // Invalidate pending auctions (remove from pending list)
      queryClient.invalidateQueries({ queryKey: ['auctions', 'pending'] });
      // Note: Rejected auctions don't appear in public list
    },
  });
};
