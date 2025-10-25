import { defineConfig } from 'vite'              // 引入 Vite 配置函数
import react from '@vitejs/plugin-react'         // 引入 React 插件，支持 JSX 转换

// Vite 多入口构建：popup/options HTML 页面 + background/content 脚本
export default defineConfig(({ mode }) => ({      // 导出 Vite 配置，接受 mode 参数（development/production）
  plugins: [react()],                             // 启用 React 插件，处理 JSX 语法和 React 热更新
  publicDir: 'public',                            // 指定静态资源目录，这些文件会被复制到构建输出根目录
  
  resolve: {                                      // 路径解析配置
    alias: {                                      // 别名配置，简化导入路径
      '@': '/src'                                 // 将 '@' 别名指向 'src' 目录，便于使用 '@/components' 等导入
    }
  },
  
  build: {                                        // 构建配置
    outDir: 'dist',                               // 指定构建输出目录
    emptyOutDir: true,                            // 构建前清空输出目录（Chrome扩展推荐所有环境）
    sourcemap: mode !== 'production',             // 只在非生产模式生成源码映射，便于调试
    target: 'chrome110',                          // 指定构建目标浏览器版本，优化打包结果
    
    rollupOptions: {                              // Rollup 构建选项配置
      input: {                                    // 多入口文件配置，支持 Chrome 扩展多页面架构
        popup: '/src/popup/index.html',           // 弹出窗口页面入口
        options: '/src/options/index.html',       // 选项页面入口
        background: '/src/background/index.ts',   // 后台脚本入口（Service Worker）
        content: '/src/content/index.tsx'         // 内容脚本入口（注入到网页）
      },
      
      output: {                                   // 输出文件配置
        entryFileNames: (assetInfo) => {          // 自定义入口文件名规则
          if (assetInfo.name === 'background') return 'background.js'    // 后台脚本固定文件名
          if (assetInfo.name === 'content') return 'content.js'          // 内容脚本固定文件名
          return '[name].js'                      // 其他入口使用原名称
        },
        chunkFileNames: 'assets/[name].js',       // 代码分割后的文件名规则
        assetFileNames: 'assets/[name][extname]'  // 静态资源（CSS、图片等）的文件名规则
      }
    }
  }
}))

// 注释：
// emptyOutDir 在不同项目类型中的建议：
// 1. Chrome 扩展：始终建议 true（确保版本发布干净）
// 2. Web 应用：开发环境建议 true，生产环境可根据需要调整
// 3. 静态网站：通常建议 true，避免文件残留