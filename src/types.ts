/**
 * AI服务配置接口
 * 定义了一个AI服务的所有配置参数
 */
export interface AIService {
  id: string          // 服务唯一标识符（如 'openai', 'gemini'）
  name: string        // 服务显示名称（如 'OpenAI', 'Gemini'）
  baseUrl: string     // API基础URL
  apiKey: string      // API密钥
  model: string       // 使用的模型名称（如 'gpt-3.5-turbo'）
  enabled: boolean    // 是否启用该服务
  prompt?: string     // 自定义提示词模板
}

/**
 * 翻译请求接口
 * 包含了执行翻译所需的所有信息
 */
export interface TranslationRequest {
  selectedText: string  // 用户选中的文本
  context: string       // 选中文本的上下文（段落或文章）
  isWord: boolean       // 是否为单词翻译
  wordIndex?: number    // 单词在上下文中的位置索引
}

/**
 * 翻译结果接口
 * 包含了AI服务返回的翻译结果
 */
export interface TranslationResult {
  serviceId: string     // 提供翻译的AI服务ID
  serviceName: string   // 提供翻译的AI服务名称
  translation: string   // 翻译结果文本
  ipa?: string         // 国际音标（可选）
  meaning?: string     // 详细含义解释（可选）
  error?: string       // 错误信息（如果有）
}

/**
 * 扩展设置接口
 * 定义了扩展的所有配置选项
 */
export interface ExtensionSettings {
  aiServices: AIService[]     // AI服务配置列表
  showIpa: boolean           // 是否显示IPA音标
  showMultipleResults: boolean // 是否显示多个AI服务的结果
  autoTranslate: boolean      // 是否自动翻译（选中文本后立即翻译）
  triggerKey: string         // 触发翻译的按键（'alt', 'ctrl', 'shift', 'none'）
}

export const DEFAULT_AI_SERVICES: AIService[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-3.5-turbo',
    enabled: true,
    prompt: `Translate the following text and provide context:
Text: {text}
Context: {context}
{additionalInstructions}

Please provide:
1. Translation
2. IPA pronunciation (if applicable)
3. Detailed meaning explanation`
  },
  {
    id: 'gemini',
    name: 'Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: '',
    model: 'gemini-pro',
    enabled: false,
    prompt: `Translate the following text and provide context:
Text: {text}
Context: {context}
{additionalInstructions}

Please provide:
1. Translation
2. IPA pronunciation (if applicable)
3. Detailed meaning explanation`
  },
  {
    id: 'public-gemini',
    name: '公共Gemini服务',
    baseUrl: 'https://gpt-load.linstudios.top/proxy/gemini/v1beta',
    apiKey: 'sdk_1234_kdsfds',
    model: 'gemini-2.5-flash',
    enabled: false,
    prompt: `Translate the following text and provide context:
Text: {text}
Context: {context}
{additionalInstructions}

Please provide:
1. Translation
2. IPA pronunciation (if applicable)
3. Detailed meaning explanation`
  },
  {
    id: 'claude',
    name: 'Claude',
    baseUrl: 'https://api.anthropic.com/v1',
    apiKey: '',
    model: 'claude-3-haiku-20240307',
    enabled: false,
    prompt: `Translate the following text and provide context:
Text: {text}
Context: {context}
{additionalInstructions}

Please provide:
1. Translation
2. IPA pronunciation (if applicable)
3. Detailed meaning explanation`
  }
]

export const DEFAULT_SETTINGS: ExtensionSettings = {
  aiServices: DEFAULT_AI_SERVICES,
  showIpa: true,
  showMultipleResults: true,
  autoTranslate: false,
  triggerKey: 'alt'
}