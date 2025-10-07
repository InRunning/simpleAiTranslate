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
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Switch } from "~/components/ui/switch"
import { Settings, Plus, Trash2, RotateCcw, Bot, Info } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-600 rounded-2xl">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Simple AI Translate</h1>
            <p className="text-gray-600">配置您的AI翻译服务</p>
          </div>
        </div>
        
        {/* 标签页导航 */}
        <div className="flex space-x-1 mb-6 bg-white/50 backdrop-blur-sm p-1 rounded-2xl">
          {/* AI服务配置标签 */}
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'services' 
                ? 'bg-white text-blue-600 shadow-lg' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <Bot className="h-5 w-5" />
            AI服务配置
          </button>
          {/* 通用设置标签 */}
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'general' 
                ? 'bg-white text-blue-600 shadow-lg' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <Settings className="h-5 w-5" />
            通用设置
          </button>
        </div>

        {/* AI服务配置标签页内容 */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            {/* 操作按钮区域 */}
            <div className="flex gap-4">
              {/* 添加自定义服务按钮 */}
              <Button
                onClick={addCustomService}
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                添加自定义AI服务
              </Button>
              {/* 重置设置按钮 */}
              <Button
                onClick={resetToDefaults}
                variant="destructive"
                className="rounded-xl"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                重置为默认设置
              </Button>
            </div>

            {/* AI服务列表渲染 */}
            <div className="grid gap-6">
              {settings.aiServices.map((service, index) => (
                <Card key={service.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                          <Bot className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{service.name}</CardTitle>
                          <CardDescription>
                            {service.id === 'public-gemini' ? '公共Gemini服务 - 无需配置API密钥' : '自定义AI服务'}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* 启用/禁用开关 */}
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={service.enabled}
                            onCheckedChange={(checked) => updateAIService(index, 'enabled', checked)}
                          />
                          <Label className="text-sm font-medium">启用</Label>
                        </div>
                        {/* 删除按钮（仅对自定义服务显示） */}
                        {service.id.startsWith('custom_') && (
                          <Button
                            onClick={() => removeService(index)}
                            variant="destructive"
                            size="sm"
                            className="rounded-xl"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* 服务配置表单 */}
                    {/* 服务名称和模型（两列布局） */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${service.id}`}>服务名称</Label>
                        <Input
                          id={`name-${service.id}`}
                          value={service.name}
                          onChange={(e) => updateAIService(index, 'name', e.target.value)}
                          disabled={service.id === 'public-gemini'}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`model-${service.id}`}>模型</Label>
                        {service.id === 'public-gemini' ? (
                          <select
                            id={`model-${service.id}`}
                            value={service.model}
                            onChange={(e) => updateAIService(index, 'model', e.target.value)}
                            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                          </select>
                        ) : (
                          <Input
                            id={`model-${service.id}`}
                            value={service.model}
                            onChange={(e) => updateAIService(index, 'model', e.target.value)}
                            className="rounded-xl"
                          />
                        )}
                      </div>
                    </div>

                    {/* API Base URL - 公共服务隐藏 */}
                    {service.id !== 'public-gemini' && (
                      <div className="space-y-2">
                        <Label htmlFor={`url-${service.id}`}>API Base URL</Label>
                        <Input
                          id={`url-${service.id}`}
                          value={service.baseUrl}
                          onChange={(e) => updateAIService(index, 'baseUrl', e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                    )}

                    {/* API Key - 公共服务隐藏 */}
                    {service.id !== 'public-gemini' && (
                      <div className="space-y-2">
                        <Label htmlFor={`key-${service.id}`}>API Key</Label>
                        <Input
                          id={`key-${service.id}`}
                          type="password"
                          value={service.apiKey}
                          onChange={(e) => updateAIService(index, 'apiKey', e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                    )}

                    {/* 公共服务提示信息 */}
                    {service.id === 'public-gemini' && (
                      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">公共Gemini服务</p>
                          <p>这是公共Gemini服务，无需配置API密钥和URL，直接选择模型即可使用。</p>
                        </div>
                      </div>
                    )}

                    {/* 自定义提示词 */}
                    <div className="space-y-2">
                      <Label htmlFor={`prompt-${service.id}`}>自定义提示词</Label>
                      <textarea
                        id={`prompt-${service.id}`}
                        value={service.prompt || ''}
                        onChange={(e) => updateAIService(index, 'prompt', e.target.value)}
                        rows={4}
                        className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 通用设置标签页内容 */}
        {activeTab === 'general' && (
          <Card>
            <CardHeader>
              <CardTitle>通用设置</CardTitle>
              <CardDescription>配置翻译行为和显示选项</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* IPA音标显示开关 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">显示IPA音标</Label>
                  <p className="text-sm text-muted-foreground">在翻译结果中显示国际音标</p>
                </div>
                <Switch
                  checked={settings.showIpa}
                  onCheckedChange={(checked) => saveSettings({ ...settings, showIpa: checked })}
                />
              </div>

              {/* 多AI结果显示开关 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">显示多个AI结果</Label>
                  <p className="text-sm text-muted-foreground">同时显示多个AI服务的翻译结果</p>
                </div>
                <Switch
                  checked={settings.showMultipleResults}
                  onCheckedChange={(checked) => saveSettings({ ...settings, showMultipleResults: checked })}
                />
              </div>

              {/* 自动翻译开关 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">选中文本后自动翻译</Label>
                  <p className="text-sm text-muted-foreground">选中文本时自动显示翻译结果</p>
                </div>
                <Switch
                  checked={settings.autoTranslate}
                  onCheckedChange={(checked) => saveSettings({ ...settings, autoTranslate: checked })}
                />
              </div>

              {/* 触发键选择器 */}
              <div className="space-y-2">
                <Label className="text-base">触发键</Label>
                <select
                  value={settings.triggerKey}
                  onChange={(e) => saveSettings({ ...settings, triggerKey: e.target.value })}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="alt">Alt</option>
                  <option value="ctrl">Ctrl</option>
                  <option value="shift">Shift</option>
                  <option value="none">无（仅点击）</option>
                </select>
                <p className="text-sm text-muted-foreground">选择触发翻译的按键组合</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default IndexOptions