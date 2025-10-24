import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function App() {
  const [text, setText] = useState('')

  return (
    <div className="w-[360px] p-4 space-y-3">
      <h1 className="text-lg font-semibold">Simple AI Translate</h1>
      <div className="flex items-center gap-2">
        <input
          className="flex-1 rounded-md border px-3 py-2 text-sm outline-none"
          placeholder="输入要翻译的文本"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={() => alert('尚未接入接口')}>翻译</Button>
      </div>
      <p className="text-sm text-muted-foreground">提示：选中文本可唤起页面悬浮翻译。</p>
    </div>
  )
}

