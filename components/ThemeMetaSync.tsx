'use client';

import { useLayoutStore } from '@/lib/store';
import { useEffect } from 'react';

export default function ThemeMetaSync() {
  const { theme } = useLayoutStore();

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const colorMap = {
      light: '#ffffff',
      dark: '#0a0a0a',
      yellow: '#fef9ed',
      apple: '#000000',
    };

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', colorMap[theme]);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = colorMap[theme];
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
    
    // Also update safari pinned tab color
    const maskIcon = document.querySelector('link[rel="mask-icon"]');
    if (maskIcon) {
      maskIcon.setAttribute('color', theme === 'yellow' ? '#d97706' : '#3b82f6');
    }
  }, [theme]);

  return null;
}
