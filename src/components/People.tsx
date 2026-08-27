import { useEffect, useState } from 'react'
import { t, type Lang } from '../i18n'
import { PRODUCT_LINES, TECH_DOMAINS, INDUSTRIES, EMPLOYMENT_STATUSES, MEMBER_TYPE_LABEL } from '../constants'

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
  province: string | null
  era_start: number | null
  era_end: number | null
  product_line: string | null
  role: string | null
  tech_domain: string | null
  department: string | null
  industry: string | null
  employment_status: string | null
  level: string | null
  member_type: string
}

export default function People({ lang }: { lang: Lang }) {
  const i = t(lang)
  const [countries, setCountries] = useState<Country[]>([])
  const [country, setCountry] = useState('')
  const [province, setProvince] = useState('')
  const [productLine, setProductLine] = useState('')
  const [techDomain, setTechDomain] = useState('')
  const [industry, setIndustry] = useState('')
  const [employmentStatus, setEmploymentStatus] = useState('')
  const [eraStart, setEraStart] = useState('')
  const [eraEnd, setEraEnd] = useState('')
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

  // 所在地：国内(CN)显示省份，海外显示国家
  const location = (m: PublicMember) =>
    m.country === 'CN' ? m.province || countryName('CN') : countryName(m.country)

  const memberBadge = (mt: string) => {
    const l = MEMBER_TYPE_LABEL[mt]
    return l ? (lang === 'zh' ? l.zh : l.en) : mt
  }

  async function search() {
    const token = localStorage.getItem('zteist_token')
    if (!token) {
      setError(i.loginRequired)
      return
    }
    setBusy(true)
    setError('')
    const params = new URLSearchParams()
    if (country) params.set('country', country)
    if (province) params.set('province', province)
    if (productLine) params.set('productLine', productLine)
    if (techDomain) params.set('techDomain', techDomain)
    if (industry) params.set('industry', industry)
    if (employmentStatus) params.set('employmentStatus', employmentStatus)
    if (eraStart) params.set('eraStart', eraStart)
    if (eraEnd) params.set('eraEnd', eraEnd)
    try {
      const r = await fetch(`/api/people?${params.toString()}`, {
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

  function reset() {
    setCountry('')
    setProvince('')
    setProductLine('')
    setTechDomain('')
    setIndustry('')
    setEmploymentStatus('')
    setEraStart('')
    setEraEnd('')
  }

  const input =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zte-blue'
  const label = 'block text-sm font-medium mb-1 text-zte-navy'

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-zte-navy">{i.searchTitle}</h1>

      {/* 筛选 */}
      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <p className="text-sm font-semibold text-zte-navy mb-3">{i.filter}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className={label}>{i.country}</label>
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
            <label className={label}>{i.province}</label>
            <input className={input} value={province} onChange={(e) => setProvince(e.target.value)} placeholder="广东" />
          </div>
          <div>
            <label className={label}>{i.productLine}</label>
            <select className={input} value={productLine} onChange={(e) => setProductLine(e.target.value)}>
              <option value="">-</option>
              {PRODUCT_LINES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>{i.techDomain}</label>
            <select className={input} value={techDomain} onChange={(e) => setTechDomain(e.target.value)}>
              <option value="">-</option>
              {TECH_DOMAINS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>{i.industry}</label>
            <select className={input} value={industry} onChange={(e) => setIndustry(e.target.value)}>
              <option value="">-</option>
              {INDUSTRIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>{i.employmentStatus}</label>
            <select className={input} value={employmentStatus} onChange={(e) => setEmploymentStatus(e.target.value)}>
              <option value="">-</option>
              {EMPLOYMENT_STATUSES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>{i.eraStart}</label>
            <input className={input} type="number" value={eraStart} onChange={(e) => setEraStart(e.target.value)} placeholder="2010" />
          </div>
          <div>
            <label className={label}>{i.eraEnd}</label>
            <input className={input} type="number" value={eraEnd} onChange={(e) => setEraEnd(e.target.value)} placeholder="2015" />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={search}
            disabled={busy}
            className="bg-zte-blue text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {i.search}
          </button>
          <button onClick={reset} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-200">
            {i.reset}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-zte-red">{error}</p>}
      </div>

      {/* 结果 */}
      {results !== null && (
        <div>
          <p className="text-sm text-gray-500 mb-3">
            {i.results}: {results.length}
          </p>
          {results.length === 0 && <p className="text-gray-400">{i.noResults}</p>}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {results.map((m) => (
              <div key={m.id} className="bg-white p-4 rounded-xl shadow-sm" style={{ borderTop: '3px solid #008ED3' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-zte-navy">{m.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      m.member_type === 'member' || m.member_type === 'expert'
                        ? 'bg-zte-blue text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {memberBadge(m.member_type)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {m.name_en && <p className="text-gray-500">{m.name_en}</p>}
                  <p>📍 {location(m)}</p>
                  {(m.era_start || m.era_end) && (
                    <p>🕐 {m.era_start}{m.era_end ? `–${m.era_end}` : '–'}</p>
                  )}
                  {m.product_line && <p>{i.productLine}: {m.product_line}</p>}
                  {m.role && <p>{i.role}: {m.role}</p>}
                  {m.tech_domain && <p>{i.techDomain}: {m.tech_domain}</p>}
                  {m.industry && <p>{i.industry}: {m.industry}</p>}
                  {m.level && <p>{i.level}: {m.level}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
