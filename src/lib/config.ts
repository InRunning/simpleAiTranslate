// Configuration management
// This file handles extension configuration

console.log("SimpleAiTranslate: Configuration management loaded");

export interface AppConfig {
  defaultProviderId: string;
  autoSync: boolean;
  syncInterval: number;
  theme: 'light' | 'dark' | 'system';
  language: string;
  privacySettings: {
    shareAnalytics: boolean;
    shareUsageData: boolean;
  };
  performanceSettings: {
    enableCache: boolean;
    cacheSize: number;
  };
}

export class ConfigManager {
  private defaultConfig: AppConfig = {
    defaultProviderId: '',
    autoSync: false,
    syncInterval: 60,
    theme: 'system',
    language: 'en',
    privacySettings: {
      shareAnalytics: false,
      shareUsageData: false
    },
    performanceSettings: {
      enableCache: true,
      cacheSize: 100
    }
  };
  
  constructor() {
    console.log("Configuration manager initialized");
  }
  
  // Configuration methods will be implemented here
  async getConfig(): Promise<AppConfig> {
    // Implementation will be added later
    console.log("Getting configuration");
    return this.defaultConfig;
  }
  
  async updateConfig(config: Partial<AppConfig>): Promise<void> {
    // Implementation will be added later
    console.log("Updating configuration");
  }
}