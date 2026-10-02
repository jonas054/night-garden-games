import { createContext } from 'react'
import type { Locale, Translation } from './i18n'

export interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translation
}

export const LanguageContext = createContext<
  LanguageContextValue | undefined
>(undefined)
