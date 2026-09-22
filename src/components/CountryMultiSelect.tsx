import { useEffect, useMemo, useRef, useState } from 'react'
import { type Lang } from '../i18n'
import type { Country } from './CountrySelect'

/** 多选国家：输入过滤 + 下拉选择，已选显示为可删除的标签。value = ISO 码数组。 */
export default function CountryMultiSelect({
  lang,
  countries,
  value,
  onChange,
  placeholder = '',
}: {
  lang: Lang
  countries: Country[]
  value: string[]
  onChange: (codes: string[]) => void
  placeholder?: string
}) {
  const nameOf = (code: string) => {
    const c = countries.find((x) => x.code === code)
    return c ? (lang === 'zh' ? c.name_zh : c.name_en) : code
  }
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const filtered = useMemo(() => {
    const q = text.trim().toLowerCase()
    const list = q
      ? countries.filter(
          (c) =>
            c.name_zh.toLowerCase().includes(q) ||
            c.name_en.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q)
        )
      : countries
    return list.filter((c) => !value.includes(c.code)) // 已选的不再显示
  }, [text, countries, value])

  function add(code: string) {
    if (!value.includes(code)) onChange([...value, code])
    setText('')
  }
  function remove(code: string) {
    onChange(value.filter((c) => c !== code))
  }

  const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zte-blue'

  return (
    <div ref={rootRef} className="relative">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {value.map((code) => (
            <span
              key={code}
              className="inline-flex items-center gap-1 text-xs bg-zte-blue/10 text-zte-blue rounded-full px-2 py-0.5"
            >
              {nameOf(code)}
              <button
                type="button"
                onClick={() => remove(code)}
                className="hover:text-zte-red leading-none"
                aria-label="remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        className={inputCls}
        value={text}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setText(e.target.value)
          setOpen(true)
        }}
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
                add(c.code)
              }}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-zte-blue/10 text-gray-700"
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
