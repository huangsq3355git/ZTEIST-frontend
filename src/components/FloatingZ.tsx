import { useEffect, useRef, useState } from 'react'

interface Message {
  role: 'user' | 'ai'
  text: string
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
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user' ? 'bg-jade/15 text-gray-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {m.text}
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
