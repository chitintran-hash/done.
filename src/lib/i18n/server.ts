import { cookies } from 'next/headers';
import { translations, TranslationKey } from './translations';

export async function getLanguage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value;
  return locale === 'en' ? 'en' : 'vi';
}

export async function getTranslation() {
  const lang = await getLanguage();
  return {
    lang,
    t: (key: TranslationKey) => translations[lang][key] || key
  };
}
