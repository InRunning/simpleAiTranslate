import { useState, useEffect } from "react"
import type { AIService, ExtensionSettings } from "./types"
import { DEFAULT_SETTINGS } from "./types"

function IndexOptions() {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS)
  const [activeTab, setActiveTab] = useState<'services' | 'general'>('services')

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
    }
  }

  const saveSettings = async (newSettings: ExtensionSettings) => {
    try {
      await chrome.storage.sync.set({ settings: newSettings })
      setSettings(newSettings)
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  const updateAIService = (index: number, field: keyof AIService, value: any) => {
    const newServices = [...settings.aiServices]
    newServices[index] = { ...newServices[index], [field]: value }
    saveSettings({ ...settings, aiServices: newServices })
  }

  const addCustomService = () => {
    const newService: AIService = {
      id: `custom_${Date.now()}`,
      name: 'Custom AI Service',
      baseUrl: '',
      apiKey: '',
      model: '',
      enabled: false,
      prompt: DEFAULT_SETTINGS.aiServices[0].prompt
    }
    saveSettings({
      ...settings,
      aiServices: [...settings.aiServices, newService]
    })
  }

  const removeService = (index: number) => {
    const newServices = settings.aiServices.filter((_, i) => i !== index)
    saveSettings({ ...settings, aiServices: newServices })
  }

  const resetToDefaults = () => {
    saveSettings(DEFAULT_SETTINGS)
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Simple AI Translate - 设置</h1>
      
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab('services')}
          style={{
            padding: '10px 20px',
            marginRight: 10,
            backgroundColor: activeTab === 'services' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'services' ? 'white' : 'black',
            border: '1px solid #dee2e6',
            cursor: 'pointer'
          }}
        >
          AI服务配置
        </button>
        <button
          onClick={() => setActiveTab('general')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'general' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'general' ? 'white' : 'black',
            border: '1px solid #dee2e6',
            cursor: 'pointer'
          }}
        >
          通用设置
        </button>
      </div>

      {activeTab === 'services' && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={addCustomService}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              添加自定义AI服务
            </button>
            <button
              onClick={resetToDefaults}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                marginLeft: 10
              }}
            >
              重置为默认设置
            </button>
          </div>

          {settings.aiServices.map((service, index) => (
            <div
              key={service.id}
              style={{
                border: '1px solid #dee2e6',
                borderRadius: 8,
                padding: 15,
                marginBottom: 15,
                backgroundColor: '#f8f9fa'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h3 style={{ margin: 0 }}>{service.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ marginRight: 10 }}>
                    <input
                      type="checkbox"
                      checked={service.enabled}
                      onChange={(e) => updateAIService(index, 'enabled', e.target.checked)}
                    />
                    启用
                  </label>
                  {service.id.startsWith('custom_') && (
                    <button
                      onClick={() => removeService(index)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                    >
                      删除
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 5 }}>服务名称:</label>
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => updateAIService(index, 'name', e.target.value)}
                    style={{ width: '100%', padding: 5, border: '1px solid #ced4da', borderRadius: 4 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 5 }}>模型:</label>
                  <input
                    type="text"
                    value={service.model}
                    onChange={(e) => updateAIService(index, 'model', e.target.value)}
                    style={{ width: '100%', padding: 5, border: '1px solid #ced4da', borderRadius: 4 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', marginBottom: 5 }}>API Base URL:</label>
                <input
                  type="text"
                  value={service.baseUrl}
                  onChange={(e) => updateAIService(index, 'baseUrl', e.target.value)}
                  style={{ width: '100%', padding: 5, border: '1px solid #ced4da', borderRadius: 4 }}
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', marginBottom: 5 }}>API Key:</label>
                <input
                  type="password"
                  value={service.apiKey}
                  onChange={(e) => updateAIService(index, 'apiKey', e.target.value)}
                  style={{ width: '100%', padding: 5, border: '1px solid #ced4da', borderRadius: 4 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 5 }}>自定义提示词:</label>
                <textarea
                  value={service.prompt || ''}
                  onChange={(e) => updateAIService(index, 'prompt', e.target.value)}
                  rows={4}
                  style={{ width: '100%', padding: 5, border: '1px solid #ced4da', borderRadius: 4, resize: 'vertical' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'general' && (
        <div style={{ backgroundColor: '#f8f9fa', padding: 15, borderRadius: 8 }}>
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={settings.showIpa}
                onChange={(e) => saveSettings({ ...settings, showIpa: e.target.checked })}
                style={{ marginRight: 10 }}
              />
              显示IPA音标
            </label>
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={settings.showMultipleResults}
                onChange={(e) => saveSettings({ ...settings, showMultipleResults: e.target.checked })}
                style={{ marginRight: 10 }}
              />
              显示多个AI结果
            </label>
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={settings.autoTranslate}
                onChange={(e) => saveSettings({ ...settings, autoTranslate: e.target.checked })}
                style={{ marginRight: 10 }}
              />
              选中文本后自动翻译
            </label>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 5 }}>触发键:</label>
            <select
              value={settings.triggerKey}
              onChange={(e) => saveSettings({ ...settings, triggerKey: e.target.value })}
              style={{ padding: 5, border: '1px solid #ced4da', borderRadius: 4 }}
            >
              <option value="alt">Alt</option>
              <option value="ctrl">Ctrl</option>
              <option value="shift">Shift</option>
              <option value="none">无（仅点击）</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default IndexOptions
