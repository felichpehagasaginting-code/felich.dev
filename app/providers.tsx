 'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { useLayoutStore } from '@/lib/store';

export function Providers({ children }: { children: React.ReactNode }) {
  const { language } = useLayoutStore();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

