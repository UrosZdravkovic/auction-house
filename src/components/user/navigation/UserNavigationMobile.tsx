import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HiViewGrid, HiUserCircle, HiLogout, HiPlus, HiCollection, HiCash } from 'react-icons/hi';
import { ThemeToggle } from '../../navigation/ThemeToggle';
import { useAuth } from '../../../hooks/useAuth';
import { AddAuctionDialog } from '../../auction/AuctionForm/AddAuctionDialog';

// Animated hamburger icon component
const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className="w-7 h-7 flex flex-col justify-center items-center gap-1.5">
    <span
      className={`hamburger-line block h-[2px] w-5 bg-current rounded-full origin-center ${
        isOpen ? 'rotate-45 translate-y-[8px]' : ''
      }`}
    />
    <span
      className={`hamburger-line block h-[2px] w-5 bg-current rounded-full ${
        isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
      }`}
    />
    <span
      className={`hamburger-line block h-[2px] w-5 bg-current rounded-full origin-center ${
        isOpen ? '-rotate-45 -translate-y-[8px]' : ''
      }`}
    />
  </div>
);

export const UserNavigationMobile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
      ? 'text-primary font-medium bg-primary/10'
      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 mx-4 sm:mx-6 pt-5">
        <nav className="max-w-7xl mx-auto px-4 h-14 bg-surface backdrop-blur-md shadow-sm border border-border rounded-full">
          <div className="flex items-center justify-between h-full w-full gap-4">
            {/* Logo */}
            <NavLink to="/" className="flex items-center space-x-2 group transition-all duration-200 px-2 py-1 rounded-full hover:cursor-pointer">
              <span className="text-base font-semibold text-text-primary">
                Auction House
              </span>
            </NavLink>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-200"
              >
                <HamburgerIcon isOpen={isMenuOpen} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <aside
        className={`fixed top-22 right-4 sm:right-6 bottom-4 sm:bottom-6 w-72 bg-surface border border-border rounded-2xl shadow-lg z-50 flex flex-col overflow-hidden transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Create Auction Button */}
        {user && (
          <div className="p-4 border-b border-border">
            <button
              onClick={() => {
                setShowAddDialog(true);
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all duration-200"
            >
              <HiPlus className="w-5 h-5" />
              <span>Create Auction</span>
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="p-4">
          <div className="space-y-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={mobileNavLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{label}</span>
              </NavLink>
            ))}
            {user && (
              <NavLink
                to="/profile"
                className={mobileNavLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                <HiUserCircle className="w-5 h-5" />
                <span className="text-sm">Profile</span>
              </NavLink>
            )}
          </div>
        </nav>

        {/* Auth Section */}
        <div className="p-4 border-t border-border">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-error hover:bg-error/10 transition-all duration-200"
            >
              <HiLogout className="w-5 h-5" />
              <span className="text-sm">Logout</span>
            </button>
          ) : (
            <div className="flex gap-3">
              <NavLink
                to="/auth?mode=login"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 px-4 py-3 text-center text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-hover-bg rounded-xl transition-all duration-200 border border-border"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/auth?mode=register"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 px-4 py-3 text-center text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary-hover transition-all duration-200"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </aside>

      <AddAuctionDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </>
  );
};
