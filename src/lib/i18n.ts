export const SUPPORTED_LANGUAGES = ["tr", "en", "pl"] as const;
export type Lang = typeof SUPPORTED_LANGUAGES[number];

export function isLang(input: string | undefined): input is Lang {
  return !!input && (SUPPORTED_LANGUAGES as readonly string[]).includes(input);
}

export function fallbackLang(): Lang {
  return "tr";
}

