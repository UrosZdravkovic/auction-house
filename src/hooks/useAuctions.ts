import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAuctions, fetchActiveAuctions, fetchSameCategoryAuctions, fetchAuctionById, createAuction, updateAuctionBid, fetchUsersAuction, deleteAuction } from "../services/auctionService";
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

export const useActiveAuctions = () => {
  return useQuery({
    queryKey: ['auctions', 'active'],
    queryFn: fetchActiveAuctions,
  });
} 

export const useSameCategoryAuctions = (category: string, excludeAuctionId: string) => {
  return useQuery({
    queryKey: ['auctions', 'category', category, excludeAuctionId],
    queryFn: () => fetchSameCategoryAuctions(category, excludeAuctionId),
    enabled: !!category && !!excludeAuctionId,
  });
}

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

export const useUsersAuctions = (userId: string) => {
  return useQuery({
    queryKey: ['auctions', 'user', userId],
    queryFn: () => fetchUsersAuction(userId),
    enabled: !!userId,
  });
}



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

/**
 * Hook to delete an auction (Admin only)
 */
export const useDeleteAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (auctionId: string) => deleteAuction(auctionId),
    onSuccess: () => {
      // Invalidate and refetch all auctions lists
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });
};
