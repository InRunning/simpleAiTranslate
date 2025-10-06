import React, { useState, useEffect } from "react";
import { useStorage } from "@plasmohq/storage";

// Translation UI content script
// This file handles the translation display UI

console.log("SimpleAiTranslate: Translation UI content script loaded");

export default function TranslationUI() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [translationResult, setTranslationResult] = useState("");
  
  // Translation UI logic will be implemented here
  console.log("Translation UI initialized");
  
  useEffect(() => {
    // Listen for translation requests
    const handleTranslationRequest = (event: CustomEvent) => {
      const { text } = event.detail;
      setSelectedText(text);
      setIsVisible(true);
      // Translation logic will be implemented here
    };
    
    document.addEventListener("translationRequest", handleTranslationRequest as EventListener);
    
    return () => {
      document.removeEventListener("translationRequest", handleTranslationRequest as EventListener);
    };
  }, []);
  
  const handleClose = () => {
    setIsVisible(false);
    setSelectedText("");
    setTranslationResult("");
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="simple-ai-translate-ui" style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      zIndex: 10000,
      maxWidth: "400px",
      width: "90%"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h3 style={{ margin: 0, fontSize: "16px" }}>Simple AI Translate</h3>
        <button 
          onClick={handleClose}
          style={{
            background: "none",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            padding: "0"
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{ marginBottom: "12px" }}>
        <strong>Original:</strong>
        <p style={{ margin: "4px 0", fontSize: "14px" }}>{selectedText}</p>
      </div>
      
      <div style={{ marginBottom: "12px" }}>
        <strong>Translation:</strong>
        <p style={{ margin: "4px 0", fontSize: "14px" }}>
          {translationResult || "Translating..."}
        </p>
      </div>
      
      {/* Translation UI components will be added here */}
    </div>
  );
}