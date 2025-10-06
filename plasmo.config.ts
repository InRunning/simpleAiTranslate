import type { PlasmoConfig } from "plasmo";

const config: PlasmoConfig = {
  manifest: {
    manifest_version: 3,
    name: "Simple AI Translate",
    version: "1.0.0",
    description: "A Chrome extension for AI-powered translation with multiple provider support",
    permissions: [
      "storage",
      "activeTab",
      "scripting"
    ],
    host_permissions: [
      "https://*/*"
    ],
    action: {
      default_title: "Simple AI Translate"
    },
    options_ui: {
      open_in_tab: true
    },
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self'"
    }
  },
  entry: {
    popup: "src/components/popup/index.tsx",
    options: "src/components/options/index.tsx"
  }
};

export default config;