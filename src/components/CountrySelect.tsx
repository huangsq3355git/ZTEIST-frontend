import { useEffect, useMemo, useRef, useState } from 'react'
import { type Lang } from '../i18n'

export interface Country {
  code: string
  name_zh: string
  name_en: string
  region: string
}

/**
 * 可搜索国家下拉：输入即过滤（匹配中/英文名 + 国家码），空着也能点开看全部。
 * value 存 ISO 国家码，onChange 回传码，后端查询逻辑不变。
 */
export default function CountrySelect({
  lang,
  countries,
  value,
  onChange,
  placeholder = '',
}: {
  lang: Lang
  countries: Country[]
  value: string
  onChange: (code: string) => void
  placeholder?: string
}) {
  const nameOf = (code: string) => {
    const c = countries.find((x) => x.code === code)
    return c ? (lang === 'zh' ? c.name_zh : c.name_en) : ''
  }

  const [text, setText] = useState(nameOf(value))
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const emittedRef = useRef(value)

  // 父组件外部改 value（如重置）时，同步输入框文字
  useEffect(() => {
    if (value !== emittedRef.current) {
      setText(nameOf(value))
      emittedRef.current = value
    }
  }, [value, countries, lang])

  // 点击组件外部关闭下拉
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const filtered = useMemo(() => {
    const q = text.trim().toLowerCase()
    if (!q) return countries
    return countries.filter(
      (c) =>
        c.name_zh.toLowerCase().includes(q) ||
        c.name_en.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    )
  }, [text, countries])

  function emit(code: string) {
    if (code !== emittedRef.current) {
      emittedRef.current = code
      onChange(code)
    }
  }

  function onType(t: string) {
    setText(t)
    const q = t.trim().toLowerCase()
    const exact = countries.find(
      (c) =>
        (lang === 'zh' ? c.name_zh : c.name_en).toLowerCase() === q ||
        c.code.toLowerCase() === q
    )
    emit(exact ? exact.code : '')
  }

  function pick(c: Country) {
    emit(c.code)
    setText(nameOf(c.code))
    setOpen(false)
  }

  const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zte-blue'

  return (
    <div ref={rootRef} className="relative">
      <input
        className={inputCls}
        value={text}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onChange={(e) => onType(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false)
        }}
      />
      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
          {filtered.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-400">{lang === 'zh' ? '无匹配国家' : 'No match'}</div>
          )}
          {filtered.map((c) => (
            <button
              key={c.code}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                pick(c)
              }}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-zte-blue/10 ${
                c.code === value ? 'text-zte-blue font-medium' : 'text-gray-700'
              }`}
            >
              {lang === 'zh' ? c.name_zh : c.name_en}
              <span className="ml-2 text-xs text-gray-400">{c.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
