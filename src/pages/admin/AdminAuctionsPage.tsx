// pages/admin/AdminAuctionsPage.tsx
import { AdminAuctionCard } from "../../components/admin/auctions/AdminAuctionCard";
import { useAllAuctions } from "../../hooks/useAdminActions";
import { AdminAuctionCardSkeleton } from "../../components/admin/auctions/AdminAuctionCardSkeleton";
import { PaginationControl } from "@/components/ui/PaginationControl";
import { usePagination } from "../../hooks/usePagination";
import { ITEMS_PER_PAGE } from "../../constants/auctionConstants";

export const AdminAuctionsPage = () => {
  const { data: auctions, isLoading, isError } = useAllAuctions();
  
  const {
    currentPage,
    totalPages,
    totalItems,
    paginatedItems: paginatedAuctions,
    isTransitioning,
    goToPage,
  } = usePagination(auctions, { itemsPerPage: ITEMS_PER_PAGE });

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Manage Auctions
        </h1>
        <p className="text-text-secondary">
          Review and manage all auctions in the system
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-1">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <AdminAuctionCardSkeleton key={index} />
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-md p-4 text-center">
          <p className="text-red-600">Error loading auctions.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="mb-4 flex items-center gap-3">
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
              <AdminAuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};