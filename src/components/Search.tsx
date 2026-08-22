import { useEffect, useState } from 'react'
import { t, type Lang } from '../i18n'

interface Country {
  code: string
  name_zh: string
  name_en: string
  region: string
}

interface PublicMember {
  id: number
  name: string
  name_en: string | null
  country: string
  era_start: number | null
  era_end: number | null
  product_line: string | null
  role: string | null
  tech_domain: string | null
  department: string | null
}

export default function Search({ lang }: { lang: Lang }) {
  const i = t(lang)
  const [countries, setCountries] = useState<Country[]>([])
  const [country, setCountry] = useState('')
  const [eraStart, setEraStart] = useState('')
  const [eraEnd, setEraEnd] = useState('')
  const [productLine, setProductLine] = useState('')
  const [role, setRole] = useState('')
  const [results, setResults] = useState<PublicMember[] | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch('/api/countries')
      .then((r) => r.json())
      .then((c: Country[]) => setCountries(c))
      .catch(() => {})
  }, [])

  const countryName = (code: string) => {
    const c = countries.find((x) => x.code === code)
    return c ? (lang === 'zh' ? c.name_zh : c.name_en) : code
  }

  async function doSearch() {
    const token = localStorage.getItem('zteist_token')
    if (!token) {
      setError(i.verifyLogin)
      return
    }
    setBusy(true)
    setError('')
    const params = new URLSearchParams()
    if (country) params.set('country', country)
    if (eraStart) params.set('eraStart', eraStart)
    if (eraEnd) params.set('eraEnd', eraEnd)
    if (productLine) params.set('productLine', productLine)
    if (role) params.set('role', role)
    try {
      const r = await fetch(`/api/search?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await r.json()
      if (!r.ok) throw new Error()
      setResults(data)
    } catch {
      setError(i.error)
    } finally {
      setBusy(false)
    }
  }

  const input =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">{i.searchTitle}</h1>

        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">{i.country}</label>
              <select className={input} value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">{i.selectCountry}</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {lang === 'zh' ? c.name_zh : c.name_en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{i.eraStart}</label>
              <input className={input} type="number" value={eraStart} onChange={(e) => setEraStart(e.target.value)} placeholder="2010" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{i.eraEnd}</label>
              <input className={input} type="number" value={eraEnd} onChange={(e) => setEraEnd(e.target.value)} placeholder="2015" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{i.productLine}</label>
              <input className={input} value={productLine} onChange={(e) => setProductLine(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{i.role}</label>
              <input className={input} value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50" onClick={doSearch} disabled={busy}>
            {i.search}
          </button>
        </div>

        {results !== null && (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-gray-500">
              {i.results}: {results.length}
            </p>
            {results.length === 0 && <p className="text-gray-400">{i.noResults}</p>}
            {results.map((m) => (
              <div key={m.id} className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-baseline justify-between">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-sm text-gray-500">{countryName(m.country)}</span>
                </div>
                <div className="mt-1 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                  {m.era_start && (
                    <span>
                      {m.era_start}
                      {m.era_end ? `–${m.era_end}` : '–'}
                    </span>
                  )}
                  {m.product_line && <span>{m.product_line}</span>}
                  {m.role && <span>{m.role}</span>}
                  {m.tech_domain && <span>{m.tech_domain}</span>}
                  {m.department && <span>{m.department}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
