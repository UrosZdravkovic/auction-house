import { NavLink } from "react-router-dom"
import { ThemeToggle } from "../../navigation/ThemeToggle"

interface LogoSectionProps {
    isCollapsed: boolean;
}

export default function LogoSection({ isCollapsed }: LogoSectionProps) {
    return (
        <div className={`border-b border-border flex items-center transition-all duration-300 ${
            isCollapsed ? 'p-4 flex-col gap-3' : 'p-6 justify-between'
        }`}>
            <NavLink to="/" className="block overflow-hidden">
                <div className="relative">
                    {/* Collapsed: AH */}
                    <h1
                        className={`font-semibold text-text-primary text-lg absolute inset-0 flex items-center justify-center ${
                            isCollapsed ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        AH
                    </h1>
                    {/* Expanded: Full text */}
                    <div className={`whitespace-nowrap ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                        <h1 className="font-semibold text-text-primary">Auction House</h1>
                        <span className="text-xs font-medium text-error">Admin Panel</span>
                    </div>
                </div>
            </NavLink>
            <ThemeToggle />
        </div>
    )
}