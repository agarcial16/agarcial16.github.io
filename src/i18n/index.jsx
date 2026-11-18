import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STRINGS } from './strings.js';
import * as cvEs from '../data/cv.js';
import * as cvEn from '../data/cv.en.js';

const CV = { es: cvEs, en: cvEn };
const KEY = 'idioma';

// Idioma inicial: ?lang= en la URL, luego la preferencia guardada y, si no, el idioma del navegador.
function initialLang() {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (fromUrl === 'es' || fromUrl === 'en') return fromUrl;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'es' || saved === 'en') return saved;
  } catch { /* sin almacenamiento */ }
  return (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en';
}

const I18n = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  const setLang = useCallback((next) => {
    setLangState(next);
    try { localStorage.setItem(KEY, next); } catch { /* sin almacenamiento */ }
    // La URL refleja el idioma para poder compartir el enlace en inglés.
    const url = new URL(window.location.href);
    url.searchParams.set('lang', next);
    window.history.replaceState(null, '', url);
  }, []);

  useEffect(() => {
    const t = STRINGS[lang];
    document.documentElement.lang = lang;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: STRINGS[lang], cv: CV[lang] }), [lang, setLang]);
  return <I18n.Provider value={value}>{children}</I18n.Provider>;
}

export const useI18n = () => useContext(I18n);

export function LangToggle({ className = 'btn' }) {
  const { lang, setLang, t } = useI18n();
  return (
    <button type="button" className={className} lang={lang === 'es' ? 'en' : 'es'} aria-label={t.switchLabel} onClick={() => setLang(lang === 'es' ? 'en' : 'es')}>
      {lang === 'es' ? 'EN' : 'ES'}
    </button>
  );
}
