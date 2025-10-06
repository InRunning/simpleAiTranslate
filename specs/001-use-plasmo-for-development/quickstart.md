# Quick Start Guide: Plasmo Development Setup

## Prerequisites

### System Requirements
- macOS (as specified in requirements)
- Node.js 18+ (LTS version recommended)
- VS Code (primary development IDE)
- Chrome browser (latest stable version)

### Required Accounts
- Google Chrome Developer Account (for extension testing)
- AI provider accounts (OpenAI, Gemini, Claude, or custom providers)

## Installation Steps

### 1. Clone and Setup Repository
```bash
# Clone the repository
git clone https://github.com/your-username/simpleAiTranslate.git
cd simpleAiTranslate

# Switch to the feature branch
git checkout 001-use-plasmo-for-development

# Install Node.js dependencies
npm install
```

### 2. Plasmo Framework Installation
```bash
# Install Plasmo CLI globally
npm install -g plasmo

# Initialize Plasmo project (if not already done)
plasmo init
```

### 3. Development Environment Setup
```bash
# Install development dependencies
npm install --save-dev typescript @types/node jest

# Install Chrome extension specific dependencies
npm install @plasmo-sdk/chrome-extension
```

### 4. VS Code Configuration
Install these VS Code extensions:
- **Plasmo Extension** - Official Plasmo support
- **TypeScript Extension** - TypeScript language support
- **Chrome Debugger** - Chrome extension debugging
- **ESLint Extension** - Code linting

### 5. Chrome Browser Setup
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" toggle
3. Click "Load unpacked" and select the project's `build/chrome-mv3-dev` directory

## Development Workflow

### Starting Development Server
```bash
# Start Plasmo development server with hot-reloading
npm run dev

# Or using Plasmo CLI directly
plasmo dev
```

### Project Structure Overview
```
src/
├── components/          # React components for UI
│   ├── popup/          # Extension popup interface
│   ├── options/        # Extension options page
│   └── content/        # Content script UI
├── contents/           # Content scripts
│   ├── text-selector.ts  # Text selection logic
│   └── translation-ui.ts # Translation display
├── background/         # Background scripts
│   ├── service-worker.ts # Background service worker
│   └── ai-providers.ts   # AI provider integrations
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
│   ├── storage.ts     # Encrypted storage
│   ├── ai-client.ts   # AI API client
│   └── config.ts      # Configuration
└── types/             # TypeScript definitions
```

### Basic Development Tasks

#### 1. Creating a New Content Script
```bash
# Plasmo automatically creates content scripts from files in contents/ directory
# Create new content script
touch src/contents/new-feature.tsx

# Plasmo will automatically:
# - Generate manifest entry
# - Enable hot-reloading
# - Handle content script injection
```

#### 2. Adding UI Components
```typescript
// src/components/popup/TranslationComponent.tsx
import React from 'react'

export const TranslationComponent: React.FC = () => {
  return (
    <div className="translation-container">
      {/* Translation UI goes here */}
    </div>
  )
}
```

#### 3. Background Service Worker
```typescript
// src/background/service-worker.ts
import { createBackground } from '@plasmo-sdk/chrome-extension'

export default createBackground({
  // Background service worker logic
  async onMessage(request, sender, sendResponse) {
    // Handle messages from content scripts
  }
})
```

#### 4. AI Provider Integration
```typescript
// src/background/ai-providers.ts
export interface AIProvider {
  name: string
  translate: (text: string, context: string) => Promise<TranslationResult>
}

export class OpenAIProvider implements AIProvider {
  async translate(text: string, context: string): Promise<TranslationResult> {
    // OpenAI API integration
  }
}
```

### Testing the Extension

#### 1. Unit Testing
```bash
# Run unit tests
npm test

# Run tests with watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### 2. Integration Testing
```bash
# Run integration tests
npm run test:integration

# Test specific functionality
npm run test:translation
```

#### 3. End-to-End Testing
```bash
# Run E2E tests
npm run test:e2e

# Test extension in Chrome
npm run test:chrome
```

### Building for Production
```bash
# Build extension for production
npm run build

# Build for specific browser
npm run build:chrome
npm run build:firefox
npm run build:edge

# Package extension
npm run package
```

## Configuration

### Environment Variables
Create `.env.local` file:
```env
# AI Provider API Keys
OPENAI_API_KEY=your_openai_key_here
GEMINI_API_KEY=your_gemini_key_here
CLAUDE_API_KEY=your_claude_key_here

# Extension Configuration
EXTENSION_VERSION=1.0.0
EXTENSION_NAME=SimpleAiTranslate
```

### Plasmo Configuration
```typescript
// plasmo.config.ts
import { defineConfig } from 'plasmo'

export default defineConfig({
  manifest: {
    name: 'SimpleAiTranslate',
    version: '1.0.0',
    description: 'AI-powered text translation with context awareness'
  },
  // Development settings
  dev: {
    port: 3000,
    hotReload: true
  },
  // Build settings
  build: {
    outDir: 'build',
    target: 'chrome'
  }
})
```

## Common Development Tasks

### 1. Adding New AI Provider
1. Create provider class in `src/background/ai-providers.ts`
2. Implement required interface methods
3. Add provider to configuration UI
4. Update API contract if needed

### 2. Modifying Translation Logic
1. Update translation request handling in content scripts
2. Modify background service worker processing
3. Update UI components for new features
4. Add corresponding tests

### 3. Debugging Tips
- Use Chrome DevTools for content script debugging
- Check background service worker logs in Chrome extensions page
- Use VS Code debugger for TypeScript files
- Monitor network requests in Chrome DevTools

### 4. Performance Optimization
- Implement caching for repeated translations
- Optimize content script injection timing
- Use lazy loading for non-critical components
- Monitor memory usage in Chrome Task Manager

## Troubleshooting

### Common Issues

#### Extension Not Loading
1. Check Chrome extensions page for errors
2. Verify manifest.json is valid
3. Ensure all dependencies are installed
4. Check console for JavaScript errors

#### Hot-Reload Not Working
1. Verify Plasmo dev server is running
2. Check port conflicts
3. Restart development server
4. Clear Chrome extension cache

#### API Integration Issues
1. Verify API keys are correct
2. Check network requests in DevTools
3. Validate API endpoint URLs
4. Review API rate limits

### Getting Help
- Check Plasmo documentation: https://docs.plasmo.com/
- Review Chrome Extension documentation: https://developer.chrome.com/docs/extensions/
- Consult project issues: GitHub repository issues
- Join community forums for support

## Next Steps

After completing this quick start:
1. Review the full specification in `spec.md`
2. Examine the data model in `data-model.md`
3. Study API contracts in `contracts/`
4. Follow the task list in `tasks.md` for implementation
5. Run tests to verify setup
6. Begin feature development

This quick start provides the foundation for developing SimpleAiTranslate with Plasmo framework, ensuring a smooth development experience with hot-reloading, automated manifest management, and comprehensive testing capabilities.