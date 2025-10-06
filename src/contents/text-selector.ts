import { useStorage } from "@plasmohq/storage"

// Text selection content script
// This file handles text selection on web pages

console.log("SimpleAiTranslate: Text selector content script loaded");

export default function TextSelector() {
  // Text selection logic will be implemented here
  console.log("Text selector initialized");
  
  // Initialize text selection functionality
  const initializeTextSelection = () => {
    document.addEventListener("mouseup", handleTextSelection);
  };
  
  const handleTextSelection = (event: MouseEvent) => {
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText && selectedText.length > 0) {
      console.log("Text selected:", selectedText);
      // Translation request logic will be implemented here
    }
  };
  
  // Clean up event listeners
  const cleanup = () => {
    document.removeEventListener("mouseup", handleTextSelection);
  };
  
  initializeTextSelection();
  
  // Return cleanup function for Plasmo
  return cleanup;
}