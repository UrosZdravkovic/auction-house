import { NavLink } from 'react-router-dom';
import { 
  HiViewGrid, 
  HiShieldCheck, 
  HiUserCircle, 
  HiUsers,
  HiChartBar,
  HiCog
} from 'react-icons/hi';
import { ThemeToggle } from './ThemeToggle';

export const AdminNavigation = () => {
  const navLinks = [
    { path: '/', label: 'Dashboard', icon: HiChartBar },
    { path: '/auctions', label: 'Auctions', icon: HiViewGrid },
    { path: '/pending', label: 'Pending Approval', icon: HiShieldCheck },
    { path: '/users', label: 'Users', icon: HiUsers },
    { path: '/settings', label: 'Settings', icon: HiCog },
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
          {/* Logo with Admin Badge */}
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <span className="text-xl font-bold text-text-primary">
                Auction House
              </span>
              <span className="ml-2 px-2 py-0.5 bg-error text-white text-xs font-semibold rounded">
                ADMIN
              </span>
            </div>
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
            
            <NavLink
              to="/profile"
              className={navLinkClass}
            >
              <HiUserCircle className="w-5 h-5" />
              <span className="font-medium">Profile</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};
