/**
 * Simple AI Translate - 内容脚本 (Content Script)
 *
 * 这是Chrome扩展的内容脚本，负责在网页中注入翻译功能
 * 主要功能：
 * 1. 监听用户的文本选择行为
 * 2. 创建和管理翻译结果展示面板
 * 3. 与background script通信获取翻译结果
 * 4. 处理用户交互事件
 */

import type { PlasmoCSConfig } from "plasmo"
import type { TranslationRequest, TranslationResult, ExtensionSettings } from "../types"
import { DEFAULT_SETTINGS } from "../types"

/**
 * Plasmo内容脚本配置
 * matches: ["<all_urls>"] - 在所有网页上运行
 * all_frames: true - 在页面所有iframe中也运行
 */
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

// ===== 全局变量声明 =====
let translationPanel: HTMLElement | null = null    // 翻译结果面板DOM元素
let settings: ExtensionSettings = DEFAULT_SETTINGS  // 扩展设置配置
let isTranslating = false                           // 翻译状态锁，防止重复请求

// 加载设置
async function loadSettings() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getSettings' })
    if (response.success) {
      settings = response.settings
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
}

// 创建翻译结果面板
function createTranslationPanel(): HTMLElement {
  const panel = document.createElement('div')
  panel.id = 'simple-ai-translate-panel'
  panel.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    font-family: Arial, sans-serif;
    font-size: 14px;
    display: none;
  `
  
  // 添加关闭按钮
  const closeBtn = document.createElement('button')
  closeBtn.textContent = '×'
  closeBtn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
  `
  closeBtn.onclick = () => hideTranslationPanel()
  panel.appendChild(closeBtn)
  
  // 添加内容容器
  const contentContainer = document.createElement('div')
  contentContainer.id = 'translation-content'
  contentContainer.style.cssText = `
    padding: 20px;
    padding-top: 40px;
  `
  panel.appendChild(contentContainer)
  
  document.body.appendChild(panel)
  return panel
}

// 显示翻译结果
function showTranslationResults(results: TranslationResult[], selectedText: string) {
  if (!translationPanel) {
    translationPanel = createTranslationPanel()
  }
  
  const contentContainer = translationPanel.querySelector('#translation-content') as HTMLElement
  if (!contentContainer) return
  
  contentContainer.innerHTML = ''
  
  // 添加标题
  const title = document.createElement('h3')
  title.textContent = `翻译结果: "${selectedText}"`
  title.style.cssText = `
    margin: 0 0 15px 0;
    color: #333;
    font-size: 16px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  `
  contentContainer.appendChild(title)
  
  // 显示结果
  results.forEach((result, index) => {
    if (result.error) {
      const errorDiv = document.createElement('div')
      errorDiv.style.cssText = `
        margin-bottom: 15px;
        padding: 10px;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        color: #721c24;
      `
      errorDiv.innerHTML = `<strong>${result.serviceName} 错误:</strong> ${result.error}`
      contentContainer.appendChild(errorDiv)
      return
    }
    
    const resultDiv = document.createElement('div')
    resultDiv.style.cssText = `
      margin-bottom: 15px;
      padding: 15px;
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
    `
    
    // 服务名称
    const serviceName = document.createElement('h4')
    serviceName.textContent = result.serviceName
    serviceName.style.cssText = `
      margin: 0 0 10px 0;
      color: #007bff;
      font-size: 14px;
    `
    resultDiv.appendChild(serviceName)
    
    // 翻译结果
    const translation = document.createElement('div')
    translation.innerHTML = `<strong>翻译:</strong> ${result.translation}`
    translation.style.cssText = `
      margin-bottom: 8px;
      line-height: 1.4;
    `
    resultDiv.appendChild(translation)
    
    // IPA音标
    if (result.ipa && settings.showIpa) {
      const ipa = document.createElement('div')
      ipa.innerHTML = `<strong>音标:</strong> ${result.ipa}`
      ipa.style.cssText = `
        margin-bottom: 8px;
        font-style: italic;
        color: #6c757d;
      `
      resultDiv.appendChild(ipa)
    }
    
    // 详细含义
    if (result.meaning) {
      const meaning = document.createElement('div')
      meaning.innerHTML = `<strong>含义:</strong> ${result.meaning}`
      meaning.style.cssText = `
        margin-top: 8px;
        line-height: 1.4;
      `
      resultDiv.appendChild(meaning)
    }
    
    contentContainer.appendChild(resultDiv)
  })
  
  // 显示面板
  translationPanel.style.display = 'block'
}

