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
    `flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200 ${isActive
      ? 'text-gray-900 dark:text-gray-100 font-medium bg-gray-200 dark:bg-gray-800'
      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

  return (
    <header className="sticky top-5 z-50">
      <nav className="max-w-5xl mx-auto px-6 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border border-gray-200 dark:border-gray-800 rounded-full">
        <div className="flex items-center justify-between h-full w-full gap-8">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 group transition-all duration-200 px-2 py-1 rounded-full hover:cursor-pointer">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
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
            <ThemeToggle />

            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `p-2 rounded-full transition-all duration-200 ${isActive
                      ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                    }`
                  }
                >
                  <HiUserCircle className="w-5 h-5" />
                </NavLink>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <HiLogout className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/auth?mode=login"
                  className="px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/auth?mode=register"
                  className="px-4 py-1.5 text-sm font-medium bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 hover:shadow-md transition-all duration-200"
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
