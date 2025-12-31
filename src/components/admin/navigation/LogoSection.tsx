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
            <NavLink to="/" className="block">
                {isCollapsed ? (
                    <h1 className="font-semibold text-text-primary text-lg">AH</h1>
                ) : (
                    <>
                        <h1 className="font-semibold text-text-primary">Auction House</h1>
                        <span className="text-xs font-medium text-error">Admin Panel</span>
                    </>
                )}
            </NavLink>
            <ThemeToggle />
        </div>
    )
}