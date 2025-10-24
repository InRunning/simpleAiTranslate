import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

function ensureContainer() {
  let el = document.getElementById('__sit_overlay')
  if (!el) {
    el = document.createElement('div')
    el.id = '__sit_overlay'
    el.style.position = 'fixed'
    el.style.zIndex = '2147483647'
    el.style.top = '0'
    el.style.left = '0'
    el.style.width = '0'
    el.style.height = '0'
    document.documentElement.appendChild(el)
  }
  return el
}

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
  const box: React.CSSProperties = {
    position: 'fixed',
    top: y + 8,
    left: x,
    maxWidth: 360,
    background: 'white',
    color: 'black',
    border: '1px solid rgba(0,0,0,0.1)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    lineHeight: 1.4,
  }
  const close: React.CSSProperties = {
    position: 'absolute',
    top: 6,
    right: 8,
    cursor: 'pointer',
    fontSize: 12,
    color: '#666',
  }
  const title: React.CSSProperties = { marginBottom: 8, fontWeight: 600 }
  const tip: React.CSSProperties = { fontSize: 12, color: '#666', marginTop: 8 }
  return (
    <div style={box}>
      <span style={close} onClick={onClose}>
        关闭
      </span>
      <div style={title}>划词翻译</div>
      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{text}</div>
      <div style={tip}>提示：翻译接口未接入，仅演示浮层。</div>
    </div>
  )
}

function ContentApp() {
  const [visible, setVisible] = useState(false)
  const [text, setText] = useState('')
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const show = (txt: string, clientX: number, clientY: number) => {
    setText(txt)
    const x = Math.min(clientX, window.innerWidth - 380)
    const y = Math.min(clientY, window.innerHeight - 160)
    setPos({ x, y })
    setVisible(true)
  }

  useEffect(() => {
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

