import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBidsByAuction, createBid, countBidsByAuction } from "../services/bidService";
import { useUpdateAuction } from "./useAuctions";
import type { Bid } from "../types";

/**
 * Hook to fetch all bids for a specific auction
 */
export const useBids = (auctionId: string) => {
  return useQuery<Bid[]>({
    queryKey: ['bids', auctionId],
    queryFn: () => fetchBidsByAuction(auctionId),
    enabled: !!auctionId,
  });
};

/**
 * Hook to place a new bid on an auction
 */
export const usePlaceBid = () => {
  const queryClient = useQueryClient();
  const updateAuction = useUpdateAuction();

  return useMutation({
    mutationFn: createBid,
    onSuccess: async (_, variables) => {
      // Count total bids for this auction
      const bidsCount = await countBidsByAuction(variables.auctionId);

      // Update auction with new bid info
      await updateAuction.mutateAsync({
        auctionId: variables.auctionId,
        currentBid: variables.amount,
        bidsCount,
      });

      // Invalidate bids query for this auction
      queryClient.invalidateQueries({ queryKey: ['bids', variables.auctionId] });
    },
  });
};
