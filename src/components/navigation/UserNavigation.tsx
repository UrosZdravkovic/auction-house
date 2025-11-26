import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HiViewGrid, HiUserCircle, HiLogout, HiPlus, HiCollection, HiCash } from 'react-icons/hi';
import { ThemeToggle } from '../../components/navigation/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { AddAuctionDialog } from '../auction/AddAuctionDialog';

export const UserNavigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const publicNavLinks = [
    { path: '/', label: 'Auctions', icon: HiViewGrid },
  ];

  const userNavLinks = [
    { path: '/', label: 'Auctions', icon: HiViewGrid },
    { path: '/my-auctions', label: 'My Auctions', icon: HiCollection },
    { path: '/my-bids', label: 'My Bids', icon: HiCash },
  ];

  const navLinks = user ? userNavLinks : publicNavLinks;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200 ${isActive
      ? 'text-text-primary font-medium bg-active-bg'
      : 'text-text-secondary hover:text-text-primary hover:bg-hover-bg'
    }`;

  return (
    <header className="sticky top-5 z-50">
      <nav className="max-w-7xl mx-auto px-6 h-16 bg-surface backdrop-blur-md shadow-sm border border-border rounded-full">
        <div className="flex items-center justify-between h-full w-full gap-8">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 group transition-all duration-200 px-2 py-1 rounded-full hover:cursor-pointer">
            <span className="text-lg font-semibold text-text-primary">
              Auction House
            </span>
          </NavLink>

          {/* Centered Navigation Links */}
          <div className="flex items-center justify-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={navLinkClass}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {user && (
              <button
                onClick={() => setShowAddDialog(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-all duration-200"
              >
                <HiPlus className="w-4 h-4" />
                <span>Create Auction</span>
              </button>
            )}

            <div className="h-6 w-px bg-border" />

            <ThemeToggle />

            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `p-2 rounded-full transition-all duration-200 ${isActive
                      ? 'bg-active-bg text-text-primary'
                      : 'text-text-secondary hover:bg-hover-bg hover:text-text-primary'
                    }`
                  }
                >
                  <HiUserCircle className="w-5 h-5" />
                </NavLink>
                <div className="h-6 w-px bg-border" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-hover-bg transition-all duration-200"
                >
                  <HiLogout className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/auth?mode=login"
                  className="px-4 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-hover-bg rounded-full transition-all duration-200"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/auth?mode=register"
                  className="px-4 py-1.5 text-sm font-medium bg-primary text-background rounded-full hover:bg-primary-hover hover:shadow-md transition-all duration-200"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>

      <AddAuctionDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </header>
  );
};
