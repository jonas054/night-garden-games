import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { LanguageContext } from './LanguageContext'
import { translate, type Locale, type Translation } from './i18n'

function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('sv')
  const t = useCallback<Translation>(
    (key, values) => translate(locale, key, values),
    [locale],
  )
  const contextValue = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, t],
  )

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = t('site.title')
    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    )
    if (description) {
      description.content = t('site.description')
    }
  }, [locale, t])

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageProvider
