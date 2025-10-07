# Simple AI Translate

一个基于AI的Chrome扩展，支持选中文本进行智能翻译。

## ✨ 功能特性

- 🎯 **智能文本选择翻译**: 选中文本后即可翻译
- 🧠 **上下文感知翻译**: 提供段落上下文，获得更准确的翻译
- 🔤 **单词翻译**: 单词翻译时提供IPA音标和详细含义
- 🤖 **多AI服务支持**: 支持OpenAI、Gemini、Claude等多种AI服务
- ⚙️ **自定义配置**: 可自定义AI服务配置、提示词等
- 🎨 **优雅界面**: 现代化的UI设计，支持深色模式

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建扩展

```bash
npm run build
```

### 加载扩展

1. 打开Chrome浏览器，进入 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `build/chrome-mv3-prod` 文件夹

## 📖 使用说明

详细的使用说明请查看 [USAGE.md](./USAGE.md)

## 🛠️ 技术栈

- **框架**: [Plasmo](https://docs.plasmo.com/framework) - 现代Chrome扩展开发框架
- **语言**: TypeScript
- **UI**: React + CSS
- **AI服务**: OpenAI, Gemini, Claude等

## 📁 项目结构

```
src/
├── background.ts      # 后台脚本，处理API调用和右键菜单
├── popup.tsx          # 扩展弹窗界面
├── options.tsx        # 设置页面，配置AI服务
├── contents/
│   └── plasmo.ts      # 内容脚本，处理文本选择和翻译
├── types.ts           # TypeScript类型定义
├── ai-service.ts      # AI服务管理器
└── style.css          # 全局样式文件
```

## 🔧 配置

### AI服务配置

扩展支持以下AI服务：

- **OpenAI**: 需要API密钥，支持gpt-3.5-turbo等模型
- **Gemini**: 需要API密钥，支持gemini-pro等模型
- **Claude**: 需要API密钥，支持claude-3-haiku-20240307等模型
- **自定义服务**: 支持任何兼容OpenAI API格式的服务

### 设置选项

- 显示/隐藏IPA音标
- 显示多个AI结果对比
- 自动翻译开关
- 自定义触发键（Alt/Ctrl/Shift）

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

参考项目：

- [Plasmo Framework](https://docs.plasmo.com/framework)
- [Saladict](https://github.com/crimx/ext-saladict)
- [Lingo Link](https://github.com/chengfengfengwang/lingo-link)
