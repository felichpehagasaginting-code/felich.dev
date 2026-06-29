import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'yellow' | 'apple';

type Language = 'en' | 'id' | 'zh' | 'de';

interface LayoutState {
  isSidebar: boolean;
  language: Language;
  theme: Theme;
  mobileMenuOpen: boolean;
  warp: { x: number; y: number; color: string } | null;
  toggleLayout: () => void;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setMobileMenuOpen: (open: boolean) => void;
  triggerWarp: (x: number, y: number, color: string) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      isSidebar: true,
      language: 'en',
      theme: 'dark',
      mobileMenuOpen: false,
      warp: null,
      toggleLayout: () => set((state) => ({ isSidebar: !state.isSidebar })),
      toggleLanguage: () => set((state) => {
        const langs: Language[] = ['en', 'id', 'zh', 'de'];
        const currentIdx = langs.indexOf(state.language);
        return { language: langs[(currentIdx + 1) % langs.length] };
      }),
      setLanguage: (lang: Language) => set({ language: lang }),
      setTheme: (theme: Theme) => set({ theme }),
      setMobileMenuOpen: (open: boolean) => set({ mobileMenuOpen: open }),
      triggerWarp: (x, y, color) => {
        set({ warp: { x, y, color } });
        setTimeout(() => set({ warp: null }), 1000);
      },
    }),
    {
      name: 'felich-portfolio-layout',
      partialize: (state) => ({ 
        language: state.language,
        isSidebar: state.isSidebar,
      }),
    }
  )
);
