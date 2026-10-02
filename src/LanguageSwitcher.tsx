import { LANGUAGE_OPTIONS } from './i18n'
import { useLanguage } from './useLanguage'
import './LanguageSwitcher.css'

function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage()

  return (
    <div className="language-switcher" role="group" aria-label={t('language.group')}>
      {LANGUAGE_OPTIONS.map((language) => (
        <button
          aria-label={language.label}
          aria-pressed={locale === language.locale}
          className="language-switcher__button"
          key={language.locale}
          onClick={() => setLocale(language.locale)}
          title={language.label}
          type="button"
        >
          <span aria-hidden="true">{language.flag}</span>
          <span className="visually-hidden">{language.label}</span>
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher
