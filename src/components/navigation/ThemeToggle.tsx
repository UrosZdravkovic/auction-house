import { HiMoon, HiSun } from 'react-icons/hi';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-surface hover:bg-surface-hover border border-border transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <HiMoon className="w-5 h-5 text-text-primary" />
      ) : (
        <HiSun className="w-5 h-5 text-text-primary" />
      )}
    </button>
  );
};
