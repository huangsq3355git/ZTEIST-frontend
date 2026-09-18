import { useEffect, useState } from 'react'
import { t, type Lang } from '../i18n'

export default function AuthNav({ lang }: { lang: Lang }) {
  const i = t(lang)
  const [loggedIn, setLoggedIn] = useState(false)
  const [initial, setInitial] = useState('Z')
  const prefix = lang === 'en' ? '/en' : '/zh'

  useEffect(() => {
    const check = () => {
      setLoggedIn(!!localStorage.getItem('zteist_token'))
      const name = localStorage.getItem('zteist_name') || ''
      setInitial((name.charAt(0) || 'Z').toUpperCase())
    }
    check()
    window.addEventListener('storage', check)
    return () => window.removeEventListener('storage', check)
  }, [])

  if (loggedIn) {
    return (
      <a
        href={`${prefix}/account/`}
        title={i.memberCenter}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-jade text-sm font-semibold text-ink"
      >
        {initial}
      </a>
    )
  }
  return <a href={`${prefix}/register/`} className="hover:text-jade">{i.login}</a>
}
