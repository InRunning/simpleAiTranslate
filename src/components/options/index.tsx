import React, { useState, useEffect } from "react";
import { useStorage } from "@plasmohq/storage";

// Options page component
// This file handles the options page interface

console.log("SimpleAiTranslate: Options component loaded");

function IndexOptions() {
  const [userSettings, setUserSettings] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [newProvider, setNewProvider] = useState({
    name: "",
    baseUrl: "",
    apiKey: "",
    model: "",
    isActive: true
  });
  const storage = new Storage();

  // Options page logic will be implemented here
  console.log("Options component initialized");

  useEffect(() => {
    // Load user settings
    const loadSettings = async () => {
      const settings = await storage.get("userSettings");
      setUserSettings(settings);
    };

    // Load AI providers
    const loadProviders = async () => {
      const providerList = await storage.get("aiProviders") || [];
      setProviders(providerList);
    };

    loadSettings();
    loadProviders();
  }, []);

  const handleSettingsChange = async (field: string, value: any) => {
    const updatedSettings = { ...userSettings, [field]: value };
    setUserSettings(updatedSettings);
    await storage.set("userSettings", updatedSettings);
  };

  const handleAddProvider = async () => {
    if (!newProvider.name || !newProvider.baseUrl || !newProvider.model) {
      alert("Please fill in all required fields");
      return;
    }

    const provider = {
      id: Date.now().toString(),
      ...newProvider
    };

    const updatedProviders = [...providers, provider];
    setProviders(updatedProviders);
    await storage.set("aiProviders", updatedProviders);

    // Reset form
    setNewProvider({
      name: "",
      baseUrl: "",
      apiKey: "",
      model: "",
      isActive: true
    });
  };

  const handleDeleteProvider = async (providerId: string) => {
    const updatedProviders = providers.filter(p => p.id !== providerId);
    setProviders(updatedProviders);
    await storage.set("aiProviders", updatedProviders);
  };

  const handleToggleProvider = async (providerId: string) => {
    const updatedProviders = providers.map(p => 
      p.id === providerId ? { ...p, isActive: !p.isActive } : p
    );
    setProviders(updatedProviders);
    await storage.set("aiProviders", updatedProviders);
  };

  return (
    <div className="simple-ai-translate-options" style={{
      maxWidth: "800px",
      margin: "0 auto",
      padding: "24px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ margin: "0 0 24px 0", fontSize: "24px", color: "#333" }}>
        Simple AI Translate Options
      </h1>
      
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "#333" }}>
          User Settings
        </h2>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#666" }}>
            Default Provider:
          </label>
          <select
            value={userSettings?.defaultProviderId || ""}
            onChange={(e) => handleSettingsChange("defaultProviderId", e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          >
            <option value="">Select a provider</option>
            {providers.filter(p => p.isActive).map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "flex", alignItems: "center", fontSize: "14px", color: "#666" }}>
            <input
              type="checkbox"
              checked={userSettings?.autoSync || false}
              onChange={(e) => handleSettingsChange("autoSync", e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            Enable cloud sync
          </label>
        </div>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#666" }}>
            Theme:
          </label>
          <select
            value={userSettings?.theme || "system"}
            onChange={(e) => handleSettingsChange("theme", e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>
      
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "#333" }}>
          AI Providers
        </h2>
        
        <div style={{ marginBottom: "16px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#333" }}>
            Add New Provider
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666" }}>
                Name *
              </label>
              <input
                type="text"
                value={newProvider.name}
                onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "6px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666" }}>
                Base URL *
              </label>
              <input
                type="text"
                value={newProvider.baseUrl}
                onChange={(e) => setNewProvider({ ...newProvider, baseUrl: e.target.value })}
                style={{
                  width: "100%",
                  padding: "6px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666" }}>
                API Key
              </label>
              <input
                type="password"
                value={newProvider.apiKey}
                onChange={(e) => setNewProvider({ ...newProvider, apiKey: e.target.value })}
                style={{
                  width: "100%",
                  padding: "6px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666" }}>
                Model *
              </label>
              <input
                type="text"
                value={newProvider.model}
                onChange={(e) => setNewProvider({ ...newProvider, model: e.target.value })}
                style={{
                  width: "100%",
                  padding: "6px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>
          </div>
          
          <button
            onClick={handleAddProvider}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            Add Provider
          </button>
        </div>
        
        <div>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#333" }}>
            Configured Providers
          </h3>
          
          {providers.length === 0 ? (
            <p style={{ fontSize: "14px", color: "#666" }}>
              No providers configured yet. Add your first provider above.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {providers.map(provider => (
                <div
                  key={provider.id}
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    backgroundColor: "#f9f9f9"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div>
                      <strong style={{ fontSize: "14px", color: "#333" }}>
                        {provider.name}
                      </strong>
                      {provider.isActive ? (
                        <span style={{ marginLeft: "8px", fontSize: "12px", color: "#4CAF50" }}>
                          Active
                        </span>
                      ) : (
                        <span style={{ marginLeft: "8px", fontSize: "12px", color: "#999" }}>
                          Inactive
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <button
                        onClick={() => handleToggleProvider(provider.id)}
                        style={{
                          marginRight: "8px",
                          padding: "4px 8px",
                          backgroundColor: provider.isActive ? "#ff9800" : "#4CAF50",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        {provider.isActive ? "Disable" : "Enable"}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteProvider(provider.id)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    <div>URL: {provider.baseUrl}</div>
                    <div>Model: {provider.model}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Options page components will be added here */}
    </div>
  );
}

export default IndexOptions;