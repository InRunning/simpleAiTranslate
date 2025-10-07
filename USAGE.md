# Simple AI Translate - 使用说明

## 功能概述

Simple AI Translate 是一个基于AI的Chrome扩展，提供智能翻译功能。它支持选中文本进行翻译，并提供上下文相关的准确翻译结果。

## 主要功能

- 🎯 **智能文本选择翻译**: 选中文本后即可翻译
- 🧠 **上下文感知翻译**: 提供段落上下文，获得更准确的翻译
- 🔤 **单词翻译**: 单词翻译时提供IPA音标和详细含义
- 🤖 **多AI服务支持**: 支持OpenAI、Gemini、Claude等多种AI服务
- ⚙️ **自定义配置**: 可自定义AI服务配置、提示词等
- 🎨 **优雅界面**: 现代化的UI设计，支持深色模式

## 安装方法

1. 下载或克隆此项目
2. 运行 `npm install` 安装依赖
3. 运行 `npm run build` 构建扩展
4. 打开Chrome浏览器，进入 `chrome://extensions/`
5. 开启"开发者模式"
6. 点击"加载已解压的扩展程序"
7. 选择 `build/chrome-mv3-prod` 文件夹

## 使用方法

### 基本使用

1. **选中文本翻译**:
   - 在网页上选中文本
   - 按住Alt键（或配置的触发键）
   - 或右键选中文本，选择"翻译选中文本"

2. **配置AI服务**:
   - 点击扩展图标
   - 点击"打开设置"
   - 在"AI服务配置"标签中配置API密钥和模型

### 配置选项

#### AI服务配置
- **OpenAI**: 配置API密钥和模型（如gpt-3.5-turbo）
- **Gemini**: 配置API密钥和模型（如gemini-pro）
- **Claude**: 配置API密钥和模型（如claude-3-haiku-20240307）
- **自定义服务**: 添加其他兼容OpenAI API格式的服务

#### 通用设置
- **显示IPA音标**: 开启/关闭音标显示
- **显示多个AI结果**: 同时显示多个AI服务的翻译结果
- **自动翻译**: 选中文本后自动翻译（无需按键）
- **触发键**: 设置翻译触发键（Alt/Ctrl/Shift）

## API密钥获取

### OpenAI
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 注册并登录
3. 在API Keys页面创建新的API密钥

### Gemini
1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 创建API密钥

### Claude
1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 创建API密钥

## 使用技巧

1. **单词翻译**: 选择单个单词时，扩展会自动查找其在段落中的位置，提供更准确的含义
2. **句子翻译**: 选择句子或短语时，会提供完整的翻译
3. **多结果对比**: 开启"显示多个AI结果"可以对比不同AI服务的翻译质量
4. **自定义提示词**: 可以修改提示词来获得特定风格的翻译结果

## 故障排除

### 翻译失败
- 检查API密钥是否正确配置
- 确认网络连接正常
- 检查API服务是否可用

### 扩展无法加载
- 确认构建过程没有错误
- 检查manifest.json权限配置
- 查看Chrome扩展页面的错误信息

### 样式问题
- 尝试刷新页面
- 检查是否有CSS冲突

## 开发说明

### 项目结构
```
src/
├── background.ts      # 后台脚本
├── popup.tsx          # 弹窗界面
├── options.tsx        # 设置页面
├── contents/
│   └── plasmo.ts      # 内容脚本
├── types.ts           # 类型定义
├── ai-service.ts      # AI服务管理
└── style.css          # 样式文件
```

### 开发命令
- `npm run dev`: 开发模式构建
- `npm run build`: 生产构建
- `npm run package`: 打包扩展

## 许可证

本项目基于MIT许可证开源。

## 贡献

欢迎提交Issue和Pull Request来改进这个扩展！