export const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-surface rounded-lg border border-border">
          <div className="text-text-secondary text-sm mb-2">Total Auctions</div>
          <div className="text-3xl font-bold text-text-primary">0</div>
        </div>
        
        <div className="p-6 bg-surface rounded-lg border border-border">
          <div className="text-text-secondary text-sm mb-2">Pending Approval</div>
          <div className="text-3xl font-bold text-warning">0</div>
        </div>
        
        <div className="p-6 bg-surface rounded-lg border border-border">
          <div className="text-text-secondary text-sm mb-2">Active Users</div>
          <div className="text-3xl font-bold text-text-primary">0</div>
        </div>
        
        <div className="p-6 bg-surface rounded-lg border border-border">
          <div className="text-text-secondary text-sm mb-2">Total Bids</div>
          <div className="text-3xl font-bold text-success">0</div>
        </div>
      </div>

      <div className="p-6 bg-surface rounded-lg border border-border">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Recent Activity</h2>
        <p className="text-text-secondary">Activity feed will be displayed here...</p>
      </div>
    </div>
  );
};
