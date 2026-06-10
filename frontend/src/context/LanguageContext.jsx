import { createContext, useContext, useState } from 'react'
import { translations } from '../i18n'

const Ctx = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lq_lang') || 'en')

  const toggle = () => {
    const next = lang === 'en' ? 'ko' : 'en'
    setLang(next)
    localStorage.setItem('lq_lang', next)
  }

  return (
    <Ctx.Provider value={{ lang, toggle, t: translations[lang] }}>
      {children}
    </Ctx.Provider>
  )
}

export const useLang = () => useContext(Ctx)
