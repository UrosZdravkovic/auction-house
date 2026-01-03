import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiMenu, HiX, HiChartBar, HiViewGrid, HiUserCircle, HiCog, HiLogout, HiPlus } from 'react-icons/hi';
import { ThemeToggle } from '../../navigation/ThemeToggle';
import { useAuth } from '../../../hooks/useAuth';
import { AddAuctionDialog } from '../../auction/AuctionForm/AddAuctionDialog';

export const AdminNavigationMobile = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navLinks = [
        { path: '/', label: 'Dashboard', icon: HiChartBar },
        { path: '/auctions', label: 'Auctions', icon: HiViewGrid },
        { path: '/profile', label: 'Profile', icon: HiUserCircle },
        { path: '/settings', label: 'Settings', icon: HiCog },
    ];

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
            ? 'text-primary font-medium bg-primary/10'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
        }`;

    return (
        <>
            {/* Mobile Header Bar */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border flex items-center justify-between px-4 z-50">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-200"
                >
                    {isMenuOpen ? (
                        <HiX className="w-6 h-6" />
                    ) : (
                        <HiMenu className="w-6 h-6" />
                    )}
                </button>

                <div className="flex items-center gap-2">
                    <h1 className="font-semibold text-text-primary">Admin</h1>
                    <span className="text-xs font-medium text-error">Panel</span>
                </div>

                <ThemeToggle />
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Drawer */}
            <aside
                className={`fixed top-16 left-0 bottom-0 w-72 bg-surface border-r border-border flex flex-col z-50 transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Create Auction Button */}
                <div className="p-4">
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

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-2 overflow-y-auto">
                    <div className="space-y-1">
                        {navLinks.map(({ path, label, icon: Icon }) => (
                            <NavLink
                                key={path}
                                to={path}
                                end={path === '/'}
                                className={navLinkClass}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm">{label}</span>
                            </NavLink>
                        ))}
                    </div>
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-border">
                    <button
                        onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-error hover:bg-error/10 transition-all duration-200"
                    >
                        <HiLogout className="w-5 h-5" />
                        <span className="text-sm">Logout</span>
                    </button>
                </div>

                {/* User Info */}
                {user && (
                    <div className="p-4 border-t border-border">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 bg-surface-hover rounded-full flex items-center justify-center">
                                <HiUserCircle className="w-6 h-6 text-text-secondary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">
                                    {user.displayName || 'Admin User'}
                                </p>
                                <p className="text-xs text-text-secondary truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </aside>

            <AddAuctionDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
        </>
    );
};
