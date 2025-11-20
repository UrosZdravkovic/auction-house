import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAuctions, fetchAuctionById, createAuction, updateAuctionBid, fetchAllAuctions } from "../services/auctionService";
import type { Auction } from "../types";

/**
 * Hook to fetch all approved auctions (public view)
 */
export const useAuctions = () => {
  return useQuery({
    queryKey: ['auctions', 'approved'],
    queryFn: fetchAuctions,
  });
};

/**
 * Hook to fetch a single auction by ID
 */
export const useAuction = (auctionId: string) => {
  return useQuery<Auction | null>({
    queryKey: ['auction', auctionId],
    queryFn: () => fetchAuctionById(auctionId),
    enabled: !!auctionId, // Only run query if auctionId is provided
  });
};

/**
 * Hook to create a new auction
 */
export const useCreateAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAuction,
    onSuccess: () => {
      // Invalidate and refetch auctions list
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
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
 * Hook to update auction bid info (used internally when bid is placed)
 */
export const useUpdateAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ auctionId, currentBid, bidsCount }: { auctionId: string; currentBid: number; bidsCount: number }) => 
      updateAuctionBid(auctionId, currentBid, bidsCount),
    onSuccess: (_, variables) => {
      // Invalidate specific auction and auctions list
      queryClient.invalidateQueries({ queryKey: ['auction', variables.auctionId] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });
};
