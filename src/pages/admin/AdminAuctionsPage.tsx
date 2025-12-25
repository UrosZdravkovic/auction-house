// pages/admin/AdminAuctionsPage.tsx
import { useState } from "react";
import { AdminAuctionCard } from "../../components/admin/AdminAuctionCard";
import { useAllAuctions } from "../../hooks/useAdminActions";
import { AdminAuctionCardSkeleton } from "../../components/admin/AdminAuctionCardSkeleton";
import { PaginationControl } from "@/components/ui/PaginationControl";
import { ITEMS_PER_PAGE } from "../../constants/auctionConstants";

export const AdminAuctionsPage = () => {
  const { data: auctions, isLoading, isError } = useAllAuctions();
  const [currentPage, setCurrentPage] = useState(1);
  const [displayPage, setDisplayPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalItems = auctions?.length ?? 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedAuctions = auctions?.slice(
    (displayPage - 1) * ITEMS_PER_PAGE,
    displayPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page === currentPage || isTransitioning) return;
    if (page < 1 || page > totalPages) return;

    setIsTransitioning(true);
    setCurrentPage(page);

    setTimeout(() => {
      setDisplayPage(page);
      setIsTransitioning(false);
    }, 150);
  };

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
          <div className="mb-4 text-sm text-text-secondary">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} auctions
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

          <div className="mt-4">
            <PaginationControl
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              isDisabled={isTransitioning}
            />
          </div>
        </>
      )}
    </div>
  );
};