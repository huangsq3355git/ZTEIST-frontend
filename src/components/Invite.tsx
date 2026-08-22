import { useEffect, useState } from 'react'
import { t, type Lang } from '../i18n'

interface InviteInfo {
  code: string
  inviterName: string | null
  inviterNameEn: string | null
}

export default function Invite() {
  const [status, setStatus] = useState<'loading' | 'found' | 'notfound'>('loading')
  const [info, setInfo] = useState<InviteInfo | null>(null)
  const [lang, setLang] = useState<Lang>('zh')
  const [code, setCode] = useState('')

  useEffect(() => {
    // 从 /zh/i/CODE 或 /en/i/CODE 解析语言 + 码（nginx 已把该路径反代到本页）
    const m = window.location.pathname.match(/^\/(zh|en)\/i\/([A-Za-z0-9]+)/)
    const lang: Lang = m?.[1] === 'en' ? 'en' : 'zh'
    const code = m?.[2] ?? ''
    setLang(lang)
    setCode(code)

    if (!code) {
      setStatus('notfound')
      return
    }

    fetch(`/api/invite/${code}`)
      .then((r) => {
        if (!r.ok) throw new Error(`invite ${r.status}`)
        return r.json()
      })
      .then((data: InviteInfo) => {
        setInfo(data)
        setStatus('found')
      })
      .catch(() => setStatus('notfound'))
  }, [])

  const i = t(lang)
  const name =
    lang === 'zh'
      ? info?.inviterName || info?.inviterNameEn || null
      : info?.inviterNameEn || info?.inviterName || null

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2">{i.brand}</h1>
        <p className="text-gray-500 mb-10">{i.brandSub}</p>

        {status === 'loading' && <p className="text-gray-400">{i.loading}</p>}

        {status === 'notfound' && <p className="text-red-500">{i.inviteNotFound}</p>}

        {status === 'found' && (
          <>
            <p className="text-xl leading-relaxed mb-8">
              {name ? i.inviteMessage(name) : i.inviteFallback}
            </p>
            <a
              href={`/${lang}/register?code=${encodeURIComponent(code)}`}
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {i.joinNow}
            </a>
          </>
        )}
      </div>
    </div>
  )
}
