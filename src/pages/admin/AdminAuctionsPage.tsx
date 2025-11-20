import { useState } from "react";
import { useAllAuctions } from "../../hooks/useAuctions";
import { AdminAuctionCard } from "../../components/admin/AdminAuctionCard";
import type { AuctionApprovalStatus } from "../../types";

export const AdminAuctionsPage = () => {
  const [filterStatus, setFilterStatus] = useState<AuctionApprovalStatus | "all">("all");

  const { data: auctions = [], isLoading, error } = useAllAuctions();

  const filteredAuctions = filterStatus === "all" 
    ? auctions 
    : auctions.filter(a => a.status === filterStatus);

  const statusCounts = {
    all: auctions.length,
    pending: auctions.filter(a => a.status === "pending").length,
    approved: auctions.filter(a => a.status === "approved").length,
    rejected: auctions.filter(a => a.status === "rejected").length,
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Manage Auctions
        </h1>
        <p className="text-text-secondary">
          View, approve, reject, and manage all auctions in the system
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
            filterStatus === "all"
              ? "bg-primary text-white"
              : "bg-surface border border-border text-text-primary hover:bg-active-bg"
          }`}
        >
          All ({statusCounts.all})
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
            filterStatus === "pending"
              ? "bg-yellow-600 text-white"
              : "bg-surface border border-border text-text-primary hover:bg-active-bg"
          }`}
        >
          Pending ({statusCounts.pending})
        </button>
        <button
          onClick={() => setFilterStatus("approved")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
            filterStatus === "approved"
              ? "bg-green-600 text-white"
              : "bg-surface border border-border text-text-primary hover:bg-active-bg"
          }`}
        >
          Approved ({statusCounts.approved})
        </button>
        <button
          onClick={() => setFilterStatus("rejected")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
            filterStatus === "rejected"
              ? "bg-red-600 text-white"
              : "bg-surface border border-border text-text-primary hover:bg-active-bg"
          }`}
        >
          Rejected ({statusCounts.rejected})
        </button>
      </div>

      {isLoading && (
        <div className="bg-surface rounded-lg border border-border p-8">
          <p className="text-text-secondary text-center">Loading auctions...</p>
        </div>
      )}

      {error && (
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded mb-6">
          {error instanceof Error ? error.message : "Failed to load auctions. Please try again."}
        </div>
      )}

      {!isLoading && !error && filteredAuctions.length === 0 && (
        <div className="bg-surface rounded-lg border border-border p-8">
          <p className="text-text-secondary text-center">
            No {filterStatus !== "all" ? filterStatus : ""} auctions found.
          </p>
        </div>
      )}

      {!isLoading && !error && filteredAuctions.length > 0 && (
        <div className="space-y-4">
          {filteredAuctions.map((auction) => (
            <AdminAuctionCard
              key={auction.id}
              auction={auction}
            />
          ))}
        </div>
      )}
    </div>
  );
};
