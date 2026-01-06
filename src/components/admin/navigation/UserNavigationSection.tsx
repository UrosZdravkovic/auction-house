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
                        <span className={`text-sm whitespace-nowrap overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                            {label}
                        </span>
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
                    <span className={`text-sm whitespace-nowrap overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        Logout
                    </span>
                </button>
            </div>

            {/* User Info - hidden when collapsed */}
            {user && !isCollapsed && (
                <div className="border-t border-border p-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 bg-surface-hover rounded-full flex items-center justify-center shrink-0">
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
        </>
    )
}