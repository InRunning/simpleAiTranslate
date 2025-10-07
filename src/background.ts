import { AIServiceManager } from './ai-service'
import type { TranslationRequest, TranslationResult, ExtensionSettings } from './types'
import { DEFAULT_SETTINGS } from './types'

/**
 * 翻译结果缓存
 * 使用Map存储翻译结果，避免重复请求相同的翻译
 * 键格式: "selectedText_context_isWord_wordIndex"
 */
const translationCache = new Map<string, TranslationResult[]>()

/**
 * 监听来自content script的消息
 * 这是background script的主要入口点，处理两种类型的请求：
 * 1. translate: 执行翻译请求
 * 2. getSettings: 获取扩展设置
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 处理翻译请求
  if (request.action === 'translate') {
    handleTranslationRequest(request.data, sender.tab?.id)
      .then(results => sendResponse({ success: true, results }))
      .catch(error => sendResponse({ success: false, error: error.message }))
    return true // 返回true表示将异步发送响应，保持消息通道开放
  }
  
  // 处理获取设置请求
  if (request.action === 'getSettings') {
    getSettings()
      .then(settings => sendResponse({ success: true, settings }))
      .catch(error => sendResponse({ success: false, error: error.message }))
    return true
  }
})

/**
 * 处理翻译请求的核心函数
 * @param translationRequest 翻译请求数据
 * @param tabId 发送请求的标签页ID（可选）
 * @returns 翻译结果数组
 */
async function handleTranslationRequest(translationRequest: TranslationRequest, tabId?: number) {
  try {
    // 第一步：检查缓存，避免重复翻译相同内容
    const cacheKey = generateCacheKey(translationRequest)
    if (translationCache.has(cacheKey)) {
      console.log('从缓存返回翻译结果')
      return translationCache.get(cacheKey)!
    }

    // 第二步：获取用户配置的AI服务设置
    const settings = await getSettings()
    
    // 第三步：创建AI服务管理器，传入已启用的AI服务
    const aiManager = new AIServiceManager(settings.aiServices)
    
    // 第四步：执行翻译，AI服务管理器会并行调用所有启用的AI服务
    console.log('开始执行翻译请求...')
    const results = await aiManager.translate(translationRequest)
    
    // 第五步：将翻译结果存入缓存
    translationCache.set(cacheKey, results)
    
    // 第六步：清理旧缓存，防止内存占用过多（保持最多50个条目）
    if (translationCache.size > 50) {
      const firstKey = translationCache.keys().next().value
      translationCache.delete(firstKey)
    }
    
    return results
  } catch (error) {
    console.error('Translation error:', error)
    throw error
  }
}

/**
 * 从Chrome存储中获取扩展设置
 * @returns 扩展设置对象
 */
async function getSettings(): Promise<ExtensionSettings> {
  try {
    // 从Chrome的同步存储中获取设置
    const result = await chrome.storage.sync.get('settings')
    // 如果没有找到设置，返回默认设置
    return result.settings || DEFAULT_SETTINGS
  } catch (error) {
    console.error('Failed to get settings:', error)
    // 出错时返回默认设置，确保扩展能正常工作
    return DEFAULT_SETTINGS
  }
}

/**
 * 生成缓存键
 * 将翻译请求的各个参数组合成一个唯一的字符串作为缓存键
 * @param request 翻译请求对象
 * @returns 缓存键字符串
 */
function generateCacheKey(request: TranslationRequest): string {
  return `${request.selectedText}_${request.context}_${request.isWord}_${request.wordIndex || 0}`
}

/**
 * 扩展安装时的初始化函数
 * 创建右键菜单项，允许用户通过右键菜单触发翻译
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'translateSelection',           // 菜单项的唯一标识符
    title: '翻译选中文本',              // 显示的菜单文本
    contexts: ['selection']            // 只在有文本选中的时候显示此菜单项
  })
})

/**
 * 处理右键菜单点击事件
 * 当用户点击"翻译选中文本"菜单项时触发
 */
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  // 检查是否点击了我们的翻译菜单项，并且有选中文本
  if (info.menuItemId === 'translateSelection' && tab?.id && info.selectionText) {
    try {
      // 第一步：在目标页面中执行脚本，获取页面上下文
      const [tabResult] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getPageContext  // 注入getPageContext函数到页面中执行
      })
      
      // 第二步：处理获取到的上下文和选中文本
      const context = (tabResult?.result as string) || ''
      const selectedText = info.selectionText.trim()
      const isWord = selectedText.split(/\s+/).length === 1  // 判断是否为单词
      
      // 第三步：如果是单词，尝试找到它在上下文中的位置
      let wordIndex = -1
      if (isWord) {
        const words = context.split(/\s+/)
        wordIndex = words.findIndex(word =>
          word.toLowerCase().includes(selectedText.toLowerCase()) ||
          selectedText.toLowerCase().includes(word.toLowerCase())
        )
      }
      
      // 第四步：构建翻译请求对象
      const translationRequest: TranslationRequest = {
        selectedText,
        context,
        isWord,
        wordIndex: wordIndex >= 0 ? wordIndex : undefined
      }
      
      // 第五步：发送翻译请求到content script进行显示
      chrome.tabs.sendMessage(tab.id, {
        action: 'showTranslation',
        data: translationRequest
      })
      
    } catch (error) {
      console.error('Context menu translation error:', error)
    }
  }
})

/**
 * 获取页面上下文的函数
 * 这个函数会被注入到网页中执行，用于获取选中文本周围的上下文
 * @returns 选中文本所在的段落或文章内容作为上下文
 */
function getPageContext(): string {
  // 获取当前页面的文本选择对象
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return ''
  
  const range = selection.getRangeAt(0)
  const selectedText = range.toString()
  
  // 向上遍历DOM树，找到包含选中文本的块级元素
  let container = range.commonAncestorContainer
  while (container && container.nodeType !== Node.ELEMENT_NODE) {
    container = container.parentNode
  }
  
  if (container && container.nodeType === Node.ELEMENT_NODE) {
    const element = container as Element
    
    // 如果找到的元素本身就是段落或容器，直接返回其文本内容
    if (['P', 'DIV', 'ARTICLE', 'SECTION'].includes(element.tagName)) {
      return element.textContent || ''
    }
    
    // 否则尝试找到最近的段落或容器元素
    const parent = element.closest('p, div, article, section')
    if (parent) {
      return parent.textContent || ''
    }
  }
  
  // 如果找不到合适的上下文容器，返回页面body的前1000个字符作为后备
  return document.body?.textContent?.substring(0, 1000) || ''
}

// 监听存储变化，清理缓存
chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings) {
    translationCache.clear()
  }
})

console.log("Simple AI Translate background script loaded")
