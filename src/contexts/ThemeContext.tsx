import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'sepia';

export const MIN_FONT_SCALE = 80;
export const MAX_FONT_SCALE = 150;
export const DEFAULT_FONT_SCALE = 100;

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  /** Cycles light -> sepia -> dark -> light */
  toggleTheme: () => void;
  isDark: boolean;
  isSepia: boolean;
  /** Page font size as a percentage of the browser default (80-150). */
  fontScale: number;
  setFontScale: (scale: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const readStorage = (key: string): string | null => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const writeStorage = (key: string, value: string) => {
  try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = readStorage('theme');
      if (saved === 'light' || saved === 'dark' || saved === 'sepia') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [fontScale, setFontScaleState] = useState<number>(() => {
    const saved = Number(readStorage('fontScale'));
    return saved >= MIN_FONT_SCALE && saved <= MAX_FONT_SCALE ? saved : DEFAULT_FONT_SCALE;
  });

  useEffect(() => {
    const root = document.documentElement;
    // "theme-sepia" (not "sepia") so it can't clash with Tailwind's .sepia filter utility
    root.classList.remove('light', 'dark', 'theme-sepia');
    root.classList.add(theme === 'sepia' ? 'theme-sepia' : theme);
    root.setAttribute('data-theme', theme);
    writeStorage('theme', theme);
  }, [theme]);

  // Everything is sized in rem, so changing the root font size scales the whole app.
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
    writeStorage('fontScale', String(fontScale));
  }, [fontScale]);

  const setTheme = (next: Theme) => setThemeState(next);
  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'sepia' : prev === 'sepia' ? 'dark' : 'light'));
  };
  const setFontScale = (scale: number) => {
    setFontScaleState(Math.min(MAX_FONT_SCALE, Math.max(MIN_FONT_SCALE, Math.round(scale))));
  };

  return (
    <ThemeContext.Provider value={{
      theme, setTheme, toggleTheme,
      isDark: theme === 'dark', isSepia: theme === 'sepia',
      fontScale, setFontScale,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
