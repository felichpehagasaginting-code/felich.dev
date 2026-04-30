'use client';

import { useEffect } from 'react';
import { useLayoutStore } from '@/lib/store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useLayoutStore();

  useEffect(() => {
    const html = document.documentElement;
    // Remove all theme classes
    html.classList.remove('light', 'dark', 'yellow', 'apple');
    // Add current theme
    html.classList.add(theme);
    if (theme === 'apple') {
      html.classList.add('dark');
    }
  }, [theme]);

  return <>{children}</>;
}
