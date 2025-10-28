import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
// 仅注入 Tailwind utilities，避免对宿主页面的 base 重置
import '@/styles/content.css'

/**
 * 保证在页面上存在一个用于挂载 React 应用的容器。
 * 这里不做全局样式设置，将样式控制交给 Tailwind 类名，减少对宿主页面的影响。
 */
function ensureContainer() {
  let el = document.getElementById('__sit_overlay')
  if (!el) {
    el = document.createElement('div')
    el.id = '__sit_overlay'
    // 不使用全局 reset，仅保留最高层级，确保浮层可见
    el.setAttribute('style', 'position:fixed;z-index:2147483647;top:0;left:0;')
    document.documentElement.appendChild(el)
  }
  return el
}

/**
 * 翻译浮层组件：使用 Tailwind CSS 类实现样式。
 * 仅保留定位所需的内联 top/left；其余完全交由类名控制。
 */
function Overlay({
  visible,
  x,
  y,
  text,
  onClose,
}: {
  visible: boolean
  x: number
  y: number
  text: string
  onClose: () => void
}) {
  if (!visible) return null as any
  return (
    <div
      className="fixed z-[2147483647] max-w-[360px] select-text"
      style={{ top: y + 8, left: x }}
    >
      <div className="relative rounded-lg border border-black/10 bg-white text-black shadow-xl p-3 text-sm leading-6">
        {/* 关闭按钮 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-1.5 right-2 cursor-pointer text-xs text-gray-500 hover:text-gray-700"
          aria-label="关闭"
        >
          关闭
        </button>

        {/* 标题 */}
        <div className="mb-2 font-semibold">划词翻译</div>

        {/* 原文 */}
        <div className="whitespace-pre-wrap break-words">{text}</div>

        {/* 提示信息 */}
        <div className="mt-2 text-xs text-gray-500">提示：翻译接口未接入，仅演示浮层。</div>
      </div>
    </div>
  )
}

/**
 * 内容脚本根组件：
 * - 监听 mouseup 获取选中文本
 * - 自动在选区附近弹出浮层
 * - Esc 键关闭浮层
 */
function ContentApp() {
  const [visible, setVisible] = useState(false)
  const [text, setText] = useState('')
  const [pos, setPos] = useState({ x: 0, y: 0 })

  // 在不超出视口的前提下展示浮层
  const show = (txt: string, clientX: number, clientY: number) => {
    setText(txt)
    const x = Math.min(clientX, window.innerWidth - 380)
    const y = Math.min(clientY, window.innerHeight - 160)
    setPos({ x, y })
    setVisible(true)
  }

  useEffect(() => {
    // 选中文本后自动弹出
    const onMouseUp = () => {
      const sel = window.getSelection()
      const selected = sel ? sel.toString().trim() : ''
      if (selected) {
        const range = sel!.rangeCount > 0 ? sel!.getRangeAt(0) : null
        const rect = range ? range.getBoundingClientRect() : { left: 16, bottom: 16 }
        const left = (rect as any).left + window.scrollX
        const bottom = (rect as any).bottom + window.scrollY
        show(selected, left, bottom)
      } else {
        setVisible(false)
      }
    }

    // 兼容来自 background 的右键菜单触发
    const onMessage = (message: any) => {
      if (message?.type === 'TRANSLATE_SELECTION') {
        const txt = String(message.text || '').trim()
        if (!txt) return
        const x = Math.min(window.innerWidth - 380, 16 + (window.scrollX || 0))
        const y = Math.min(window.innerHeight - 160, 16 + (window.scrollY || 0))
        show(txt, x, y)
      }
    }

    document.addEventListener('mouseup', onMouseUp)
    chrome.runtime.onMessage.addListener(onMessage)
    return () => {
      document.removeEventListener('mouseup', onMouseUp)
      chrome.runtime.onMessage.removeListener(onMessage)
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisible(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <Overlay
      visible={visible}
      x={pos.x}
      y={pos.y}
      text={text}
      onClose={() => setVisible(false)}
    />
  )
}

const container = ensureContainer()
createRoot(container).render(<ContentApp />)
