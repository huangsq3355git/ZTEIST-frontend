import { useEffect, useState } from 'react'
import { t, type Lang } from '../i18n'
import { MEMBER_TYPE_LABEL, PAID_TIER_LABEL, SUPPLY_CATEGORIES, PROJECT_CATEGORIES } from '../constants'
import CountrySelect from './CountrySelect'
import ProfileEdit from './ProfileEdit'

interface Country {
  code: string
  name_zh: string
  name_en: string
  region: string
}

export default function Account({ lang }: { lang: Lang }) {
  const i = t(lang)
  const [memberType, setMemberType] = useState('')
  const [paidTier, setPaidTier] = useState('')
  const [me, setMe] = useState<any>(null)
  const [showEdit, setShowEdit] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [shareCode, setShareCode] = useState('')
  const [posts, setPosts] = useState<any[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState('')
  const [tab, setTab] = useState<'supply_demand' | 'job' | 'project'>('supply_demand')

  const [sdType, setSdType] = useState('')
  const [sdCategory, setSdCategory] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [country, setCountry] = useState('')
  const [role, setRole] = useState('')
  const [requirements, setRequirements] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')

  const token = () => localStorage.getItem('zteist_token')

  const shareLink = shareCode ? `https://zteist.com/${lang === 'en' ? 'en' : 'zh'}/i/${shareCode}` : ''
  const contactHref = lang === 'en' ? '/en/contact/' : '/zh/contact/'

  function copyText(text: string, key: string) {
    if (!text) return
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(''), 2000)
    }).catch(() => {})
  }

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('welcome') === '1') setShowWelcome(true)
    fetch('/api/countries')
      .then((r) => r.json())
      .then((c: Country[]) => setCountries(c))
      .catch(() => {})
    load()
  }, [])

  async function load() {
    const t = token()
    if (!t) return
    const headers = { Authorization: `Bearer ${t}` }
    fetch('/api/member/me', { headers })
      .then((r) => r.json())
      .then((m) => {
        setMe(m)
        setMemberType(m?.member_type || '')
        setPaidTier(m?.paid_tier || '')
      })
      .catch(() => {})
    fetch('/api/invite/generate', { headers })
      .then((r) => r.json())
      .then((d) => setShareCode(d?.code || ''))
      .catch(() => {})
    fetch('/api/me/posts', { headers })
      .then((r) => r.json())
      .then((d) => setPosts(Array.isArray(d) ? d : []))
      .catch(() => {})
  }

  async function publish() {
    const t = token()
    if (!t) {
      setError(i.loginRequired)
      return
    }
    if (!title.trim()) {
      setError(i.title + ' *')
      return
    }
    setBusy(true)
    setError('')
    const body: any = { kind: tab, title, country, lang }
    if (tab === 'supply_demand') {
      body.type = sdType
      body.category = sdCategory
      body.content = content
    }
    if (tab === 'job') {
      body.role = role
      body.requirements = requirements
    }
    if (tab === 'project') {
      body.category = category
      body.description = description
      body.budget = budget
      body.timeline = timeline
    }
    try {
      const r = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify(body),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d?.error ?? '')
      setTitle('')
      setContent('')
      setRole('')
      setRequirements('')
      setDescription('')
      setBudget('')
      setTimeline('')
      await load()
    } catch (e) {
      setError((e as Error).message || i.error)
    } finally {
      setBusy(false)
    }
  }

  async function closePost(kind: string, id: number) {
    const t = token()
    if (!t) return
    const r = await fetch('/api/post/close', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
      body: JSON.stringify({ kind, id }),
    })
    if (r.ok) await load()
  }

  function logout() {
    localStorage.removeItem('zteist_token')
    window.location.href = lang === 'en' ? '/en/' : '/'
  }

  async function checkout(tier: string) {
    const t = token()
    if (!t) {
      setError(i.loginRequired)
      return
    }
    setBusy(true)
    setError('')
    try {
      const r = await fetch('/api/membership/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify({ tier, currency: lang === 'en' ? 'usd' : 'cny' }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d?.error || i.error)
      if (d.url) window.location.href = d.url
      else throw new Error(i.error)
    } catch (e) {
      setError((e as Error).message || i.error)
    } finally {
      setBusy(false)
    }
  }

  const input =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zte-blue'
  const label = 'block text-sm font-medium mb-1 text-zte-navy'

  const kindLabel = (k: string) => (k === 'supply_demand' ? i.supplyDemand : k === 'job' ? i.jobs : i.projects)

  const memberTypeLabel = () => {
    const l = MEMBER_TYPE_LABEL[memberType]
    return l ? (lang === 'zh' ? l.zh : l.en) : memberType
  }

  const paidTierLabel = () => {
    const l = PAID_TIER_LABEL[paidTier]
    return l ? (lang === 'zh' ? l.zh : l.en) : ''
  }

  const tiers =
    lang === 'zh'
      ? [
          { name: '观察期', price: '免费', benefits: ['浏览基础信息'] },
          { name: '认证会员', price: '免费（推荐认证）', benefits: ['全量检索', '发布信息', '联系方式可见'] },
          { name: '支持会员', price: '99 元/年', benefits: ['支持者徽章', '发布信息优先曝光', '高级检索（完整结果）', '主动联系更多会员', '线下活动优先报名'] },
          { name: '企业会员', price: '1999 元/年（定制另议）', benefits: ['发布需求', '检索人才', '基础对接'] },
        ]
      : [
          { name: 'Trial', price: 'Free', benefits: ['Basic browsing'] },
          { name: 'Verified Member', price: 'Free (by referral)', benefits: ['Full search', 'Publish', 'Contact visible'] },
          { name: 'Supporting Member', price: '$14.88/yr', benefits: ['Supporter badge', 'Priority listing for your posts', 'Advanced search (full results)', 'Reach out to more members', 'Priority access to offline events'] },
          { name: 'Enterprise', price: '$299/yr (custom negotiable)', benefits: ['Post needs', 'Search talent', 'Basic matching'] },
        ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zte-navy">{i.memberCenter}</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowEdit(!showEdit)} className="text-sm text-zte-blue hover:opacity-70">{i.editProfile}</button>
          <button onClick={logout} className="text-sm text-zte-red hover:opacity-70">{i.logout}</button>
        </div>
      </div>

      {showWelcome && (
        <div className="bg-zte-blue/5 border border-zte-blue/30 rounded-xl p-5 mb-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-zte-navy">{i.welcomeInvite}</p>
              <p className="text-sm text-gray-600 mt-1">{i.welcomeInviteSub}</p>
              {shareCode && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-gray-500 truncate">{shareLink}</span>
                  <button onClick={() => copyText(shareLink, 'welcomelink')} className="shrink-0 text-xs text-zte-blue border border-zte-blue rounded px-2 py-0.5 hover:opacity-70">
                    {copied === 'welcomelink' ? '✓' : i.copy}
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => setShowWelcome(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none shrink-0" aria-label="close">×</button>
          </div>
        </div>
      )}

      {showEdit && me && (
        <ProfileEdit
          lang={lang}
          member={me}
          countries={countries}
          onSaved={() => {
            setShowEdit(false)
            load()
          }}
        />
      )}

      {/* 我的身份 */}
      <section className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div>
            <span className="text-gray-500">{i.myLevel}：</span>
            <span className="font-semibold text-zte-blue">{memberTypeLabel()}</span>
            {paidTierLabel() && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-zte-blue text-white">{paidTierLabel()}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">{i.shareCode}：</span>
            <span className="font-mono font-semibold text-zte-navy">{shareCode || '—'}</span>
            {shareCode && (
              <button onClick={() => copyText(shareCode, 'code')} className="text-xs text-zte-blue border border-zte-blue rounded px-2 py-0.5 hover:opacity-70">
                {copied === 'code' ? '✓' : i.copy}
              </button>
            )}
          </div>
          {shareCode && (
            <div className="flex items-center gap-2 w-full">
              <span className="text-gray-500 shrink-0">{i.inviteLink}：</span>
              <span className="text-xs text-gray-500 truncate">{shareLink}</span>
              <button onClick={() => copyText(shareLink, 'link')} className="text-xs text-zte-blue border border-zte-blue rounded px-2 py-0.5 hover:opacity-70 shrink-0">
                {copied === 'link' ? '✓' : i.copy}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 会员档位 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-zte-navy mb-3">{lang === 'zh' ? '会员档位' : 'Membership'}</h2>
        <p className="mb-4 text-sm text-gray-600 leading-relaxed">
          {lang === 'zh'
            ? '中友会是非盈利社区，核心功能免费（搜索人脉、发布信息、邀请同事等）。支持会员与企业服务费用仅用于覆盖运营成本，盈余回投社区。'
            : 'ZTEIST is a non-profit community. Core features are free (search, publish, invite, and more). Supporting member and enterprise fees only cover operating costs, with any surplus reinvested.'}
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => (
            <div key={t.name} className="bg-white p-4 rounded-xl shadow-sm border-t-2 border-zte-blue">
              <p className="font-semibold text-zte-navy">{t.name}</p>
              <p className="text-sm text-zte-red font-medium mt-1">{t.price}</p>
              <ul className="mt-2 text-xs text-gray-600 space-y-1">
                {t.benefits.map((b) => (
                  <li key={b}>· {b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => checkout('supporter')}
            disabled={busy}
            className="bg-zte-blue text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {lang === 'zh' ? '升级支持会员（99 元/年）' : 'Upgrade to Supporting Member ($14.88/yr)'}
          </button>
          <button
            onClick={() => checkout('enterprise')}
            disabled={busy}
            className="bg-zte-navy text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {lang === 'zh' ? '升级企业会员（1999 元/年）' : 'Upgrade to Enterprise ($299/yr)'}
          </button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <a href={contactHref} className="block bg-white p-4 rounded-xl shadow-sm border-t-2 border-zte-blue hover:opacity-90">
            <p className="font-semibold text-zte-navy">{lang === 'zh' ? '定制需求？' : 'Custom needs?'}</p>
            <p className="text-sm text-zte-red font-medium mt-1">{lang === 'zh' ? '企业定制 · 海外落地 · 分包对接' : 'Enterprise · Localization · Subcontracting'}</p>
          </a>
          <a href={contactHref} className="block bg-white p-4 rounded-xl shadow-sm border-t-2 border-zte-blue hover:opacity-90">
            <p className="font-semibold text-zte-navy">{lang === 'zh' ? '联系我们' : 'Contact us'}</p>
            <p className="text-sm text-zte-red font-medium mt-1">{lang === 'zh' ? '加入 · 对接 · 建议反馈' : 'Join · Matchmaking · Feedback'}</p>
          </a>
        </div>
      </section>

      {/* 信息发布 */}
      <section className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-zte-navy mb-3">{i.publish}</h2>
        <div className="flex gap-2 mb-4">
          {(['supply_demand', 'job', 'project'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium ${tab === k ? 'bg-zte-blue text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {kindLabel(k)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {tab === 'supply_demand' && (
            <div className="grid grid-cols-2 gap-3">
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
            </div>
          )}

          {tab === 'project' && (
            <div>
              <label className={label}>{i.category}</label>
              <select className={input} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">-</option>
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className={label}>{i.title} *</label>
            <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {tab === 'supply_demand' && (
            <div>
              <label className={label}>{i.description}</label>
              <textarea className={input} rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
          )}

          {tab === 'job' && (
            <>
              <div>
                <label className={label}>{i.role}</label>
                <input className={input} value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
              <div>
                <label className={label}>{i.requirements}</label>
                <textarea className={input} rows={2} value={requirements} onChange={(e) => setRequirements(e.target.value)} />
              </div>
            </>
          )}

          {tab === 'project' && (
            <>
              <div>
                <label className={label}>{i.description}</label>
                <textarea className={input} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>{i.budget}</label>
                  <input className={input} value={budget} onChange={(e) => setBudget(e.target.value)} />
                </div>
                <div>
                  <label className={label}>{i.timeline}</label>
                  <input className={input} value={timeline} onChange={(e) => setTimeline(e.target.value)} />
                </div>
              </div>
            </>
          )}

          <div>
            <label className={label}>{i.country}</label>
            <CountrySelect lang={lang} countries={countries} value={country} onChange={setCountry} placeholder={i.selectCountry} />
          </div>

          {error && <p className="text-sm text-zte-red">{error}</p>}
          <button
            onClick={publish}
            disabled={busy}
            className="bg-zte-blue text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {i.publish}
          </button>
        </div>
      </section>

      {/* 我的发布 */}
      <section className="bg-white p-5 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-zte-navy mb-3">{i.myPosts}</h2>
        {posts.length === 0 && <p className="text-gray-400 text-sm">{i.noResults}</p>}
        <div className="space-y-3">
          {posts.map((p: any) => (
            <div key={p.kind + p.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 shrink-0">{kindLabel(p.kind)}</span>
                <div className="min-w-0">
                  <p className={`font-medium text-zte-navy truncate ${p.status === 'closed' ? 'line-through text-gray-400' : ''}`}>{p.title}</p>
                  {p.country && <p className="text-xs text-gray-500">{p.country}</p>}
                </div>
              </div>
              {p.status !== 'closed' && (
                <button onClick={() => closePost(p.kind, p.id)} className="shrink-0 text-xs text-zte-red hover:opacity-70 px-2 py-1 rounded hover:bg-red-50">
                  {i.close}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
