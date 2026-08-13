'use client';

import { useEffect } from 'react';
import { useLayoutStore } from '@/lib/store';

const DARK_THEMES = new Set(['noir', 'violet']);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useLayoutStore();

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('theme-vanilla', 'theme-noir', 'theme-violet');
    html.classList.add(`theme-${theme}`);
    html.classList.toggle('dark', DARK_THEMES.has(theme));
  }, [theme]);

  return <>{children}</>;
}
