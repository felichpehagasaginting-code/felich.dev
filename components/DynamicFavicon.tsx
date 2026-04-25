'use client';

import { useEffect } from 'react';
import { useLayoutStore } from '@/lib/store';

export default function DynamicFavicon() {
  const { theme } = useLayoutStore();

  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!favicon) return;

    // We can use emojis as temporary favicons or different SVG colors
    // For now, let's just log or change to a different emoji per theme
    // A better way is to have favicon-dark.ico, favicon-light.ico, etc.
    
    const colors: Record<string, string> = {
      light: '🔵',
      dark: '🟣',
      yellow: '🟡'
    };

    // This is a "trick" to use emoji as favicon
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = '24px serif';
      ctx.fillText(colors[theme] || '🟣', 0, 24);
      favicon.href = canvas.toDataURL();
    }
  }, [theme]);

  return null;
}
