import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Breakpoints
const MOBILE_BREAKPOINT = 650;
const TABLET_BREAKPOINT = 1200;

type ScreenMode = 'mobile' | 'tablet' | 'desktop';

type SidebarContextType = {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  screenMode: ScreenMode;
  canToggle: boolean; // Only true on desktop (≥1200px)
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

const getScreenMode = (width: number): ScreenMode => {
  if (width < MOBILE_BREAKPOINT) return 'mobile';
  if (width < TABLET_BREAKPOINT) return 'tablet';
  return 'desktop';
};

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [screenMode, setScreenMode] = useState<ScreenMode>(() =>
    typeof window !== 'undefined' ? getScreenMode(window.innerWidth) : 'desktop'
  );

  useEffect(() => {
    const handleResize = () => {
      const newMode = getScreenMode(window.innerWidth);
      setScreenMode(newMode);

      // Force collapsed on tablet mode
      if (newMode === 'tablet') {
        setIsCollapsed(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    // Only allow toggle on desktop
    if (screenMode === 'desktop') {
      setIsCollapsed((prev) => !prev);
    }
  };

  const canToggle = screenMode === 'desktop';

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, toggleSidebar, screenMode, canToggle }}>
      {children}
    </SidebarContext.Provider>
  );
};
