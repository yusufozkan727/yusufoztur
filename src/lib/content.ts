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

