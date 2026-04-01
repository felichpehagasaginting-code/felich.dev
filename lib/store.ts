import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'yellow';

interface LayoutState {
  isSidebar: boolean;
  language: 'en' | 'id';
  theme: Theme;
  mobileMenuOpen: boolean;
  warp: { x: number; y: number; color: string } | null;
  toggleLayout: () => void;
  toggleLanguage: () => void;
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
      toggleLanguage: () => set((state) => ({
        language: state.language === 'en' ? 'id' : 'en'
      })),
      setTheme: (theme: Theme) => set({ theme }),
      setMobileMenuOpen: (open: boolean) => set({ mobileMenuOpen: open }),
      triggerWarp: (x, y, color) => {
        set({ warp: { x, y, color } });
        setTimeout(() => set({ warp: null }), 1000);
      },
    }),
    {
      name: 'felich-portfolio-layout',
      // Hanya simpan bahasa dan sidebar, biarkan tema selalu kembali ke default state ('dark')
      partialize: (state) => ({ 
        language: state.language,
        isSidebar: state.isSidebar,
      }),
    }
  )
);
