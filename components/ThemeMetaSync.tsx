'use client';

import { useLayoutStore } from '@/lib/store';
import { useEffect } from 'react';

export default function ThemeMetaSync() {
  const { theme } = useLayoutStore();

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const colorMap = {
      vanilla: '#EAF4CE',
      noir: '#0F0F0F',
      violet: '#110B1D',
    };

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', colorMap[theme]);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = colorMap[theme];
      document.getElementsByTagName('head')[0].appendChild(meta);
    }

    const maskIcon = document.querySelector('link[rel="mask-icon"]');
    if (maskIcon) {
      const maskColor = { vanilla: '#6B881F', noir: '#FFFFFF', violet: '#D2C3F6' }[theme];
      maskIcon.setAttribute('color', maskColor);
    }
  }, [theme]);

  return null;
}
