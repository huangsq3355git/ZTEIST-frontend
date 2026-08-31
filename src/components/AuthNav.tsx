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

  function logout() {
    localStorage.removeItem('zteist_token')
    setLoggedIn(false)
    window.location.href = `${prefix}/`
  }

  if (loggedIn) {
    return (
      <>
        <a href={`${prefix}/account/`} className="hover:text-jade">{i.memberCenter}</a>
        <span className="text-paper/25">|</span>
        <button onClick={logout} className="hover:text-jade">{i.logout}</button>
      </>
    )
  }
  return <a href={`${prefix}/register/`} className="hover:text-jade">{i.login}</a>
}
