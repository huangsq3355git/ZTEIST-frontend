import { useEffect, useState } from 'react'
import { t, type Lang } from '../i18n'

interface Country {
  code: string
  name_zh: string
  name_en: string
  region: string
}

const GOOGLE_CLIENT_ID = '131039918276-gd9jgjqkj8nnam4i2340b0qju90h8a37.apps.googleusercontent.com'

export default function Register({ lang }: { lang: Lang }) {
  const i = t(lang)
  const [step, setStep] = useState<'login' | 'profile' | 'done'>('login')
  const [token, setToken] = useState('')
  const [countries, setCountries] = useState<Country[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loginMethod, setLoginMethod] = useState<'email' | 'nickname'>('email')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')

  const [name, setName] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [country, setCountry] = useState('')
  const [eraStart, setEraStart] = useState('')
  const [eraEnd, setEraEnd] = useState('')
  const [productLine, setProductLine] = useState('')
  const [role, setRole] = useState('')
  const [techDomain, setTechDomain] = useState('')
  const [department, setDepartment] = useState('')
  const [level, setLevel] = useState('')
  const [wechat, setWechat] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [phone, setPhone] = useState('')
  const [inviteCode, setInviteCode] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setInviteCode(params.get('code') ?? '')
    fetch('/api/countries')
      .then((r) => r.json())
      .then((c: Country[]) => setCountries(c))
      .catch(() => {})
  }, [])

  // Google 一键登录
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') return
    const w = window as any
    if (w.google) { initGoogle(w); return }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => initGoogle(window as any)
    document.head.appendChild(script)
  }, [])

  function initGoogle(w: any) {
    w.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
    })
    const btn = document.getElementById('google-btn')
    if (btn) w.google.accounts.id.renderButton(btn, { theme: 'outline', size: 'large' })
  }

  function handleGoogleCredential(response: any) {
    fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: response.credential }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.token) {
          setToken(data.token)
          localStorage.setItem('zteist_token', data.token)
          setStep('profile')
        } else {
          setError(i.error)
        }
      })
      .catch(() => setError(i.error))
  }

  async function sendCode() {
    if (!email.trim()) return
    setBusy(true)
    setError('')
    setSent(false)
    try {
      const r = await fetch('/api/auth/issue-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!r.ok) throw new Error()
      setSent(true)
    } catch {
      setError(i.error)
    } finally {
      setBusy(false)
    }
  }

  async function verify() {
    setBusy(true)
    setError('')
    try {
      const r = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: code.trim() }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data?.error ?? '')
      setToken(data.token)
      localStorage.setItem('zteist_token', data.token)
      setStep('profile')
    } catch {
      setError(i.error)
    } finally {
      setBusy(false)
    }
  }

  async function nicknameLogin() {
    if (!nickname.trim() || !password) return
    setBusy(true)
    setError('')
    try {
      // 先尝试注册，昵称已存在则回退登录
      let r = await fetch('/api/auth/register-nickname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim(), password }),
      })
      if (r.status === 400) {
        r = await fetch('/api/auth/login-nickname', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname: nickname.trim(), password }),
        })
      }
      const data = await r.json()
      if (!r.ok) throw new Error(data?.error ?? '')
      setToken(data.token)
      localStorage.setItem('zteist_token', data.token)
      setStep('profile')
    } catch {
      setError(i.error)
    } finally {
      setBusy(false)
    }
  }

  async function submitProfile() {
    setBusy(true)
    setError('')
    try {
      const r = await fetch('/api/member/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name,
          nameEn,
          country,
          eraStart: eraStart ? Number(eraStart) : null,
          eraEnd: eraEnd ? Number(eraEnd) : null,
          productLine,
          role,
          techDomain,
          department,
          level,
          wechat,
          linkedin,
          whatsapp,
          phone,
          inviteCode,
        }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data?.error ?? i.error)
      setStep('done')
    } catch (e) {
      setError((e as Error).message || i.error)
    } finally {
      setBusy(false)
    }
  }

  const input =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zte-blue'

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">{i.registerTitle}</h1>

        {step === 'login' && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${loginMethod === 'email' ? 'bg-zte-blue text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {i.email}
              </button>
              <button
                onClick={() => setLoginMethod('nickname')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${loginMethod === 'nickname' ? 'bg-zte-blue text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {i.nickname}
              </button>
            </div>

            {loginMethod === 'email' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{i.email}</label>
                  <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="flex gap-2">
                  <input className={input} value={code} onChange={(e) => setCode(e.target.value)} placeholder={i.code} />
                  <button className="shrink-0 px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 disabled:opacity-50" onClick={sendCode} disabled={busy}>
                    {i.sendCode}
                  </button>
                </div>
                {sent && <p className="text-sm text-green-600">✓ {i.success}</p>}
                <button className="w-full bg-zte-blue text-white py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50" onClick={verify} disabled={busy}>
                  {i.verifyLogin}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{i.nickname}</label>
                  <input className={input} value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{i.password}</label>
                  <input className={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="..." />
                </div>
                <button className="w-full bg-zte-blue text-white py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50" onClick={nicknameLogin} disabled={busy}>
                  {i.login}
                </button>
              </div>
            )}

            {GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID' && (
              <div className="mt-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-xs text-gray-400">{i.or}</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                <div id="google-btn" className="flex justify-center"></div>
              </div>
            )}
          </div>
        )}

        {step === 'profile' && (
          <div className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
            <div>
              <label className="block text-sm font-medium mb-1">{i.name} *</label>
              <input className={input} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{i.nameEn}</label>
              <input className={input} value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{i.country} *</label>
              <select className={input} value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">{i.selectCountry}</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {lang === 'zh' ? c.name_zh : c.name_en}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">{i.eraStart}</label>
                <input className={input} type="number" value={eraStart} onChange={(e) => setEraStart(e.target.value)} placeholder="2010" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{i.eraEnd}</label>
                <input className={input} type="number" value={eraEnd} onChange={(e) => setEraEnd(e.target.value)} placeholder="2015" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">{i.productLine}</label>
                <input className={input} value={productLine} onChange={(e) => setProductLine(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{i.role}</label>
                <input className={input} value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">{i.techDomain}</label>
                <input className={input} value={techDomain} onChange={(e) => setTechDomain(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{i.department}</label>
                <input className={input} value={department} onChange={(e) => setDepartment(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{i.level}</label>
              <input className={input} value={level} onChange={(e) => setLevel(e.target.value)} />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm font-medium mb-2">{i.contactInfo}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">{i.wechat}</label>
                  <input className={input} value={wechat} onChange={(e) => setWechat(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm mb-1">{i.linkedin}</label>
                  <input className={input} value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm mb-1">{i.whatsapp}</label>
                  <input className={input} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm mb-1">{i.phone}</label>
                  <input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            <button className="w-full bg-zte-blue text-white py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50" onClick={submitProfile} disabled={busy}>
              {i.submit}
            </button>
          </div>
        )}

        {step === 'done' && (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <p className="text-lg font-medium mb-4">✓ {i.success}</p>
            <a href={`/${lang}/search`} className="text-zte-blue hover:underline">
              {i.searchTitle} →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
