import { useEffect, useState } from 'react'
import { t, type Lang } from '../i18n'

export default function AuthNav({ lang }: { lang: Lang }) {
  const i = t(lang)
  const [loggedIn, setLoggedIn] = useState(false)
  const prefix = lang === 'en' ? '/en' : '/zh'

  useEffect(() => {
    const check = () => setLoggedIn(!!localStorage.getItem('zteist_token'))
    check()
    window.addEventListener('storage', check)
    return () => window.removeEventListener('storage', check)
  }, [])

  if (loggedIn) {
    return <a href={`${prefix}/account/`} className="hover:text-jade">{i.memberCenter}</a>
  }
  return <a href={`${prefix}/register/`} className="hover:text-jade">{i.login}</a>
}
