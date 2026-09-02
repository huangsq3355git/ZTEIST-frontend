import { useEffect, useRef, useState } from 'react'

interface Message {
  role: 'user' | 'ai'
  text: string
  link?: { href: string; label: string }
}

// 确定性引导问答：关键词 → 短回答 + 跳转链接（0 token）
function matchGuide(q: string, isZh: boolean): { reply: string; link: { href: string; label: string } } | null {
  const lower = q.toLowerCase()
  const p = isZh ? '/zh' : '/en'
  const guides = [
    {
      kw: ['加入', '注册', '怎么进', 'join', 'register', 'sign up', 'enroll'],
      reply: isZh ? '在 ZTE 或国内外子公司工作过即可加入。' : 'Anyone who has worked at ZTE or its subsidiaries can join.',
      link: { href: `${p}/join/`, label: isZh ? '去加入 →' : 'Join →' },
    },
    {
      kw: ['找人', '搜人', '老同事', '同事', 'find', 'search', 'colleague'],
      reply: isZh ? '按国家、产品线、年代、岗位等标签搜索。' : 'Search by country, product line, era, role, and more.',
      link: { href: `${p}/people/`, label: isZh ? '去人员页 →' : 'People →' },
    },
    {
      kw: ['发布', '供求', '招聘', '项目', 'post', 'publish', 'job', 'project', 'supply', 'demand'],
      reply: isZh ? '登录后进入会员中心即可发布。' : 'Log in and publish from the Member Center.',
      link: { href: `${p}/account/`, label: isZh ? '去会员中心 →' : 'Member Center →' },
    },
    {
      kw: ['隐私', '联系方式', '手机', '微信', 'privacy', 'contact info', 'phone', 'wechat'],
      reply: isZh ? '联系方式按分级可见（认证会员、同部门、管理员等）。' : 'Contact information is visible by tier.',
      link: { href: `${p}/privacy/`, label: isZh ? '看隐私政策 →' : 'Privacy →' },
    },
    {
      kw: ['收费', '会员', '免费', '价格', 'fee', 'price', 'member', 'cost', 'paid'],
      reply: isZh ? '核心功能免费；支持会员 99 元/年，企业服务另议。' : 'Core features are free; Supporting Member is ¥99/yr.',
      link: { href: `${p}/account/`, label: isZh ? '看会员档位 →' : 'Membership →' },
    },
    {
      kw: ['联系', '客服', '邮箱', 'contact', 'support', 'email', 'help'],
      reply: isZh ? '邮箱：support@zteist.com' : 'Email: support@zteist.com',
      link: { href: `${p}/contact/`, label: isZh ? '去联系页 →' : 'Contact →' },
    },
    {
      kw: ['是什么', '关于', '介绍', '你是谁', '你叫什么', 'what is', 'about', 'who are'],
      reply: isZh ? '我是小Z 🍀，中友会的小助手。中友会是中兴离职人才的同事录/校友录社区，帮你找老同事、对接资源。' : "I'm Z 🍀, ZTEIST's assistant. ZTEIST is a colleagues-and-alumni community for former ZTE talent — helping you find colleagues and match resources.",
      link: { href: `${p}/about/`, label: isZh ? '关于我们 →' : 'About →' },
    },
  ]
  return guides.find((g) => g.kw.some((k) => lower.includes(k))) || null
}

export default function FloatingZ({ lang, noFloating = false }: { lang: 'zh' | 'en'; noFloating?: boolean }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const endRef = useRef<HTMLDivElement>(null)
  const isZh = lang === 'zh'

  const greeting = isZh ? '嗨，我是小Z 🍀\n连接每一颗闪亮之星。' : "Hi, I'm Z 🍀\nConnecting every shining star."

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('openZ', onOpen)
    return () => window.removeEventListener('openZ', onOpen)
  }, [])

  useEffect(() => {
    if (open && messages.length === 0) setMessages([{ role: 'ai', text: greeting }])
  }, [open])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const q = input.trim()
    if (!q || busy) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: q }])
    setBusy(true)
    try {
      // 1. 确定性引导问答（0 token，命中即答）
      const guide = matchGuide(q, isZh)
      if (guide) {
        setMessages((prev) => [...prev, { role: 'ai', text: guide.reply, link: guide.link }])
        return
      }
      // 2. 人名搜索
      const token = localStorage.getItem('zteist_token')
      if (!token) {
        setMessages((prev) => [...prev, { role: 'ai', text: isZh ? '请先登录 / 注册后再搜索。' : 'Please log in first.' }])
        return
      }
      const r = await fetch(`/api/people?q=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await r.json()
      if (!r.ok) throw new Error()
      if (!Array.isArray(data) || data.length === 0) {
        setMessages((prev) => [...prev, { role: 'ai', text: isZh ? '没有找到匹配的老同事。' : 'No matching colleagues found.' }])
      } else {
        const list = data.map((m: any) => `· ${m.name}${m.country ? `（${m.country}）` : ''}`).join('\n')
        setMessages((prev) => [...prev, { role: 'ai', text: `${isZh ? '找到' : 'Found'} ${data.length} ${isZh ? '位' : 'people'}：\n${list}` }])
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', text: isZh ? '出错了，稍后再试。' : 'Something went wrong.' }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {!noFloating && !open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="小Z"
          className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full shadow-lg border-2 border-jade bg-white overflow-hidden hover:scale-110 transition-transform"
        >
          <img src="/mascot.png?v=3" alt="小Z" className="h-full w-full object-contain" />
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-5 right-5 z-50 flex w-[340px] max-w-[calc(100vw-32px)] flex-col rounded-2xl overflow-hidden shadow-2xl border-2 border-jade"
          style={{ height: '460px', maxHeight: 'calc(100vh - 80px)', background: '#fff' }}
        >
          <div className="flex items-center justify-between px-3 py-2" style={{ background: '#002544' }}>
            <div className="flex items-center gap-2">
              <img src="/mascot.png?v=3" alt="小Z" className="h-7 w-7 object-contain" />
              <span className="text-sm font-semibold" style={{ color: '#39A867' }}>{isZh ? '小Z' : 'Z'}</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-lg" style={{ color: 'rgba(160,177,200,0.7)' }}>✕</button>
          </div>

          <div className="flex-1 overflow-y-auto bg-white px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user' ? 'bg-jade/15 text-gray-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.link && (
                    <a href={m.link.href} className="mt-1.5 inline-block font-medium text-zte-blue underline">
                      {m.link.label}
                    </a>
                  )}
                </div>
              </div>
            ))}
            {busy && <div className="text-xs text-gray-400">…</div>}
            <div ref={endRef} />
          </div>

          <div className="px-3 py-2.5" style={{ background: '#002544', borderTop: '1px solid rgba(57,168,103,0.2)' }}>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={isZh ? '搜：深圳 / 芯片 / 张三' : 'Search: city / chip / name'}
                className="flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#E6EEF7' }}
              />
              <button
                onClick={send}
                disabled={busy}
                className="rounded-xl px-3 py-2.5 text-sm disabled:opacity-50"
                style={{ background: 'rgba(57,168,103,0.2)', color: '#52c081' }}
              >
                {isZh ? '发送' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
