import { AdminAuctionCard } from "../../components/admin/AdminAuctionCard";
import { useAllAuctions } from "../../hooks/useAdminActions";
import { AdminAuctionCardSkeleton } from "../../components/admin/AdminAuctionCardSkeleton";


export const AdminAuctionsPage = () => {

  const { data: auctions, isLoading, isError } = useAllAuctions();

  

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
          {Array.from({ length: 4 }).map((_, index) => (
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-1">
          {auctions?.map(auction => (
            <AdminAuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  )
}