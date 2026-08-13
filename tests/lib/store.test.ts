import { describe, it, expect, beforeEach } from 'vitest';
import { useLayoutStore } from '@/lib/store';

describe('useLayoutStore (zustand)', () => {
  beforeEach(() => {
    useLayoutStore.setState({
      isSidebar: true,
      language: 'en',
      theme: 'noir',
      mobileMenuOpen: false,
    });
    localStorage.clear();
  });

  it('initializes with default values', () => {
    const state = useLayoutStore.getState();
    expect(state.isSidebar).toBe(true);
    expect(state.language).toBe('en');
    expect(state.theme).toBe('noir');
    expect(state.mobileMenuOpen).toBe(false);
  });

  it('toggleLayout flips isSidebar', () => {
    useLayoutStore.getState().toggleLayout();
    expect(useLayoutStore.getState().isSidebar).toBe(false);
    useLayoutStore.getState().toggleLayout();
    expect(useLayoutStore.getState().isSidebar).toBe(true);
  });

  it('toggleLanguage cycles through languages', () => {
    const initialLang = useLayoutStore.getState().language;
    useLayoutStore.getState().toggleLanguage();
    const secondLang = useLayoutStore.getState().language;
    expect(secondLang).not.toBe(initialLang);
    expect(['en', 'id', 'zh', 'de']).toContain(secondLang);
  });

  it('setLanguage sets specific language', () => {
    useLayoutStore.getState().setLanguage('id');
    expect(useLayoutStore.getState().language).toBe('id');
    useLayoutStore.getState().setLanguage('zh');
    expect(useLayoutStore.getState().language).toBe('zh');
    useLayoutStore.getState().setLanguage('de');
    expect(useLayoutStore.getState().language).toBe('de');
  });

  it('setTheme changes theme', () => {
    useLayoutStore.getState().setTheme('vanilla');
    expect(useLayoutStore.getState().theme).toBe('vanilla');
    useLayoutStore.getState().setTheme('violet');
    expect(useLayoutStore.getState().theme).toBe('violet');
  });

  it('setMobileMenuOpen controls mobile menu', () => {
    useLayoutStore.getState().setMobileMenuOpen(true);
    expect(useLayoutStore.getState().mobileMenuOpen).toBe(true);
    useLayoutStore.getState().setMobileMenuOpen(false);
    expect(useLayoutStore.getState().mobileMenuOpen).toBe(false);
  });

  it('cycles through 4 languages correctly', () => {
    useLayoutStore.getState().setLanguage('en');
    useLayoutStore.getState().toggleLanguage();
    expect(useLayoutStore.getState().language).toBe('id');
    useLayoutStore.getState().toggleLanguage();
    expect(useLayoutStore.getState().language).toBe('zh');
    useLayoutStore.getState().toggleLanguage();
    expect(useLayoutStore.getState().language).toBe('de');
    useLayoutStore.getState().toggleLanguage();
    expect(useLayoutStore.getState().language).toBe('en');
  });

  it('persists theme, isSidebar and language to localStorage', () => {
    useLayoutStore.getState().setLanguage('id');
    useLayoutStore.getState().toggleLayout();
    useLayoutStore.getState().setTheme('vanilla');
    const persisted = localStorage.getItem('felich-portfolio-layout');
    expect(persisted).not.toBeNull();
    if (persisted) {
      const parsed = JSON.parse(persisted);
      expect(parsed.state.language).toBe('id');
      expect(parsed.state.isSidebar).toBe(false);
      expect(parsed.state.theme).toBe('vanilla');
    }
  });
});
