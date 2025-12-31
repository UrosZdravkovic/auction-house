import { NavLink, useNavigate } from "react-router-dom"
import { HiLogout, HiUserCircle, HiCog } from "react-icons/hi"
import { useAuth } from "@/hooks/useAuth"

type UserNavigationSectionProps = {
    navLinkClass: ({ isActive }: { isActive: boolean }) => string;
    isCollapsed: boolean;
}

export default function UserNavigationSection({ navLinkClass, isCollapsed }: UserNavigationSectionProps) {
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

    const bottomNavLinks = [
        { path: '/profile', label: 'Profile', icon: HiUserCircle },
        { path: '/settings', label: 'Settings', icon: HiCog },
    ];

    return (
        <>
            <div className={`py-4 border-t border-border space-y-1 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                {/* Bottom Nav Links */}
                {bottomNavLinks.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={navLinkClass}
                        title={isCollapsed ? label : undefined}
                    >
                        <Icon className="w-5 h-5 shrink-0" />
                        {!isCollapsed && <span className="text-sm">{label}</span>}
                    </NavLink>
                ))}

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 py-3 rounded-xl text-text-secondary hover:text-error hover:bg-error/10 transition-all duration-200 ${
                        isCollapsed ? 'justify-center px-2' : 'px-4'
                    }`}
                    title={isCollapsed ? 'Logout' : undefined}
                >
                    <HiLogout className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="text-sm">Logout</span>}
                </button>
            </div>

            {/* User Info */}
            {user && (
                <div className={`border-t border-border transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
                    <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
                        <div className={`bg-surface-hover rounded-full flex items-center justify-center shrink-0 ${
                            isCollapsed ? 'w-8 h-8' : 'w-10 h-10'
                        }`}>
                            <HiUserCircle className={`text-text-secondary ${isCollapsed ? 'w-5 h-5' : 'w-6 h-6'}`} />
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">
                                    {user.displayName || 'Admin User'}
                                </p>
                                <p className="text-xs text-text-secondary truncate">
                                    {user.email}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}