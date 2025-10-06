import React, { useState, useEffect } from 'react';
import { useStorage } from '@plasmohq/storage';

// Extension popup UI
// This file handles the popup interface

console.log('SimpleAiTranslate: Popup component loaded');

function IndexPopup() {
  const [userSettings, setUserSettings] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const storage = new Storage();

  // Popup UI logic will be implemented here
  console.log('Popup component initialized');

  useEffect(() => {
    // Load user settings
    const loadSettings = async () => {
      const settings = await storage.get('userSettings');
      setUserSettings(settings);
    };

    // Load AI providers
    const loadProviders = async () => {
      const providerList = (await storage.get('aiProviders')) || [];
      setProviders(providerList);
    };

    loadSettings();
    loadProviders();
  }, []);

  const handleTranslate = async () => {
    // Translation logic will be implemented here
    console.log('Translate button clicked');

    // Get selected text from active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.id) {
      try {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => window.getSelection()?.toString().trim() || '',
        });

        const selectedText = results[0]?.result;
        if (selectedText) {
          console.log('Selected text:', selectedText);
          // Send translation request to background service
          chrome.runtime.sendMessage(
            {
              type: 'TRANSLATE_TEXT',
              text: selectedText,
            },
            response => {
              if (response.success) {
                console.log('Translation result:', response.result);
              } else {
                console.error('Translation failed:', response.error);
              }
            }
          );
        }
      } catch (error) {
        console.error('Error getting selected text:', error);
      }
    }
  };

  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div
      className="simple-ai-translate-popup"
      style={{
        width: '320px',
        padding: '16px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#333' }}>Simple AI Translate</h1>

      <div style={{ marginBottom: '16px' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
          Select text on any webpage and click translate to get AI-powered translations.
        </p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={handleTranslate}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Translate Selected Text
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
          Active Providers: {providers.filter(p => p.isActive).length}
        </div>
        <div style={{ fontSize: '12px', color: '#999' }}>
          Default: {userSettings?.defaultProviderId || 'Not set'}
        </div>
      </div>

      <div>
        <button
          onClick={handleOpenOptions}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#f0f0f0',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Settings & Options
        </button>
      </div>

      {/* Popup UI components will be added here */}
    </div>
  );
}

export default IndexPopup;
