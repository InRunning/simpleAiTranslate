import type { AIService, TranslationRequest, TranslationResult } from './types'

/**
 * AI服务管理器类
 * 负责管理多个AI服务并执行翻译请求
 */
export class AIServiceManager {
  private services: AIService[] = []  // 已启用的AI服务列表

  /**
   * 构造函数
   * @param services AI服务配置列表
   */
  constructor(services: AIService[]) {
    // 只保留已启用的服务
    this.services = services.filter(service => service.enabled)
  }

  /**
   * 执行翻译请求
   * @param request 翻译请求对象
   * @returns 所有AI服务的翻译结果数组
   */
  async translate(request: TranslationRequest): Promise<TranslationResult[]> {
    const results: TranslationResult[] = []
    
    // 遍历所有已启用的AI服务
    for (const service of this.services) {
      try {
        // 调用单个AI服务进行翻译
        const result = await this.callAIService(service, request)
        results.push(result)
      } catch (error) {
        // 如果某个服务出错，记录错误并继续处理其他服务
        console.error(`Error calling ${service.name}:`, error)
        results.push({
          serviceId: service.id,
          serviceName: service.name,
          translation: '',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    return results
  }

  /**
   * 调用单个AI服务进行翻译
   * @param service AI服务配置
   * @param request 翻译请求
   * @returns 翻译结果
   */
  private async callAIService(service: AIService, request: TranslationRequest): Promise<TranslationResult> {
    // 根据请求构建提示词
    const prompt = this.buildPrompt(service, request)
    
    // 根据服务类型调用相应的API
    switch (service.id) {
      case 'openai':
        return this.callOpenAI(service, prompt)
      case 'gemini':
        return this.callGemini(service, prompt)
      case 'public-gemini':
        return this.callPublicGemini(service, prompt)
      case 'claude':
        return this.callClaude(service, prompt)
      default:
        // 对于自定义服务，使用通用API调用方式
        return this.callGenericAPI(service, prompt)
    }
  }

  /**
   * 构建AI服务的提示词
   * @param service AI服务配置
   * @param request 翻译请求
   * @returns 构建好的提示词
   */
  private buildPrompt(service: AIService, request: TranslationRequest): string {
    // 根据是否为单词翻译添加不同的指令
    const additionalInstructions = request.isWord
      ? `This is a single word at position ${request.wordIndex} in the context. Please provide the most accurate meaning based on the context and IPA pronunciation.`
      : 'This is a sentence or phrase. Please provide an accurate translation.'
    
    // 使用服务自定义的提示词模板或默认模板
    let prompt = service.prompt || DEFAULT_PROMPT
    
    // 替换模板中的占位符
    prompt = prompt.replace('{text}', request.selectedText)
    prompt = prompt.replace('{context}', request.context)
    prompt = prompt.replace('{additionalInstructions}', additionalInstructions)
    
    return prompt
  }

  /**
   * 调用OpenAI API进行翻译
   * @param service OpenAI服务配置
   * @param prompt 构建好的提示词
   * @returns 翻译结果
   */
  private async callOpenAI(service: AIService, prompt: string): Promise<TranslationResult> {
    // 发送POST请求到OpenAI的chat completions端点
    const response = await fetch(`${service.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${service.apiKey}`  // 使用Bearer token认证
      },
      body: JSON.stringify({
        model: service.model,
        messages: [{ role: 'user', content: prompt }],  // 使用chat格式
        temperature: 0.3,  // 较低的温度以获得更一致的翻译
        max_tokens: 1000   // 最大token数限制
      })
    })

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    // 解析响应数据
    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''
    
    // 解析AI返回的内容为结构化结果
    return this.parseResponse(service.id, service.name, content)
  }

  /**
   * 调用Gemini API进行翻译
   * @param service Gemini服务配置
   * @param prompt 构建好的提示词
   * @returns 翻译结果
   */
  private async callGemini(service: AIService, prompt: string): Promise<TranslationResult> {
    // 发送POST请求到Gemini的generateContent端点
    const response = await fetch(`${service.baseUrl}/models/${service.model}:generateContent?key=${service.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],  // Gemini使用contents格式
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.candidates[0]?.content?.parts[0]?.text || ''
    
    return this.parseResponse(service.id, service.name, content)
  }

  /**
   * 调用公共Gemini API进行翻译
   * @param service 公共Gemini服务配置
   * @param prompt 构建好的提示词
   * @returns 翻译结果
   */
  private async callPublicGemini(service: AIService, prompt: string): Promise<TranslationResult> {
    // 发送POST请求到公共Gemini服务的generateContent端点
    const response = await fetch(`${service.baseUrl}/models/${service.model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${service.apiKey}`  // 使用Bearer token认证
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],  // Gemini使用contents格式
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000
        }
      })
    })

    if (!response.ok) {
      throw new Error(`公共Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.candidates[0]?.content?.parts[0]?.text || ''
    
    return this.parseResponse(service.id, service.name, content)
  }

  /**
   * 调用Claude API进行翻译
   * @param service Claude服务配置
   * @param prompt 构建好的提示词
   * @returns 翻译结果
   */
  private async callClaude(service: AIService, prompt: string): Promise<TranslationResult> {
    // 发送POST请求到Claude的messages端点
    const response = await fetch(`${service.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': service.apiKey,  // Claude使用x-api-key头
        'anthropic-version': '2023-06-01'  // 指定API版本
      },
      body: JSON.stringify({
        model: service.model,
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.content[0]?.text || ''
    
    return this.parseResponse(service.id, service.name, content)
  }

  /**
   * 调用通用API（兼容OpenAI格式的自定义服务）
   * @param service 自定义AI服务配置
   * @param prompt 构建好的提示词
   * @returns 翻译结果
   */
  private async callGenericAPI(service: AIService, prompt: string): Promise<TranslationResult> {
    // 使用OpenAI兼容的API格式
    const response = await fetch(`${service.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${service.apiKey}`
      },
      body: JSON.stringify({
        model: service.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    // 兼容不同的响应格式
    const content = data.choices[0]?.message?.content || data.content || ''
    
    return this.parseResponse(service.id, service.name, content)
  }

  /**
   * 解析AI服务的响应内容
   * @param serviceId 服务ID
   * @param serviceName 服务名称
   * @param content AI返回的原始内容
   * @returns 解析后的翻译结果
   */
  private parseResponse(serviceId: string, serviceName: string, content: string): TranslationResult {
    // 将响应内容按行分割，过滤空行
    const lines = content.split('\n').filter(line => line.trim())
    
    let translation = ''
    let ipa = ''
    let meaning = ''
    
    // 逐行解析，查找结构化内容
    for (const line of lines) {
      // 查找翻译内容（支持中英文标识）
      if (line.toLowerCase().includes('translation:') || line.toLowerCase().includes('翻译:')) {
        translation = line.replace(/^(translation|翻译)[:：]\s*/i, '').trim()
      }
      // 查找IPA音标
      else if (line.toLowerCase().includes('ipa:') || line.toLowerCase().includes('音标:')) {
        ipa = line.replace(/^(ipa|音标)[:：]\s*/i, '').trim()
      }
      // 查找详细含义
      else if (line.toLowerCase().includes('meaning:') || line.toLowerCase().includes('含义:')) {
        meaning = line.replace(/^(meaning|含义)[:：]\s*/i, '').trim()
      }
    }
    
    // 如果没有找到结构化的翻译内容，使用整个内容作为翻译
    if (!translation) {
      translation = content
    }
    
    return {
      serviceId,
      serviceName,
      translation,
      ipa: ipa || undefined,  // 如果没有IPA则设为undefined
      meaning: meaning || undefined  // 如果没有详细含义则设为undefined
    }
  }
}

/**
 * 默认提示词模板
 * 定义了向AI发送请求的标准格式
 */
const DEFAULT_PROMPT = `Translate the following text and provide context:
Text: {text}
Context: {context}
{additionalInstructions}

Please provide:
1. Translation
2. IPA pronunciation (if applicable)
3. Detailed meaning explanation`