// 隐藏翻译面板
function hideTranslationPanel() {
  if (translationPanel) {
    translationPanel.style.display = 'none'
  }
}

// 获取选中文本的上下文
function getContext(selectedText: string): string {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return ''
  
  const range = selection.getRangeAt(0)
  
  // 尝试获取包含选中文本的段落
  let container = range.commonAncestorContainer
  while (container && container.nodeType !== Node.ELEMENT_NODE) {
    container = container.parentNode
  }
  
  if (container && container.nodeType === Node.ELEMENT_NODE) {
    const element = container as Element
    
    // 如果是段落或类似元素，直接返回其文本
    if (['P', 'DIV', 'ARTICLE', 'SECTION'].includes(element.tagName)) {
      return element.textContent || ''
    }
    
    // 否则尝试找到最近的段落
    const parent = element.closest('p, div, article, section')
    if (parent) {
      return parent.textContent || ''
    }
  }
  
  // 如果找不到合适的上下文，返回页面文本的前1000个字符
  return document.body?.textContent?.substring(0, 1000) || ''
}

// 执行翻译
async function performTranslation(selectedText: string) {
  if (isTranslating) return
  
  isTranslating = true
  
  try {
    const context = getContext(selectedText)
    const isWord = selectedText.split(/\s+/).length === 1
    
    // 查找单词在上下文中的位置
    let wordIndex = -1
    if (isWord) {
      const words = context.split(/\s+/)
      wordIndex = words.findIndex(word =>
        word.toLowerCase().includes(selectedText.toLowerCase()) ||
        selectedText.toLowerCase().includes(word.toLowerCase())
      )
    }
    
    const translationRequest: TranslationRequest = {
      selectedText,
      context,
      isWord,
      wordIndex: wordIndex >= 0 ? wordIndex : undefined
    }
    
    // 发送翻译请求到background script
    const response = await chrome.runtime.sendMessage({
      action: 'translate',
      data: translationRequest
    })
    
    if (response.success) {
      showTranslationResults(response.results, selectedText)
    } else {
      console.error('Translation failed:', response.error)
      showTranslationResults([{
        serviceId: 'error',
        serviceName: 'Error',
        translation: '',
        error: response.error
      }], selectedText)
    }
  } catch (error) {
    console.error('Translation error:', error)
    showTranslationResults([{
      serviceId: 'error',
      serviceName: 'Error',
      translation: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    }], selectedText)
  } finally {
    isTranslating = false
  }
}

// 处理文本选择
function handleTextSelection() {
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed) return
  
  const selectedText = selection.toString().trim()
  if (!selectedText) return
  
  // 检查触发条件
  const shouldTranslate = settings.autoTranslate ||
    (window.event && (window.event as KeyboardEvent)[settings.triggerKey + 'Key'])
  
  if (shouldTranslate) {
    hideTranslationPanel() // 先隐藏之前的结果
    performTranslation(selectedText)
  }
}

// 监听来自background script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showTranslation') {
    hideTranslationPanel() // 先隐藏之前的结果
    performTranslation(request.data.selectedText)
  }
})

// 初始化
window.addEventListener('load', async () => {
  console.log('Simple AI Translate content script loaded')
  
  await loadSettings()
  
  // 监听文本选择
  document.addEventListener('mouseup', handleTextSelection)
  document.addEventListener('keyup', handleTextSelection)
  
  // 点击页面其他地方时隐藏翻译面板
  document.addEventListener('click', (event) => {
    if (translationPanel && !translationPanel.contains(event.target as Node)) {
      hideTranslationPanel()
    }
  })
})

// 清理
window.addEventListener('unload', () => {
  if (translationPanel && translationPanel.parentNode) {
    translationPanel.parentNode.removeChild(translationPanel)
  }
})
