import { useState, useEffect } from "react"
import type { ExtensionSettings } from "./types"
import { DEFAULT_SETTINGS } from "./types"

function IndexPopup() {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const result = await chrome.storage.sync.get('settings')
      if (result.settings) {
        setSettings(result.settings)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openOptions = () => {
    chrome.runtime.openOptionsPage()
  }

  const getEnabledServicesCount = () => {
    return settings.aiServices.filter(service => service.enabled).length
  }

  if (isLoading) {
    return (
      <div style={{ padding: 20, textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <div>加载中...</div>
      </div>
    )
  }

  return (
    <div style={{
      width: 300,
      padding: 20,
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: '#007bff' }}>Simple AI Translate</h2>
        <p style={{ margin: '10px 0', color: '#6c757d', fontSize: 14 }}>
          智能翻译扩展
        </p>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: 16, color: '#333' }}>状态</h3>
        <div style={{ fontSize: 14 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: '#6c757d' }}>启用的AI服务:</span>
            <span style={{ fontWeight: 'bold', marginLeft: 5, color: '#007bff' }}>
              {getEnabledServicesCount()}
            </span>
          </div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: '#6c757d' }}>自动翻译:</span>
            <span style={{ fontWeight: 'bold', marginLeft: 5, color: settings.autoTranslate ? '#28a745' : '#dc3545' }}>
              {settings.autoTranslate ? '开启' : '关闭'}
            </span>
          </div>
          <div>
            <span style={{ color: '#6c757d' }}>触发键:</span>
            <span style={{ fontWeight: 'bold', marginLeft: 5, color: '#007bff' }}>
              {settings.triggerKey === 'none' ? '仅点击' : settings.triggerKey.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: 16, color: '#333' }}>使用说明</h3>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#6c757d' }}>
          <li style={{ marginBottom: 5 }}>选中文本后按{settings.triggerKey === 'none' ? '点击' : settings.triggerKey.toUpperCase() + '键'}</li>
          <li style={{ marginBottom: 5 }}>或右键选中文本选择"翻译选中文本"</li>
          <li>支持单词和句子翻译</li>
          <li>提供上下文相关的准确翻译</li>
        </ul>
      </div>

      <button
        onClick={openOptions}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#0056b3'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#007bff'
        }}
      >
        打开设置
      </button>

      {getEnabledServicesCount() === 0 && (
        <div style={{
          marginTop: 15,
          padding: 10,
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: 6,
          fontSize: 12,
          color: '#856404',
          textAlign: 'center'
        }}>
          ⚠️ 请先在设置中启用至少一个AI服务
        </div>
      )}
    </div>
  )
}

export default IndexPopup
