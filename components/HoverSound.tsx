import { useEffect } from 'react';
import { sounds } from '@/lib/sounds';

export default function HoverSound() {
  useEffect(() => {
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('interactive-element');

      if (isInteractive) {
        sounds.playHover();
      }
    };

    document.addEventListener('mouseover', handleMouseEnter);
    return () => document.removeEventListener('mouseover', handleMouseEnter);
  }, []);

  return null;
}
