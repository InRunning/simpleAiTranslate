# Phase 1: Data Model Design

## Core Entities

### 1. AIProvider
**Description**: Represents an AI service provider for translation functionality
**Fields**:
- `id`: string (unique identifier)
- `name`: string (display name)
- `baseUrl`: string (API endpoint URL)
- `apiKey`: string (encrypted authentication key)
- `model`: string (AI model name)
- `isActive`: boolean (provider enabled status)
- `customPrompt`: string (user-defined prompt template)
- `settings`: object (provider-specific configuration)

**Validation Rules**:
- `baseUrl` must be a valid HTTPS URL
- `apiKey` must be encrypted before storage
- `model` must be a valid model name for the provider
- `customPrompt` must support variable substitution

**State Transitions**:
- Active ↔ Inactive (user toggle)
- Configuration Update (user modifies settings)

### 2. TranslationRequest
**Description**: Represents a translation request from user text selection
**Fields**:
- `id`: string (unique identifier)
- `selectedText`: string (text selected by user)
- `contextText`: string (surrounding text for context)
- `wordPosition`: number (position of selected word in context)
- `requestType`: enum ('word' | 'sentence' | 'paragraph')
- `timestamp`: Date (request creation time)
- `providerId`: string (AI provider used)
- `status`: enum ('pending' | 'processing' | 'completed' | 'failed')

**Validation Rules**:
- `selectedText` must not be empty
- `contextText` must contain the selected text
- `wordPosition` must be valid within contextText
- `providerId` must reference an active AIProvider

**State Transitions**:
- Pending → Processing (sent to AI provider)
- Processing → Completed (successful translation)
- Processing → Failed (error occurred)

### 3. TranslationResult
**Description**: Represents the result of a translation request
**Fields**:
- `id`: string (unique identifier)
- `requestId`: string (reference to TranslationRequest)
- `translatedText`: string (translated text)
- `ipaPronunciation`: string (IPA pronunciation for words)
- `confidence`: number (confidence score 0-1)
- `providerResponse`: object (raw AI provider response)
- `timestamp`: Date (result creation time)

**Validation Rules**:
- `requestId` must reference a valid TranslationRequest
- `translatedText` must not be empty for completed requests
- `confidence` must be between 0 and 1
- `ipaPronunciation` required for word translations

### 4. UserSettings
**Description**: Represents user preferences and configuration
**Fields**:
- `id`: string (unique identifier)
- `defaultProviderId`: string (preferred AI provider)
- `autoSync`: boolean (enable cloud sync)
- `syncInterval`: number (sync frequency in minutes)
- `theme`: enum ('light' | 'dark' | 'system')
- `language`: string (interface language)
- `privacySettings`: object (data sharing preferences)
- `performanceSettings`: object (performance optimization settings)

**Validation Rules**:
- `defaultProviderId` must reference an active AIProvider
- `syncInterval` must be between 1 and 1440 minutes
- `privacySettings` must comply with constitutional requirements

### 5. TranslationHistory
**Description**: Represents historical translation data for user reference
**Fields**:
- `id`: string (unique identifier)
- `originalText`: string (original selected text)
- `translatedText`: string (translated result)
- `contextText`: string (original context)
- `timestamp`: Date (translation time)
- `providerId`: string (AI provider used)
- `isBookmarked`: boolean (user bookmarked status)
- `isSynced`: boolean (cloud sync status)

**Validation Rules**:
- `originalText` and `translatedText` must not be empty
- `providerId` must reference a valid AIProvider
- History entries older than 30 days auto-deleted unless bookmarked

## Entity Relationships

### Primary Relationships
- **AIProvider** 1 → N **TranslationRequest** (one provider handles many requests)
- **TranslationRequest** 1 → 1 **TranslationResult** (each request has one result)
- **UserSettings** 1 → 1 **AIProvider** (default provider relationship)
- **TranslationRequest** 1 → 1 **TranslationHistory** (completed requests become history)

### Data Flow
1. User selects text → **TranslationRequest** created
2. Request sent to **AIProvider** → **TranslationResult** generated
3. Successful result → **TranslationHistory** entry created
4. User preferences stored in **UserSettings**

## Storage Schema

### Chrome Storage API Usage
- **chrome.storage.local**: Encrypted sensitive data (API keys, personal history)
- **chrome.storage.sync**: User preferences and settings (with consent)
- **chrome.storage.session**: Temporary session data

### Data Encryption Strategy
- **Field-level encryption**: API keys, personal data
- **Encryption key**: Derived from user's Chrome profile (unique per device)
- **Sync data**: Encrypted before cloud synchronization

## Data Validation

### Input Validation
- All user inputs sanitized and validated
- API keys validated format before storage
- URLs validated for HTTPS requirement
- Text inputs limited to reasonable lengths

### Business Logic Validation
- Provider configuration validated before use
- Translation requests validated before processing
- Sync operations validated for user consent
- History retention policies enforced

## Security Considerations

### Data Protection
- Sensitive data encrypted at rest
- API keys never exposed in logs
- User data never shared without explicit consent
- Regular cleanup of temporary data

### Access Control
- Extension permissions minimized to required functionality
- Content script isolation maintained
- Secure communication between extension components
- User control over data sharing

## Performance Considerations

### Data Optimization
- Indexed fields for fast lookup
- Pagination for history data
- Lazy loading of non-critical data
- Efficient data serialization

### Storage Management
- Automatic cleanup of old history entries
- Storage quota monitoring
- Efficient compression of stored data
- Smart caching strategies

This data model design supports all constitutional requirements while providing a solid foundation for the Plasmo-based Chrome extension implementation.