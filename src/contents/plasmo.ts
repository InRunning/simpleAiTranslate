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

/**
 * 从background script加载扩展设置
 * 这个函数在页面加载时调用，获取用户配置的翻译服务设置
 */
async function loadSettings() {
  try {
    // 向background script请求设置数据
    const response = await chrome.runtime.sendMessage({ action: 'getSettings' })
    if (response.success) {
      settings = response.settings  // 更新本地设置变量
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
}

/**
 * 创建翻译结果展示面板
 * 这是一个模态对话框，用于显示AI翻译结果
 * @returns 创建好的面板DOM元素
 */
function createTranslationPanel(): HTMLElement {
  // 创建主面板容器
  const panel = document.createElement('div')
  panel.id = 'simple-ai-translate-panel'
  
  // 设置面板样式 - 居中显示的模态框
  panel.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);  /* 居中定位 */
    z-index: 10000;  /* 确保在最上层 */
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;  /* 内容过多时允许滚动 */
    font-family: Arial, sans-serif;
    font-size: 14px;
    display: none;  /* 初始隐藏 */
  `
  
  // 创建关闭按钮
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
  closeBtn.onclick = () => hideTranslationPanel()  // 点击关闭面板
  panel.appendChild(closeBtn)
  
  // 创建内容容器
  const contentContainer = document.createElement('div')
  contentContainer.id = 'translation-content'
  contentContainer.style.cssText = `
    padding: 20px;
    padding-top: 40px;  /* 为关闭按钮留出空间 */
  `
  panel.appendChild(contentContainer)
  
  // 将面板添加到页面body中
  document.body.appendChild(panel)
  return panel
}

/**
 * 显示翻译结果
 * 将AI翻译结果渲染到面板中，支持多个AI服务的结果展示
 * @param results 翻译结果数组，可能包含多个AI服务的翻译
 * @param selectedText 用户选择的原始文本
 */
function showTranslationResults(results: TranslationResult[], selectedText: string) {
  // 确保面板存在，不存在则创建
  if (!translationPanel) {
    translationPanel = createTranslationPanel()
  }
  
  // 获取内容容器
  const contentContainer = translationPanel.querySelector('#translation-content') as HTMLElement
  if (!contentContainer) return
  
  // 清空之前的内容
  contentContainer.innerHTML = ''
  
  // 创建标题，显示被翻译的文本
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
  
  // 遍历并显示每个AI服务的翻译结果
  results.forEach((result, index) => {
    // 处理错误结果
    if (result.error) {
      const errorDiv = document.createElement('div')
      errorDiv.style.cssText = `
        margin-bottom: 15px;
        padding: 10px;
        background-color: #f8d7da;  /* 红色背景表示错误 */
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        color: #721c24;
      `
      errorDiv.innerHTML = `<strong>${result.serviceName} 错误:</strong> ${result.error}`
      contentContainer.appendChild(errorDiv)
      return  // 跳过后续处理
    }
    
    // 创建正常结果的容器
    const resultDiv = document.createElement('div')
    resultDiv.style.cssText = `
      margin-bottom: 15px;
      padding: 15px;
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
    `
    
    // 显示AI服务名称
    const serviceName = document.createElement('h4')
    serviceName.textContent = result.serviceName
    serviceName.style.cssText = `
      margin: 0 0 10px 0;
      color: #007bff;
      font-size: 14px;
    `
    resultDiv.appendChild(serviceName)
    
    // 显示翻译结果文本
    const translation = document.createElement('div')
    translation.innerHTML = `<strong>翻译:</strong> ${result.translation}`
    translation.style.cssText = `
      margin-bottom: 8px;
      line-height: 1.4;
    `
    resultDiv.appendChild(translation)
    
    // 显示IPA音标（如果用户设置中启用了音标显示）
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
    
    // 显示详细含义（如果有）
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

/**
 * 隐藏翻译面板
 * 简单地将面板的display设置为none，使其不可见
 */
function hideTranslationPanel() {
  if (translationPanel) {
    translationPanel.style.display = 'none'
  }
}

/**
 * 获取选中文本的上下文信息
 * 智能地提取选中文本周围的段落或容器内容作为翻译上下文
 * 这有助于AI更好地理解文本含义，提供更准确的翻译
 * @param selectedText 用户选择的文本
 * @returns 上下文文本字符串
 */
function getContext(selectedText: string): string {
  // 获取当前页面的文本选择对象
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return ''
  
  // 获取选择范围对象
  const range = selection.getRangeAt(0)
  
  // 向上遍历DOM树，找到包含选中文本的合适容器元素
  let container = range.commonAncestorContainer
  while (container && container.nodeType !== Node.ELEMENT_NODE) {
    container = container.parentNode
  }
  
  if (container && container.nodeType === Node.ELEMENT_NODE) {
    const element = container as Element
    
    // 优先选择段落级别的元素作为上下文
    if (['P', 'DIV', 'ARTICLE', 'SECTION'].includes(element.tagName)) {
      return element.textContent || ''
    }
    
    // 如果当前元素不合适，查找最近的段落容器
    const parent = element.closest('p, div, article, section')
    if (parent) {
      return parent.textContent || ''
    }
  }
  
  // 后备方案：返回页面body的前1000个字符作为上下文
  return document.body?.textContent?.substring(0, 1000) || ''
}

/**
 * 执行翻译流程
 * 这是翻译功能的核心函数，负责收集翻译所需信息并发送请求
 * @param selectedText 用户选择的待翻译文本
 */
async function performTranslation(selectedText: string) {
  // 防止重复翻译的状态锁
  if (isTranslating) return
  
  // 设置翻译状态锁
  isTranslating = true
  
  try {
    // 第一步：获取上下文信息
    const context = getContext(selectedText)
    
    // 第二步：分析文本类型（单词还是句子）
    const isWord = selectedText.split(/\s+/).length === 1
    
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
    
    // 第五步：发送翻译请求到background script
    const response = await chrome.runtime.sendMessage({
      action: 'translate',
      data: translationRequest
    })
    
    // 第六步：处理翻译响应
    if (response.success) {
      // 成功：显示翻译结果
      showTranslationResults(response.results, selectedText)
    } else {
      // 失败：显示错误信息
      console.error('Translation failed:', response.error)
      showTranslationResults([{
        serviceId: 'error',
        serviceName: 'Error',
        translation: '',
        error: response.error
      }], selectedText)
    }
  } catch (error) {
    // 异常处理：显示错误信息
    console.error('Translation error:', error)
    showTranslationResults([{
      serviceId: 'error',
      serviceName: 'Error',
      translation: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    }], selectedText)
  } finally {
    // 释放翻译状态锁
    isTranslating = false
  }
}

/**
 * 处理文本选择事件
 * 这是用户交互的入口点，根据用户设置决定是否触发翻译
 */
function handleTextSelection() {
  // 获取当前文本选择
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed) return
  
  // 获取选中的文本内容
  const selectedText = selection.toString().trim()
  if (!selectedText) return
  
  // 检查是否满足翻译触发条件
  const shouldTranslate = settings.autoTranslate ||  // 自动翻译模式
    (window.event && (window.event as KeyboardEvent)[settings.triggerKey + 'Key'])  // 快捷键触发
  
  if (shouldTranslate) {
    hideTranslationPanel() // 先隐藏之前的翻译结果
    performTranslation(selectedText)  // 执行新的翻译
  }
}

/**
 * 监听来自background script的消息
 * 处理右键菜单触发的翻译请求
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 检查消息类型是否为显示翻译请求
  if (request.action === 'showTranslation') {
    hideTranslationPanel() // 先隐藏之前的翻译结果
    performTranslation(request.data.selectedText)  // 执行新的翻译
  }
  // 返回true保持消息通道开放（虽然这里不需要异步响应）
  return true
})

/**
 * 页面初始化事件监听器
 * 在页面加载完成后设置所有必要的事件监听器和配置
 */
window.addEventListener('load', async () => {
  console.log('Simple AI Translate content script loaded')
  
  // 第一步：加载用户设置
  await loadSettings()
  
  // 第二步：设置文本选择事件监听器
  // mouseup事件：鼠标释放时触发，处理鼠标选择文本
  document.addEventListener('mouseup', handleTextSelection)
  // keyup事件：键盘释放时触发，处理键盘选择文本
  document.addEventListener('keyup', handleTextSelection)
  
  // 第三步：设置点击事件监听器
  // 当用户点击页面其他地方时，自动隐藏翻译面板
  document.addEventListener('click', (event) => {
    // 检查点击目标是否在翻译面板内
    if (translationPanel && !translationPanel.contains(event.target as Node)) {
      hideTranslationPanel()
    }
  })
})

/**
 * 页面卸载时的清理事件监听器
 * 防止内存泄漏，移除添加的DOM元素
 */
window.addEventListener('unload', () => {
  // 检查翻译面板是否存在且有父节点
  if (translationPanel && translationPanel.parentNode) {
    // 从DOM中移除翻译面板
    translationPanel.parentNode.removeChild(translationPanel)
  }
})
