import settings from '../../content/settings.json';

export type Settings = typeof settings;

export function loadSettings(): Settings {
  return settings;
}

export function loadPlaces(lang: string) {
  const modules = import.meta.glob('../../content/places/*.md', { eager: true });
  return Object.values(modules)
    .map((m: any) => m.frontmatter)
    .filter((fm: any) => fm?.lang === lang);
}

export function loadTestimonials(lang: string) {
  const modules = import.meta.glob('../../content/testimonials/*.md', { eager: true });
  return Object.values(modules)
    .map((m: any) => m.frontmatter)
    .filter((fm: any) => fm?.lang === lang);
}

export function loadHome(lang: string) {
  const modules = import.meta.glob('../../content/*.md', { eager: true });
  const entries = Object.entries(modules) as any[];
  const match = entries
    .filter(([p]) => /\/home(\.|-|$)/.test(p))
    .map(([, mod]) => (mod as any).frontmatter)
    .find((fm: any) => fm?.lang === lang) as any;
  return match || null;
}

export function loadAbout(lang: string) {
  const modules = import.meta.glob('../../content/*.md', { eager: true });
  const entries = Object.entries(modules) as any[];
  const match = entries
    .filter(([p]) => /\/about(\.|-|$)/.test(p))
    .map(([, mod]) => (mod as any).frontmatter)
    .find((fm: any) => fm?.lang === lang) as any;
  return match || null;
}

export function loadContact(lang: string) {
  const modules = import.meta.glob('../../content/*.md', { eager: true });
  const entries = Object.entries(modules) as any[];
  const match = entries
    .filter(([p]) => /\/contact(\.|-|$)/.test(p))
    .map(([, mod]) => (mod as any).frontmatter)
    .find((fm: any) => fm?.lang === lang) as any;
  return match || null;
}
