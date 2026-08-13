import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'vanilla' | 'noir' | 'violet';

type Language = 'en' | 'id' | 'zh' | 'de';

const LEGACY_THEME_MAP: Record<string, Theme> = {
  light: 'vanilla',
  dark: 'noir',
  yellow: 'vanilla',
  apple: 'noir',
};

interface LayoutState {
  isSidebar: boolean;
  language: Language;
  theme: Theme;
  mobileMenuOpen: boolean;
  toggleLayout: () => void;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      isSidebar: true,
      language: 'en',
      theme: 'vanilla',
      mobileMenuOpen: false,
      toggleLayout: () => set((state) => ({ isSidebar: !state.isSidebar })),
      toggleLanguage: () => set((state) => {
        const langs: Language[] = ['en', 'id', 'zh', 'de'];
        const currentIdx = langs.indexOf(state.language);
        return { language: langs[(currentIdx + 1) % langs.length] };
      }),
      setLanguage: (lang: Language) => set({ language: lang }),
      setTheme: (theme: Theme) => set({ theme }),
      setMobileMenuOpen: (open: boolean) => set({ mobileMenuOpen: open }),
    }),
    {
      name: 'felich-portfolio-layout',
      version: 2,
      partialize: (state) => ({
        language: state.language,
        isSidebar: state.isSidebar,
        theme: state.theme,
      }),
      migrate: (persistedState, version) => {
        if (version < 2) {
          const persisted = persistedState as {
            language?: Language;
            isSidebar?: boolean;
            theme?: string;
          };
          return {
            language: persisted.language ?? 'en',
            isSidebar: persisted.isSidebar ?? true,
            theme: (persisted.theme ? LEGACY_THEME_MAP[persisted.theme] : undefined) ?? 'vanilla',
          };
        }
        return persistedState as { language: Language; isSidebar: boolean; theme: Theme };
      },
    }
  )
);
