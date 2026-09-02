import { useEffect, useState } from 'react'
import { t, type Lang } from '../i18n'
import { SUPPLY_CATEGORIES } from '../constants'

interface Country {
  code: string
  name_zh: string
  name_en: string
  region: string
}

export default function Market({ lang }: { lang: Lang }) {
  const i = t(lang)
  const [tab, setTab] = useState<'sd' | 'jobs'>('sd')
  const [countries, setCountries] = useState<Country[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [sdType, setSdType] = useState('')
  const [sdCategory, setSdCategory] = useState('')
  const [sdCountry, setSdCountry] = useState('')
  const [sdList, setSdList] = useState<any[] | null>(null)
  const [jobRole, setJobRole] = useState('')
  const [jobCountry, setJobCountry] = useState('')
  const [jobList, setJobList] = useState<any[] | null>(null)

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

  async function get(path: string, params: URLSearchParams) {
    const t = localStorage.getItem('zteist_token')
    if (!t) {
      setError(i.loginRequired)
      return null
    }
    setBusy(true)
    setError('')
    try {
      const r = await fetch(`${path}?${params}`, { headers: { Authorization: `Bearer ${t}` } })
      const d = await r.json()
      if (!r.ok) throw new Error()
      return d
    } catch {
      setError(i.error)
      return null
    } finally {
      setBusy(false)
    }
  }

  async function searchSd() {
    const p = new URLSearchParams()
    if (sdType) p.set('type', sdType)
    if (sdCategory) p.set('category', sdCategory)
    if (sdCountry) p.set('country', sdCountry)
    p.set('lang', lang)
    const d = await get('/api/supply-demand', p)
    if (d) setSdList(d)
  }

  async function searchJobs() {
    const p = new URLSearchParams()
    if (jobRole) p.set('role', jobRole)
    if (jobCountry) p.set('country', jobCountry)
    p.set('lang', lang)
    const d = await get('/api/jobs', p)
    if (d) setJobList(d)
  }

  const input =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zte-blue'
  const label = 'block text-sm font-medium mb-1 text-zte-navy'

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-zte-navy">{i.supplyDemand}</h1>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab('sd')}
          className={`px-5 py-2 rounded-lg font-medium ${tab === 'sd' ? 'bg-zte-blue text-white' : 'bg-white text-gray-600'}`}
        >
          {i.supplyDemand}
        </button>
        <button
          onClick={() => setTab('jobs')}
          className={`px-5 py-2 rounded-lg font-medium ${tab === 'jobs' ? 'bg-zte-blue text-white' : 'bg-white text-gray-600'}`}
        >
          {i.jobs}
        </button>
      </div>

      {tab === 'sd' && (
        <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className={label}>{i.supply} / {i.demand}</label>
              <select className={input} value={sdType} onChange={(e) => setSdType(e.target.value)}>
                <option value="">-</option>
                <option value="supply">{i.supply}</option>
                <option value="demand">{i.demand}</option>
              </select>
            </div>
            <div>
              <label className={label}>{i.category}</label>
              <select className={input} value={sdCategory} onChange={(e) => setSdCategory(e.target.value)}>
                <option value="">-</option>
                {SUPPLY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>{i.country}</label>
              <select className={input} value={sdCountry} onChange={(e) => setSdCountry(e.target.value)}>
                <option value="">-</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{lang === 'zh' ? c.name_zh : c.name_en}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={searchSd}
            disabled={busy}
            className="mt-4 bg-zte-blue text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {i.search}
          </button>
          {error && <p className="mt-3 text-sm text-zte-red">{error}</p>}

          {sdList !== null && (
            <div className="mt-5 space-y-3">
              <p className="text-sm text-gray-500">{i.results}: {sdList.length}</p>
              {sdList.length === 0 && <p className="text-gray-400">{i.noResults}</p>}
              {sdList.map((m: any) => (
                <div key={m.id} className="p-4 rounded-xl border border-gray-100" style={{ borderLeft: '3px solid #008ED3' }}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded ${m.type === 'supply' ? 'bg-zte-blue text-white' : 'bg-zte-red text-white'}`}>
                      {m.type === 'supply' ? i.supply : i.demand}
                    </span>
                    {m.country && <span className="text-xs text-gray-500">{cname(m.country)}</span>}
                  </div>
                  <p className="font-semibold text-zte-navy mt-2">{m.title}</p>
                  {m.content && <p className="text-sm text-gray-600 mt-1">{m.content}</p>}
                  {m.category && <p className="text-xs text-gray-400 mt-1">{i.category}: {m.category}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'jobs' && (
        <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>{i.role}</label>
              <input className={input} value={jobRole} onChange={(e) => setJobRole(e.target.value)} placeholder="研发 / 市场 / ..." />
            </div>
            <div>
              <label className={label}>{i.country}</label>
              <select className={input} value={jobCountry} onChange={(e) => setJobCountry(e.target.value)}>
                <option value="">-</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{lang === 'zh' ? c.name_zh : c.name_en}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={searchJobs}
            disabled={busy}
            className="mt-4 bg-zte-blue text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {i.search}
          </button>
          {error && <p className="mt-3 text-sm text-zte-red">{error}</p>}

          {jobList !== null && (
            <div className="mt-5 space-y-3">
              <p className="text-sm text-gray-500">{i.results}: {jobList.length}</p>
              {jobList.length === 0 && <p className="text-gray-400">{i.noResults}</p>}
              {jobList.map((m: any) => (
                <div key={m.id} className="p-4 rounded-xl border border-gray-100" style={{ borderLeft: '3px solid #2B333F' }}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zte-navy">{m.title}</span>
                    {m.country && <span className="text-xs text-gray-500">{cname(m.country)}</span>}
                  </div>
                  {m.role && <p className="text-sm text-gray-600 mt-1">{i.role}: {m.role}</p>}
                  {m.requirements && <p className="text-sm text-gray-600 mt-1">{m.requirements}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
