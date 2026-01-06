import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { AddAuctionDialog } from '../../auction/AuctionForm/AddAuctionDialog';
import { useSidebar } from '../../../hooks/useSidebar';
import LogoSection from './LogoSection';
import MainNavigationSection from './MainNavigationSection';
import UserNavigationSection from './UserNavigationSection';

export const AdminNavigation = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { isCollapsed, toggleSidebar, canToggle } = useSidebar();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
      ? 'text-primary font-medium bg-primary/10'
      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
    } ${isCollapsed ? 'justify-center' : ''}`;

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen overflow-hidden bg-surface border-r border-border flex flex-col z-50 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        
        {/* Logo Section */}
        <LogoSection isCollapsed={isCollapsed} />

        {/* Create Auction Button */}
        <MainNavigationSection
          setShowAddDialog={setShowAddDialog}
          navLinkClass={navLinkClass}
          isCollapsed={isCollapsed}
        />

        {/* User Navigation Section */}
        <UserNavigationSection navLinkClass={navLinkClass} isCollapsed={isCollapsed} />

        {/* Collapse Toggle Button - Only shown on desktop (≥1200px) */}
        {canToggle && (
          <div className={`p-4 border-t border-border transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
            <button
              onClick={toggleSidebar}
              className={`w-full flex items-center gap-3 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-200 ${
                isCollapsed ? 'justify-center px-2' : 'px-4'
              }`}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <HiChevronRight className="w-5 h-5 shrink-0" />
              ) : (
                <HiChevronLeft className="w-5 h-5 shrink-0" />
              )}
              <span className={`text-sm whitespace-nowrap overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                Collapse
              </span>
            </button>
          </div>
        )}
      </aside>
      

      <AddAuctionDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </>
  );
};
