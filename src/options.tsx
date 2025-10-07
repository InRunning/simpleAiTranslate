/**
 * Simple AI Translate - 选项页面组件
 *
 * 这是Chrome扩展的选项页面，允许用户配置AI翻译服务
 * 主要功能：
 * 1. 配置多个AI服务的API密钥和设置
 * 2. 管理翻译行为和显示选项
 * 3. 添加/删除自定义AI服务
 * 4. 重置设置为默认值
 */

import { useState, useEffect } from "react"
import type { AIService, ExtensionSettings } from "./types"
import { DEFAULT_SETTINGS } from "./types"

/**
 * 选项页面主组件
 * 使用React Hooks管理状态和副作用
 */
function IndexOptions() {
  // ===== 状态管理 =====
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS)  // 当前设置状态
  const [activeTab, setActiveTab] = useState<'services' | 'general'>('services')  // 当前激活的标签页

  /**
   * 组件挂载时加载保存的设置
   * useEffect空依赖数组表示只在组件挂载时执行一次
   */
  useEffect(() => {
    loadSettings()
  }, [])

  /**
   * 从Chrome存储中加载用户设置
   * 使用chrome.storage.sync API实现跨设备同步
   */
  const loadSettings = async () => {
    try {
      const result = await chrome.storage.sync.get('settings')
      if (result.settings) {
        setSettings(result.settings)  // 更新组件状态
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  /**
   * 保存设置到Chrome存储
   * @param newSettings 要保存的新设置对象
   */
  const saveSettings = async (newSettings: ExtensionSettings) => {
    try {
      await chrome.storage.sync.set({ settings: newSettings })
      setSettings(newSettings)  // 更新本地状态
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  /**
   * 更新特定AI服务的配置
   * @param index AI服务在数组中的索引
   * @param field 要更新的字段名
   * @param value 新的字段值
   */
  const updateAIService = (index: number, field: keyof AIService, value: any) => {
    // 创建新的AI服务数组副本（不可变更新模式）
    const newServices = [...settings.aiServices]
    // 更新特定索引的服务对象
    newServices[index] = { ...newServices[index], [field]: value }
    // 保存更新后的设置
    saveSettings({ ...settings, aiServices: newServices })
  }

  /**
   * 添加新的自定义AI服务
   * 创建一个默认配置的自定义服务并添加到服务列表
   */
  const addCustomService = () => {
    // 创建新的自定义AI服务对象
    const newService: AIService = {
      id: `custom_${Date.now()}`,  // 使用时间戳生成唯一ID
      name: 'Custom AI Service',
      baseUrl: '',
      apiKey: '',
      model: '',
      enabled: false,
      prompt: DEFAULT_SETTINGS.aiServices[0].prompt  // 使用默认提示词模板
    }
    // 保存包含新服务的设置
    saveSettings({
      ...settings,
      aiServices: [...settings.aiServices, newService]
    })
  }

  /**
   * 删除指定的AI服务
   * @param index 要删除的服务在数组中的索引
   */
  const removeService = (index: number) => {
    // 使用filter方法创建不包含指定服务的新数组
    const newServices = settings.aiServices.filter((_, i) => i !== index)
    saveSettings({ ...settings, aiServices: newServices })
  }

  /**
   * 重置所有设置为默认值
   * 恢复到初始配置状态
   */
  const resetToDefaults = () => {
    saveSettings(DEFAULT_SETTINGS)
  }

  // ===== UI渲染部分 =====
  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      {/* 页面标题 */}
      <h1>Simple AI Translate - 设置</h1>
      
      {/* 标签页导航 */}
      <div style={{ display: 'flex', marginBottom: 20 }}>
        {/* AI服务配置标签 */}
        <button
          onClick={() => setActiveTab('services')}
          style={{
            padding: '10px 20px',
            marginRight: 10,
            backgroundColor: activeTab === 'services' ? '#007bff' : '#f8f9fa',  // 激活状态高亮
            color: activeTab === 'services' ? 'white' : 'black',
            border: '1px solid #dee2e6',
            cursor: 'pointer'
          }}
        >
          AI服务配置
        </button>
        {/* 通用设置标签 */}
        <button
          onClick={() => setActiveTab('general')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'general' ? '#007bff' : '#f8f9fa',  // 激活状态高亮
            color: activeTab === 'general' ? 'white' : 'black',
            border: '1px solid #dee2e6',
            cursor: 'pointer'
          }}
        >
          通用设置
        </button>
      </div>

      {/* AI服务配置标签页内容 */}
      {activeTab === 'services' && (
        <div>
          {/* 操作按钮区域 */}
          <div style={{ marginBottom: 20 }}>
            {/* 添加自定义服务按钮 */}
            <button
              onClick={addCustomService}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',  // 绿色表示添加操作
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              添加自定义AI服务
            </button>
            {/* 重置设置按钮 */}
            <button
              onClick={resetToDefaults}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',  // 红色表示重置操作
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

          {/* AI服务列表渲染 */}
          {settings.aiServices.map((service, index) => (
            <div
              key={service.id}  // 使用服务ID作为React key
              style={{
                border: '1px solid #dee2e6',
                borderRadius: 8,
                padding: 15,
                marginBottom: 15,
                backgroundColor: '#f8f9fa'
              }}
            >
              {/* 服务标题和控制区域 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h3 style={{ margin: 0 }}>{service.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {/* 启用/禁用开关 */}
                  <label style={{ marginRight: 10 }}>
                    <input
                      type="checkbox"
                      checked={service.enabled}
                      onChange={(e) => updateAIService(index, 'enabled', e.target.checked)}
                    />
                    启用
                  </label>
                  {/* 删除按钮（仅对自定义服务显示） */}
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

              {/* 服务配置表单 */}
              {/* 服务名称和模型（两列布局） */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 5 }}>服务名称:</label>
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => updateAIService(index, 'name', e.target.value)}
                    style={{ width: '100%', padding: 5, border: '1px solid #ced4da', borderRadius: 4 }}
                    disabled={service.id === 'public-gemini'}  // 公共服务不允许修改名称
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 5 }}>模型:</label>
                  {service.id === 'public-gemini' ? (
                    <select
                      value={service.model}
                      onChange={(e) => updateAIService(index, 'model', e.target.value)}
                      style={{ width: '100%', padding: 5, border: '1px solid #ced4da', borderRadius: 4 }}
                    >
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={service.model}
                      onChange={(e) => updateAIService(index, 'model', e.target.value)}
                      style={{ width: '100%', padding: 5, border: '1px solid #ced4da', borderRadius: 4 }}
                    />
                  )}
                </div>
              </div>

              {/* API Base URL - 公共服务隐藏 */}
              {service.id !== 'public-gemini' && (
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', marginBottom: 5 }}>API Base URL:</label>
                  <input
                    type="text"
                    value={service.baseUrl}
                    onChange={(e) => updateAIService(index, 'baseUrl', e.target.value)}
                    style={{ width: '100%', padding: 5, border: '1px solid #ced4da', borderRadius: 4 }}
                  />
                </div>
              )}

              {/* API Key - 公共服务隐藏 */}
              {service.id !== 'public-gemini' && (
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', marginBottom: 5 }}>API Key:</label>
                  <input
                    type="password"  // 密码类型保护敏感信息
                    value={service.apiKey}
                    onChange={(e) => updateAIService(index, 'apiKey', e.target.value)}
                    style={{ width: '100%', padding: 5, border: '1px solid #ced4da', borderRadius: 4 }}
                  />
                </div>
              )}

              {/* 公共服务提示信息 */}
              {service.id === 'public-gemini' && (
                <div style={{ marginBottom: 10, padding: 10, backgroundColor: '#e7f3ff', borderRadius: 4, fontSize: '12px', color: '#0066cc' }}>
                  💡 这是公共Gemini服务，无需配置API密钥和URL，直接选择模型即可使用
                </div>
              )}

              {/* 自定义提示词（多行文本域） */}
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

      {/* 通用设置标签页内容 */}
      {activeTab === 'general' && (
        <div style={{ backgroundColor: '#f8f9fa', padding: 15, borderRadius: 8 }}>
          {/* IPA音标显示开关 */}
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

          {/* 多AI结果显示开关 */}
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

          {/* 自动翻译开关 */}
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

          {/* 触发键选择器 */}
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
