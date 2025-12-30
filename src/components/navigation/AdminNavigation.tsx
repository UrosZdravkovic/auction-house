import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  HiViewGrid,
  HiUserCircle,
  HiChartBar,
  HiLogout,
  HiPlus
} from 'react-icons/hi';
import { ThemeToggle } from './ThemeToggle';
import { AdminMobileMenu } from './AdminMobileMenu';
import { useAuth } from '../../hooks/useAuth';
import { AddAuctionDialog } from '../auction/AddAuctionDialog';

export const AdminNavigation = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: HiChartBar },
    { path: '/auctions', label: 'Auctions', icon: HiViewGrid },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-full transition-all duration-200 ${isActive
      ? 'text-text-primary font-medium bg-active-bg'
      : 'text-text-secondary hover:text-text-primary hover:bg-hover-bg'
    }`;

  return (
    <header className="sticky top-5 z-50 mx-4 lg:mx-0">
      <nav className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 h-14 lg:h-16 bg-surface backdrop-blur-md shadow-sm border border-border rounded-full">
        <div className="flex items-center justify-between h-full w-full gap-2 sm:gap-4 lg:gap-8">
          {/* Logo with Admin Badge */}
          <NavLink to="/" className="flex items-center gap-2 transition-all duration-200 px-2 py-1 rounded-full">
            <span className="text-base lg:text-lg font-semibold text-text-primary">
              Auction House
            </span>
            <span className="hidden sm:inline px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full">
              ADMIN
            </span>
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center justify-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={navLinkClass}
                title={label}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline font-medium text-sm">{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Side Actions - Desktop & Tablet */}
          <div className="hidden xs:flex items-center gap-2 lg:gap-3">
            <button
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-full text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all duration-200"
              title="Create Auction"
            >
              <HiPlus className="w-4 h-4" />
              <span className="hidden lg:inline">Create Auction</span>
            </button>

            <div className="hidden sm:block h-6 w-px bg-border" />

            <ThemeToggle />

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `p-2 rounded-full transition-all duration-200 ${isActive
                  ? 'bg-active-bg text-text-primary'
                  : 'text-text-secondary hover:bg-hover-bg hover:text-text-primary'
                }`
              }
              title="Profile"
            >
              <HiUserCircle className="w-5 h-5" />
            </NavLink>

            <div className="hidden sm:block h-6 w-px bg-border" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 p-2 lg:px-3 lg:py-1.5 rounded-full text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-hover-bg transition-all duration-200"
              title="Logout"
            >
              <HiLogout className="w-4 h-4" />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>

          {/* Mobile Menu - Below 550px */}
          <AdminMobileMenu onCreateAuction={() => setShowAddDialog(true)} />
        </div>
      </nav>

      <AddAuctionDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </header>
  );
};
