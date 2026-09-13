import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: AppTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const stored = localStorage.getItem('weatherintel_global_theme');
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
      // Check system preference
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Fallback
    }
    return 'light';
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    try {
      localStorage.setItem('weatherintel_global_theme', theme);
      // Keep live monitor theme in sync as well
      localStorage.setItem('weatherintel_live_theme', theme);
    } catch {}

    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme, isDark]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
