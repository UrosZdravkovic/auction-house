import { Outlet } from 'react-router-dom';
import { AdminNavigation } from './AdminNavigation';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
