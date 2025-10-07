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
  // ===== UI渲染部分 =====
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Simple AI Translate</h1>
              <p className="text-sm sm:text-base text-gray-600">配置您的AI翻译服务</p>
            </div>
          </div>
        </header>
        
        {/* 标签页导航 */}
        <div className="flex space-x-1 mb-6 bg-gray-200/80 backdrop-blur-sm p-1 rounded-xl">
          <TabButton
            active={activeTab === 'services'}
            onClick={() => setActiveTab('services')}
          >
            <Bot className="h-5 w-5" />
            AI服务配置
          </TabButton>
          <TabButton
            active={activeTab === 'general'}
            onClick={() => setActiveTab('general')}
          >
            <Settings className="h-5 w-5" />
            通用设置
          </TabButton>
        </div>

        {/* 标签页内容 */}
        <main>
          {activeTab === 'services' && (
            <div className="space-y-6">
              {/* 操作按钮区域 */}
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Button
                  onClick={addCustomService}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  添加自定义AI服务
                </Button>
                <Button
                  onClick={resetToDefaults}
                  variant="destructive"
                  className="rounded-lg"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  重置为默认设置
                </Button>
              </div>

              {/* AI服务列表渲染 */}
              <div className="space-y-6">
                {settings.aiServices.map((service, index) => (
                  <Card key={service.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="bg-gray-100/80 p-4 sm:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Bot className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg sm:text-xl">{service.name}</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                              {service.id === 'public-gemini' ? '公共Gemini服务' : '自定义AI服务'}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`enable-${service.id}`}
                              checked={service.enabled}
                              onCheckedChange={(checked) => updateAIService(index, 'enabled', checked)}
                            />
                            <Label htmlFor={`enable-${service.id}`} className="text-sm font-medium">启用</Label>
                          </div>
                          {service.id.startsWith('custom_') && (
                            <Button
                              onClick={() => removeService(index)}
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">删除服务</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${service.id}`}>服务名称</Label>
                          <Input
                            id={`name-${service.id}`}
                            value={service.name}
                            onChange={(e) => updateAIService(index, 'name', e.target.value)}
                            disabled={service.id === 'public-gemini'}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`model-${service.id}`}>模型</Label>
                          {service.id === 'public-gemini' ? (
                            <select
                              id={`model-${service.id}`}
                              value={service.model}
                              onChange={(e) => updateAIService(index, 'model', e.target.value)}
                              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                              className="rounded-lg"
                            />
                          )}
                        </div>
                        {service.id !== 'public-gemini' && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor={`url-${service.id}`}>API Base URL</Label>
                              <Input
                                id={`url-${service.id}`}
                                value={service.baseUrl}
                                onChange={(e) => updateAIService(index, 'baseUrl', e.target.value)}
                                className="rounded-lg"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`key-${service.id}`}>API Key</Label>
                              <Input
                                id={`key-${service.id}`}
                                type="password"
                                value={service.apiKey}
                                onChange={(e) => updateAIService(index, 'apiKey', e.target.value)}
                                className="rounded-lg"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      {service.id === 'public-gemini' && (
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium">公共Gemini服务</p>
                            <p className="text-xs">无需配置API密钥和URL，直接选择模型即可使用。</p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor={`prompt-${service.id}`}>自定义提示词</Label>
                        <textarea
                          id={`prompt-${service.id}`}
                          value={service.prompt || ''}
                          onChange={(e) => updateAIService(index, 'prompt', e.target.value)}
                          rows={3}
                          className="flex min-h-[60px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>通用设置</CardTitle>
                <CardDescription>配置翻译行为和显示选项</CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-gray-200">
                <GeneralSetting
                  label="显示IPA音标"
                  description="在翻译结果中显示国际音标"
                >
                  <Switch
                    checked={settings.showIpa}
                    onCheckedChange={(checked) => saveSettings({ ...settings, showIpa: checked })}
                  />
                </GeneralSetting>
                <GeneralSetting
                  label="显示多个AI结果"
                  description="同时显示多个AI服务的翻译结果"
                >
                  <Switch
                    checked={settings.showMultipleResults}
                    onCheckedChange={(checked) => saveSettings({ ...settings, showMultipleResults: checked })}
                  />
                </GeneralSetting>
                <GeneralSetting
                  label="选中文本后自动翻译"
                  description="选中文本时自动显示翻译结果"
                >
                  <Switch
                    checked={settings.autoTranslate}
                    onCheckedChange={(checked) => saveSettings({ ...settings, autoTranslate: checked })}
                  />
                </GeneralSetting>
                <div className="pt-6">
                  <Label className="text-base font-medium">触发键</Label>
                  <p className="text-sm text-muted-foreground mb-2">选择触发翻译的按键组合</p>
                  <select
                    value={settings.triggerKey}
                    onChange={(e) => saveSettings({ ...settings, triggerKey: e.target.value })}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="alt">Alt</option>
                    <option value="ctrl">Ctrl</option>
                    <option value="shift">Shift</option>
                    <option value="none">无（仅点击）</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
// ===== 辅助组件 =====

/**
 * 标签页按钮组件
 */
const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
      active
        ? 'bg-white text-blue-600 shadow-md'
        : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
    }`}
  >
    {children}
  </button>
)

/**
 * 通用设置项组件
 */
const GeneralSetting = ({ label, description, children }) => (
  <div className="py-6 flex flex-wrap items-center justify-between gap-4">
    <div className="space-y-0.5">
      <Label className="text-base font-medium">{label}</Label>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <div>{children}</div>
  </div>
)

export default IndexOptions