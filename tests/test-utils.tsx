import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useInView: () => true,
    useReducedMotion: () => false,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: new Proxy({} as any, {
      get: (_target: any, prop: string) => {
        const validTags = [
          'div', 'span', 'p', 'button', 'a', 'h1', 'h2', 'h3',
          'section', 'article', 'form', 'img', 'ul', 'li', 'svg', 'path',
          'nav', 'header', 'footer', 'main', 'aside', 'label', 'input',
          'textarea', 'select', 'option', 'table', 'tr', 'td', 'th',
          'tbody', 'thead', 'figure', 'figcaption', 'blockquote', 'pre',
          'code', 'strong', 'em', 'small', 'sub', 'sup', 'hr', 'br',
          'video', 'audio', 'source', 'canvas', 'iframe',
        ];
        if (validTags.includes(prop)) {
          return React.forwardRef(({ children, ...props }: any, ref: any) =>
            React.createElement(prop, { ...props, ref }, children)
          );
        }
        return undefined;
      },
    }),
  };
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => React.createElement('img', { src, alt, ...props }),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => React.createElement('a', { href, ...props }, children),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        hi_im: "Hi, I'm",
        hero_typing_se: 'Software Engineer',
        hero_typing_ai: 'AI Engineer',
        hero_typing_devops: 'DevOps',
        hero_typing_fs: 'Fullstack Developer',
        location: 'Indonesia',
        location_tooltip: 'Local time',
        onsite: 'On-site',
        hero_para_1: 'Test paragraph 1',
        hero_para_2: 'Test paragraph 2',
        hero_para_3: 'Test paragraph 3',
        hero_skills_title: 'Core Skills',
        hero_skills_1: 'Skill 1',
        hero_skills_2: 'Skill 2',
        hero_skills_3: 'Skill 3',
        lets_connect: "Let's connect!",
        stats_skills: 'Skills',
        stats_achievements: 'Achievements',
        stats_projects: 'Projects',
        stats_experience: 'Years',
        shortcut_hint: 'Press Ctrl+K to open command palette',
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
}));

const AllTheProviders = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
