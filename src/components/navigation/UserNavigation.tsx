import { NavLink, useNavigate } from 'react-router-dom';
import { HiHome, HiViewGrid, HiUserCircle, HiLogout } from 'react-icons/hi';
import { ThemeToggle } from '../../components/navigation/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

export const UserNavigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: 'Home', icon: HiHome },
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
    `flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 relative ${isActive
      ? 'text-primary font-semibold'
      : 'text-text-secondary hover:text-text-primary'
    } ${isActive ? 'after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-0.5 after:bg-primary after:rounded-full' : ''}`;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 w-full">
      <nav className="max-w-7xl mx-auto px-6 h-16">
        <div className="flex items-center h-full w-full">
          {/* Logo */}
          <div className="flex-1 min-w-0">
            <NavLink to="/" className="flex items-center space-x-2 group">
              <span className="text-lg font-semibold text-text-primary">
                Auction House
              </span>
            </NavLink>
          </div>

          {/* Centered Navigation Links */}
          <div className="flex items-center justify-center gap-1 shrink-0">
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
          <div className="flex-1 flex items-center justify-end gap-3 min-w-0">
            <ThemeToggle />

            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `p-2 rounded-lg transition-all duration-200 ${isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                    }`
                  }
                >
                  <HiUserCircle className="w-5 h-5" />
                </NavLink>
                <div className="h-6 w-px bg-border" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-text-secondary hover:text-error hover:bg-error/10 transition-all duration-200"
                >
                  <HiLogout className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/auth?mode=login"
                  className="px-4 py-1.5 text-sm font-medium text-text-primary hover:text-primary transition-colors duration-200"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/auth?mode=register"
                  className="px-4 py-1.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-hover transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
