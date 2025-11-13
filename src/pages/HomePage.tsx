export const HomePage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Welcome to Auction House
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Discover amazing items, place bids, and win auctions in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 bg-surface rounded-lg border border-border hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🔨</span>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Live Auctions
          </h3>
          <p className="text-text-secondary">
            Participate in real-time bidding on exclusive items
          </p>
        </div>

        <div className="p-6 bg-surface rounded-lg border border-border hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Secure Bidding
          </h3>
          <p className="text-text-secondary">
            Safe and secure platform for all your transactions
          </p>
        </div>

        <div className="p-6 bg-surface rounded-lg border border-border hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">⭐</span>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Premium Items
          </h3>
          <p className="text-text-secondary">
            Curated selection of high-quality auction items
          </p>
        </div>
      </div>
    </div>
  );
};
