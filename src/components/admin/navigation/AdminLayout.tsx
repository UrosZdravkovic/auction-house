import { Outlet } from 'react-router-dom';
import { AdminNavigation } from './AdminNavigation';
import { AdminNavigationMobile } from './AdminNavigationMobile';
import { SidebarProvider, useSidebar } from '../../../hooks/useSidebar';

const AdminContent = () => {
  const { isCollapsed, screenMode } = useSidebar();

  // Mobile mode: show mobile navigation with top padding for header
  if (screenMode === 'mobile') {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavigationMobile />
        <main className="min-h-screen pt-16">
          <div className="p-4 sm:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    );
  }

  // Tablet/Desktop mode: show sidebar navigation
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
