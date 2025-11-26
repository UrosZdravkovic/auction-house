import { useAuth } from "../../hooks/useAuth";
import { useUsersAuctions } from "../../hooks/useAuctions";
import { getThumbnailUrl } from "../../services/storageService";
import { getTimeRemaining } from "../../utils/timeUtils";

export default function MyAuctionsPage() {
  const { user } = useAuth();
  const { data: auctions = [], isLoading, error } = useUsersAuctions(user?.uid || "");

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      approved: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded border ${styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800 border-gray-300"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const isAuctionActive = (endDate: Date, status: string) => {
    return status === "approved" && new Date(endDate) > new Date();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Auctions</h1>
      
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-text-secondary">Loading your auctions...</p>
        </div>
      )}

      {error && (
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded mb-6">
          {error instanceof Error ? error.message : "Failed to load your auctions. Please try again later."}
        </div>
      )}

      {!isLoading && !error && auctions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-secondary">You haven't created any auctions yet.</p>
        </div>
      )}

      {!isLoading && !error && auctions.length > 0 && (
        <div className="space-y-6">
          <p className="text-text-secondary mb-4">You have {auctions.length} auction(s)</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-1">
            {auctions.map((auction) => {
              const isActive = isAuctionActive(auction.endsAt, auction.status);
              const isEnded = new Date(auction.endsAt) < new Date();

              return (
                <div 
                  key={auction.id} 
                  className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 h-64"
                >
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Image Section */}
                    <div className="relative md:w-2/5 h-48 md:h-full">
                      <img
                        src={getThumbnailUrl(auction.imageUrl, 600, 400)}
                        alt={auction.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        {getStatusBadge(auction.status)}
                      </div>
                      {isActive && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded">
                          Active
                        </div>
                      )}
                      {isEnded && auction.status === "approved" && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-gray-600 text-white text-xs font-semibold rounded">
                          Ended
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-5 flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 pr-4">
                          <h3 className="text-lg font-bold text-text-primary mb-1 line-clamp-1">
                            {auction.title}
                          </h3>
                          <p className="text-text-secondary text-xs line-clamp-2">
                            {auction.description}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs text-text-secondary">Current Bid</div>
                          <div className="text-xl font-bold text-primary">
                            ${auction.currentBid.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-3 gap-3 py-3 border-y border-border text-xs">
                        <div>
                          <div className="text-text-secondary mb-0.5">Category</div>
                          <div className="font-semibold text-text-primary capitalize">{auction.category}</div>
                        </div>
                        <div>
                          <div className="text-text-secondary mb-0.5">Start Price</div>
                          <div className="font-semibold text-text-primary">${auction.startPrice.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-text-secondary mb-0.5">Total Bids</div>
                          <div className="font-semibold text-text-primary">{auction.bidsCount}</div>
                        </div>
                      </div>

                      {/* Time Information */}
                      <div className="flex items-center gap-4 text-xs text-text-secondary mt-3 mb-3">
                        <div>
                          <span className="opacity-75">Created:</span>{" "}
                          <span className="font-medium">{new Date(auction.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="w-px h-3 bg-border" />
                        <div>
                          <span className="opacity-75">Ends:</span>{" "}
                          <span className="font-medium">{new Date(auction.endsAt).toLocaleDateString()}</span>
                        </div>
                        {isActive && (
                          <>
                            <div className="w-px h-3 bg-border" />
                            <div>
                              <span className="opacity-75">Time Left:</span>{" "}
                              <span className="font-medium text-green-600">
                                {getTimeRemaining(new Date(auction.endsAt))}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Rejection Reason */}
                      {auction.status === "rejected" && auction.rejectionReason && (
                        <div className="mt-auto bg-red-500/10 border border-red-500/20 rounded-md p-2">
                          <p className="text-xs font-semibold text-red-600 mb-1">Rejection Reason:</p>
                          <p className="text-xs text-red-600">{auction.rejectionReason}</p>
                        </div>
                      )}

                      {auction.status === "pending" && (
                        <div className="mt-auto bg-yellow-500/10 border border-yellow-500/20 rounded-md p-2">
                          <p className="text-xs text-yellow-700">Waiting for admin approval...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
