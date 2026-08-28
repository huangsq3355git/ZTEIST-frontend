import { useEffect, useState } from 'react'

export default function FloatingZ({ lang, noFloating = false }: { lang: 'zh' | 'en'; noFloating?: boolean }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const isZh = lang === 'zh'
  const prefix = isZh ? '/zh' : '/en'

  // 监听全局 openZ 事件（首页大图小Z + 「问问小Z」按钮触发）
  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('openZ', onOpen)
    return () => window.removeEventListener('openZ', onOpen)
  }, [])

  function send() {
    window.location.href = `${prefix}/people/?q=${encodeURIComponent(input)}`
  }

  return (
    <>
      {/* 右下角浮标（仅非首页） */}
      {!noFloating && !open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="小Z"
          className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full shadow-lg border-2 border-jade bg-white overflow-hidden hover:scale-110 transition-transform"
        >
          <img src="/mascot.png?v=2" alt="小Z" className="h-full w-full object-contain" />
        </button>
      )}

      {/* 对话框：深蓝顶/底 + 白色中部 + 翠青外圈 */}
      {open && (
        <div
          className="fixed bottom-5 right-5 z-50 flex w-[340px] max-w-[calc(100vw-32px)] flex-col rounded-2xl overflow-hidden shadow-2xl border-2 border-jade"
          style={{ height: '460px', maxHeight: 'calc(100vh - 80px)', background: '#fff' }}
        >
          <div className="flex items-center justify-between px-3 py-2" style={{ background: '#002544' }}>
            <div className="flex items-center gap-2">
              <img src="/mascot.png?v=2" alt="小Z" className="h-7 w-7 object-contain" />
              <span className="text-sm font-semibold" style={{ color: '#39A867' }}>小Z</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-lg" style={{ color: 'rgba(160,177,200,0.7)' }}>✕</button>
          </div>

          <div className="flex-1 overflow-y-auto bg-white px-4 py-3 space-y-3">
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed bg-gray-100 text-gray-800 whitespace-pre-wrap">
                {isZh ? '嗨，我是小Z 🍀\n连接每一颗闪亮之星。' : "Hi, I'm Z 🍀\nConnecting every shining star."}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs bg-gray-50 text-gray-500">
                {isZh ? '对话功能即将上线，先带你到人员搜索页 →' : 'Chat coming soon, taking you to People search →'}
              </div>
            </div>
          </div>

          <div className="px-3 py-2.5" style={{ background: '#002544', borderTop: '1px solid rgba(57,168,103,0.2)' }}>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={isZh ? '说点什么…' : 'Say something…'}
                className="flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#E6EEF7' }}
              />
              <button onClick={send} className="rounded-xl px-3 py-2.5 text-sm" style={{ background: 'rgba(57,168,103,0.2)', color: '#52c081' }}>发送</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
