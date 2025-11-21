import { AdminAuctionCard } from "../../components/admin/AdminAuctionCard";
import { useAllAuctions } from "../../hooks/useAdminActions"


export const AdminAuctionsPage = () => {

  const { data: auctions, isLoading, isError } = useAllAuctions();



  return (
    <>
      {isLoading && <div>Loading all auctions...</div>}
      {isError && <div>Error loading auctions.</div>}
      {!isLoading && !isError && (
        <div>
          {auctions?.map(auction => (
            <AdminAuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </>
  )
}