import { NavLink, useNavigate } from 'react-router-dom';
import { 
  HiViewGrid, 
  HiShieldCheck, 
  HiUserCircle, 
  HiUsers,
  HiChartBar,
  HiCog,
  HiLogout
} from 'react-icons/hi';
import { ThemeToggle } from '../../components/navigation/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

export const AdminNavigation = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: HiChartBar },
    { path: '/auctions', label: 'Auctions', icon: HiViewGrid },
    { path: '/pending', label: 'Pending Approval', icon: HiShieldCheck },
    { path: '/users', label: 'Users', icon: HiUsers },
    { path: '/settings', label: 'Settings', icon: HiCog },
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
    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-primary text-white shadow-md scale-105'
        : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover hover:scale-105 hover:shadow-sm'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-md shadow-sm">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo with Admin Badge */}
          <NavLink to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-linear-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-200">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors duration-200">
                Auction House
              </span>
              <span className="px-2 py-1 bg-error text-white text-xs font-semibold rounded-md shadow-sm">
                ADMIN
              </span>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={navLinkClass}
              >
                <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium text-sm">{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            <NavLink
              to="/profile"
              className={navLinkClass}
            >
              <HiUserCircle className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="font-medium text-sm">Profile</span>
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-text-secondary hover:text-error hover:bg-error-light hover:scale-105"
            >
              <HiLogout className="w-5 h-5 transition-transform duration-200 hover:translate-x-1" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
