import { SUPPORTED_LANGUAGES } from './i18n';

export function langStaticPaths() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ params: { lang } }));
}

