import { NavLink } from 'react-router-dom';
import { HiHome, HiViewGrid, HiUserCircle } from 'react-icons/hi';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

export const UserNavigation = () => {
  const { user } = useAuth();

  const navLinks = [
    { path: '/', label: 'Home', icon: HiHome },
    { path: '/auctions', label: 'Auctions', icon: HiViewGrid },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-primary text-white'
        : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface backdrop-blur-sm bg-opacity-90">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-bold text-text-primary">
              Auction House
            </span>
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={navLinkClass}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <NavLink
                to="/profile"
                className={navLinkClass}
              >
                <HiUserCircle className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
