import { Outlet } from 'react-router-dom';
import { UserNavigation } from './UserNavigation';

export const UserLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <UserNavigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
