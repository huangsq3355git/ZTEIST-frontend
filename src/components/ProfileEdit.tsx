import { useState } from 'react'
import { t, type Lang } from '../i18n'
import { PRODUCT_LINES, TECH_DOMAINS, INDUSTRIES, EMPLOYMENT_STATUSES } from '../constants'
import CountrySelect from './CountrySelect'
import CountryMultiSelect from './CountryMultiSelect'

interface Country {
  code: string
  name_zh: string
  name_en: string
  region: string
}

/** 编辑自己的档案：预填当前值，保存后回调 onSaved。 */
export default function ProfileEdit({
  lang,
  member,
  countries,
  onSaved,
}: {
  lang: Lang
  member: any
  countries: Country[]
  onSaved: () => void
}) {
  const i = t(lang)
  const [name, setName] = useState(member.name || '')
  const [nameEn, setNameEn] = useState(member.name_en || '')
  const [country, setCountry] = useState(member.country || '')
  const [province, setProvince] = useState(member.province || '')
  const [eraStart, setEraStart] = useState(member.era_start ? String(member.era_start) : '')
  const [eraEnd, setEraEnd] = useState(member.era_end ? String(member.era_end) : '')
  const [productLine, setProductLine] = useState(member.product_line || '')
  const [role, setRole] = useState(member.role || '')
  const [techDomain, setTechDomain] = useState(member.tech_domain || '')
  const [industry, setIndustry] = useState(member.industry || '')
  const [employmentStatus, setEmploymentStatus] = useState(member.employment_status || '')
  const [department, setDepartment] = useState(member.department || '')
  const [level, setLevel] = useState(member.level || '')
  const [residenceCountries, setResidenceCountries] = useState<string[]>(
    member.residence_countries ? member.residence_countries.split(',').filter(Boolean) : []
  )
  const [wechat, setWechat] = useState(member.wechat || '')
  const [linkedin, setLinkedin] = useState(member.linkedin || '')
  const [whatsapp, setWhatsapp] = useState(member.whatsapp || '')
  const [phone, setPhone] = useState(member.phone || '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const input =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zte-blue'
  const label = 'block text-sm font-medium mb-1 text-zte-navy'

  async function save() {
    if (!name.trim() || !country) {
      setError(i.error)
      return
    }
    setBusy(true)
    setError('')
    try {
      const token = localStorage.getItem('zteist_token')
      const r = await fetch('/api/member/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name,
          nameEn,
          country,
          province,
          residenceCountries,
          eraStart: eraStart ? Number(eraStart) : null,
          eraEnd: eraEnd ? Number(eraEnd) : null,
          productLine,
          role,
          techDomain,
          industry,
          employmentStatus,
          department,
          level,
          wechat,
          linkedin,
          whatsapp,
          phone,
        }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d?.error || i.error)
      onSaved()
    } catch (e) {
      setError((e as Error).message || i.error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
      <h2 className="text-lg font-semibold text-zte-navy mb-4">{i.editProfile}</h2>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>{i.name} *</label>
            <input className={input} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className={label}>{i.nameEn}</label>
            <input className={input} value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={label}>{i.country} *</label>
          <CountrySelect lang={lang} countries={countries} value={country} onChange={setCountry} placeholder={i.selectCountry} />
        </div>
        <div>
          <label className={label}>{i.residenceCountries}</label>
          <CountryMultiSelect lang={lang} countries={countries} value={residenceCountries} onChange={setResidenceCountries} placeholder={i.selectCountry} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>{i.province}</label>
            <input className={input} value={province} onChange={(e) => setProvince(e.target.value)} />
          </div>
          <div>
            <label className={label}>{i.level}</label>
            <input className={input} value={level} onChange={(e) => setLevel(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>{i.eraStart}</label>
            <input className={input} type="number" value={eraStart} onChange={(e) => setEraStart(e.target.value)} placeholder="2010" />
          </div>
          <div>
            <label className={label}>{i.eraEnd}</label>
            <input className={input} type="number" value={eraEnd} onChange={(e) => setEraEnd(e.target.value)} placeholder="2015" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
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
            <label className={label}>{i.role}</label>
            <input className={input} value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
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
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>{i.department}</label>
            <input className={input} value={department} onChange={(e) => setDepartment(e.target.value)} />
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
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>{i.wechat}</label>
            <input className={input} value={wechat} onChange={(e) => setWechat(e.target.value)} />
          </div>
          <div>
            <label className={label}>{i.phone}</label>
            <input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>{i.linkedin}</label>
            <input className={input} value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
          </div>
          <div>
            <label className={label}>{i.whatsapp}</label>
            <input className={input} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </div>
        </div>
        {error && <p className="text-sm text-zte-red">{error}</p>}
        <button
          onClick={save}
          disabled={busy}
          className="bg-zte-blue text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
        >
          {i.save}
        </button>
      </div>
    </div>
  )
}
