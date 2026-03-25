'use client';

import { useEffect, useRef } from 'react';

export default function TabTitle() {
  const originalTitle = useRef('');

  useEffect(() => {
    originalTitle.current = document.title;

    const messages = ['Come back! 👀', 'Miss you! 💙', 'Hey, where are you? 🚀'];
    let messageIndex = 0;
    let interval: NodeJS.Timeout;

    const handleVisibility = () => {
      if (document.hidden) {
        document.title = messages[messageIndex];
        interval = setInterval(() => {
          messageIndex = (messageIndex + 1) % messages.length;
          document.title = messages[messageIndex];
        }, 2000);
      } else {
        clearInterval(interval);
        document.title = originalTitle.current;
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, []);

  return null;
}
