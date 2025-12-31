import { NavLink } from "react-router-dom"
import { HiPlus, HiChartBar, HiViewGrid } from "react-icons/hi"

type MainNavigationSectionProps = {
    setShowAddDialog: (show: boolean) => void;
    navLinkClass: ({ isActive }: { isActive: boolean }) => string;
    isCollapsed: boolean;
}

export default function MainNavigationSection({ setShowAddDialog, navLinkClass, isCollapsed }: MainNavigationSectionProps) {

    const mainNavLinks = [
        { path: '/', label: 'Dashboard', icon: HiChartBar },
        { path: '/auctions', label: 'Auctions', icon: HiViewGrid },
    ];

    return (
        <>
            <div className={`py-4 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                <button
                    onClick={() => setShowAddDialog(true)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all duration-200 ${
                        isCollapsed ? 'px-2' : 'px-4'
                    }`}
                    title={isCollapsed ? 'Create Auction' : undefined}
                >
                    <HiPlus className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span>Create Auction</span>}
                </button>
            </div>

            {/* Main Navigation */}
            <nav className={`flex-1 py-2 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                <div className="space-y-1">
                    {mainNavLinks.map(({ path, label, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={path === '/'}
                            className={navLinkClass}
                            title={isCollapsed ? label : undefined}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            {!isCollapsed && <span className="text-sm">{label}</span>}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </>
    )
}