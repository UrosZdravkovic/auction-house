import { useMemo } from "react";
import { useActiveAuctions } from "../../hooks/useAuctions";
import { useAuth } from "../../hooks/useAuth";
import { UserAuctionCard } from "../../components/user/UserAuctionCard";
import { UserAuctionCardSkeleton } from "../../components/user/UserAuctionCardSkeleton";
import { PaginationControl } from "@/components/ui/PaginationControl";
import { usePagination } from "../../hooks/usePagination";
import { ITEMS_PER_PAGE } from "../../constants/auctionConstants";

export default function AuctionsPage() {
  const { data: auctions = [], isLoading, error } = useActiveAuctions();
  const { user } = useAuth();

  // Filter out user's own auctions
  const filteredAuctions = useMemo(() => {
    if (!user) return auctions;
    return auctions.filter(auction => auction.ownerId !== user.uid);
  }, [auctions, user]);

  const {
    currentPage,
    totalPages,
    totalItems,
    paginatedItems: paginatedAuctions,
    isTransitioning,
    goToPage,
  } = usePagination(filteredAuctions, { itemsPerPage: ITEMS_PER_PAGE });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Active Auctions</h1>
        <p className="text-text-secondary">
          Browse and bid on available auctions
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-1">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <UserAuctionCardSkeleton key={index} />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded mb-6">
          {error instanceof Error ? error.message : "Failed to load auctions. Please try again later."}
        </div>
      )}

      {!isLoading && !error && filteredAuctions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-secondary">No auctions available.</p>
        </div>
      )}

      {!isLoading && !error && filteredAuctions.length > 0 && (
        <>
          <div className="mb-4 flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
            <p className="text-sm text-text-secondary whitespace-nowrap">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} auctions
            </p>
            <PaginationControl
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              isDisabled={isTransitioning}
            />
          </div>

          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-6 p-1 transition-opacity duration-150 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            {paginatedAuctions?.map((auction) => (
              <UserAuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
