// AI provider integrations
// This file handles AI provider implementations

console.log("SimpleAiTranslate: AI providers module loaded");

// AI provider logic will be implemented here
export interface AIProvider {
  id: string;
  name: string;
  baseUrl: string;
  model: string;
  isActive: boolean;
}

export class AIProviderManager {
  private providers: Map<string, AIProvider> = new Map();
  
  constructor() {
    console.log("AI Provider Manager initialized");
  }
  
  // Provider management methods will be implemented here
}