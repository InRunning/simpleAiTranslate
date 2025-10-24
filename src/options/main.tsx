import React from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/global.css'

function OptionsApp() {
  return (
    <div className="w-[480px] p-4 space-y-4">
      <h2 className="text-lg font-semibold">扩展设置</h2>
      <p className="text-sm text-muted-foreground">在此配置 API Key、翻译供应商等（占位）。</p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <OptionsApp />
  </React.StrictMode>
)

