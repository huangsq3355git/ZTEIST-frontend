import { useEffect, useState } from 'react'
import { t, type Lang } from '../i18n'
import { PROJECT_CATEGORIES } from '../constants'

interface Country {
  code: string
  name_zh: string
  name_en: string
  region: string
}

export default function Projects({ lang }: { lang: Lang }) {
  const i = t(lang)
  const [countries, setCountries] = useState<Country[]>([])
  const [category, setCategory] = useState('')
  const [country, setCountry] = useState('')
  const [list, setList] = useState<any[] | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch('/api/countries')
      .then((r) => r.json())
      .then(setCountries)
      .catch(() => {})
  }, [])

  const cname = (code: string) => {
    const c = countries.find((x) => x.code === code)
    return c ? (lang === 'zh' ? c.name_zh : c.name_en) : code
  }

  async function search() {
    const t = localStorage.getItem('zteist_token')
    if (!t) {
      setError(i.loginRequired)
      return
    }
    setBusy(true)
    setError('')
    const p = new URLSearchParams()
    if (category) p.set('category', category)
    if (country) p.set('country', country)
    p.set('lang', lang)
    try {
      const r = await fetch(`/api/projects?${p}`, { headers: { Authorization: `Bearer ${t}` } })
      const d = await r.json()
      if (!r.ok) throw new Error()
      setList(d)
    } catch {
      setError(i.error)
    } finally {
      setBusy(false)
    }
  }

  const input =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zte-blue'
  const label = 'block text-sm font-medium mb-1 text-zte-navy'

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-zte-navy">{i.projects}</h1>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>{i.category}</label>
            <select className={input} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">-</option>
              {PROJECT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>{i.country}</label>
            <select className={input} value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="">-</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>{lang === 'zh' ? c.name_zh : c.name_en}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={search}
          disabled={busy}
          className="mt-4 bg-zte-blue text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
        >
          {i.search}
        </button>
        {error && <p className="mt-3 text-sm text-zte-red">{error}</p>}

        {list !== null && (
          <div className="mt-5 space-y-3">
            <p className="text-sm text-gray-500">{i.results}: {list.length}</p>
            {list.length === 0 && <p className="text-gray-400">{i.noResults}</p>}
            {list.map((m: any) => (
              <div key={m.id} className="p-4 rounded-xl border border-gray-100" style={{ borderLeft: '3px solid #008ED3' }}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zte-navy">{m.title}</span>
                  {m.country && <span className="text-xs text-gray-500">{cname(m.country)}</span>}
                </div>
                {m.category && (
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 mt-1 inline-block">{m.category}</span>
                )}
                {m.description && <p className="text-sm text-gray-600 mt-1">{m.description}</p>}
                {(m.budget || m.timeline) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {m.budget && `${i.budget}: ${m.budget}`}
                    {m.budget && m.timeline && ' · '}
                    {m.timeline && `${i.timeline}: ${m.timeline}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
