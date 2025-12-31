import { Outlet } from 'react-router-dom';
import { AdminNavigation } from './AdminNavigation';
import { SidebarProvider, useSidebar } from '../../../hooks/useSidebar';

const AdminContent = () => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      {/* Main Content - offset by sidebar width */}
      <main
        className={`min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export const AdminLayout = () => {
  return (
    <SidebarProvider>
      <AdminContent />
    </SidebarProvider>
  );
};
