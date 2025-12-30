import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HiUserCircle,
  HiLogout,
  HiPlus,
  HiDotsVertical
} from 'react-icons/hi';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

type AdminMobileMenuProps = {
  onCreateAuction: () => void;
}

export const AdminMobileMenu = ({ onCreateAuction }: AdminMobileMenuProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setShowMenu(false);
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex xs:hidden items-center gap-2" ref={menuRef}>
      <button
        onClick={onCreateAuction}
        className="flex items-center gap-1.5 p-2 rounded-full text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all duration-200"
        title="Create Auction"
      >
        <HiPlus className="w-4 h-4" />
      </button>

      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-hover-bg transition-all duration-200"
        title="Menu"
      >
        <HiDotsVertical className="w-5 h-5" />
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-full right-4 mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg overflow-hidden">
          <div className="py-2">
            <NavLink
              to="/profile"
              onClick={() => setShowMenu(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isActive
                  ? 'bg-active-bg text-text-primary font-medium'
                  : 'text-text-secondary hover:bg-hover-bg hover:text-text-primary'
                }`
              }
            >
              <HiUserCircle className="w-5 h-5" />
              <span>Profile</span>
            </NavLink>

            <div className="px-4 py-2.5 flex items-center justify-between">
              <span className="text-sm text-text-secondary">Theme</span>
              <ThemeToggle />
            </div>

            <div className="h-px bg-border mx-2 my-1" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors"
            >
              <HiLogout className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
