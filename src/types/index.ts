// TypeScript type definitions
// This file contains common types used throughout the extension

export interface AIProvider {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  isActive: boolean;
  customPrompt?: string;
  settings?: Record<string, any>;
}

export interface TranslationRequest {
  id: string;
  selectedText: string;
  contextText: string;
  wordPosition?: number;
  requestType: 'word' | 'sentence' | 'paragraph';
  timestamp: Date;
  providerId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface TranslationResult {
  id: string;
  requestId: string;
  translatedText: string;
  ipaPronunciation?: string;
  confidence: number;
  providerResponse?: Record<string, any>;
  timestamp: Date;
}

export interface UserSettings {
  id: string;
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

export interface TranslationHistory {
  id: string;
  originalText: string;
  translatedText: string;
  contextText?: string;
  timestamp: Date;
  providerId: string;
  isBookmarked: boolean;
  isSynced: boolean;
}