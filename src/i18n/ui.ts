// UI translation strings — EN and IT
// Used across components for consistent labeling
// Single source of truth for navigation labels, button text, etc.

export const languages = {
  en: 'English',
  it: 'Italiano',
} as const;

export const defaultLang = 'en' as const;

export type Lang = keyof typeof languages;

export const ui = {
  en: {
    'nav.think': 'Think',
    'nav.make': 'Make',
    'nav.circle': 'Circle',
    'nav.visit': 'Visit',

    'header.tagline': 'Brand development. Italy and abroad.',

    'footer.location': 'Milan',
    'footer.copyright': '© 2026',
    'footer.linkedin': 'LinkedIn',
    'footer.vcard': 'vCard',

    'lang.switch': 'IT',
    'lang.switch.label': 'Versione italiana',
  },
  it: {
    'nav.think': 'Pensiero',
    'nav.make': 'Manualità',
    'nav.circle': 'Maestri',
    'nav.visit': 'Bottega',

    'header.tagline': 'Sviluppo di marchi. Italia ed estero.',

    'footer.location': 'Milano',
    'footer.copyright': '© 2026',
    'footer.linkedin': 'LinkedIn',
    'footer.vcard': 'vCard',

    'lang.switch': 'EN',
    'lang.switch.label': 'English version',
  },
} as const;

// Helper to retrieve a translated string for a given language
export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui[typeof defaultLang]): string {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

// Helper to get the URL prefix for a given language
// EN is at root (no prefix), IT is at /it/
export function getLangPath(lang: Lang, path: string = ''): string {
  const prefix = lang === 'en' ? '' : '/it';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${prefix}${cleanPath === '/' ? '/' : cleanPath}`;
}

// Section route paths per language
// Keeps URL slugs language-aware (Think in EN → Pensiero in IT)
export const sectionPaths = {
  en: {
    think: '/think',
    make: '/make',
    circle: '/circle',
    visit: '/visit',
  },
  it: {
    think: '/it/pensiero',
    make: '/it/manualita',
    circle: '/it/maestri',
    visit: '/it/bottega',
  },
} as const;
