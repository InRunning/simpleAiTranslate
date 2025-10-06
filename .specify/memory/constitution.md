<!--
Sync Impact Report:
- Version change: null → 1.0.0
- List of modified principles: N/A (initial creation)
- Added sections: Core Principles, Technical Constraints, Development Workflow, Governance
- Removed sections: N/A
- Templates requiring updates:
  ✅ plan-template.md (Constitution Check section)
  ✅ spec-template.md (mandatory sections)
  ✅ tasks-template.md (task categorization)
- Follow-up TODOs: None
-->

# SimpleAiTranslate Constitution

## Core Principles

### I. User Privacy First
All user text data MUST be processed with maximum privacy protection. Text selections MUST NOT be stored permanently without explicit user consent. API keys and authentication credentials MUST be stored locally using Chrome's secure storage mechanisms. Users MUST have full control over their data and can clear it at any time.

### II. Multi-AI Provider Support
The extension MUST support multiple AI providers (OpenAI, Gemini, Claude, and custom providers). Each provider implementation MUST be modular and interchangeable. Provider configurations MUST be stored independently to allow users to switch between providers without losing settings. The API interface MUST be standardized across all providers.

### III. Extensibility Design
New AI providers MUST be addable without modifying core functionality. The architecture MUST follow plugin pattern where providers implement a common interface. UI components MUST be reusable across different provider implementations. Configuration system MUST be dynamic to accommodate new provider settings without code changes.

### IV. Test-Driven Development (NON-NEGOTIABLE)
TDD is mandatory: Tests MUST be written before implementation. All provider implementations MUST have corresponding unit tests. Integration tests MUST cover end-to-end translation workflows. UI components MUST have automated interaction tests. Red-Green-Refactor cycle MUST be strictly enforced for all features.

### V. Contextual Translation Intelligence
Single word translations MUST include surrounding context (sentence/paragraph). Word position and context MUST be provided to AI for accurate meaning determination. IPA pronunciation MUST be included for single word translations. Multiple AI results MUST be displayed side-by-side for comparison when enabled.

## Technical Constraints

### Browser Compatibility
Extension MUST support Chrome Manifest V3. Code MUST be compatible with latest stable Chrome version. Background scripts MUST use service workers instead of persistent background pages. Content scripts MUST be isolated to prevent conflicts with other extensions.

### Performance Requirements
Translation requests MUST complete within 5 seconds for standard text lengths. UI MUST remain responsive during API calls. Extension startup time MUST NOT exceed 500ms. Memory usage MUST stay below 50MB during normal operation.

### Security Standards
All API communications MUST use HTTPS. API keys MUST be encrypted in local storage. Content scripts MUST have minimal permissions. No user data should be sent to third-party analytics without explicit consent.

## Development Workflow

### Code Review Process
All changes MUST undergo peer review before merge. Review checklist MUST include privacy impact assessment. Performance implications MUST be evaluated for each change. Provider implementations MUST be reviewed for API compliance.

### Quality Gates
All tests MUST pass before merge. Code coverage MUST be maintained above 80%. Extension MUST pass Chrome Web Store validation. Manual testing checklist MUST be completed for each release.

### Release Process
Semantic versioning MUST be followed (MAJOR.MINOR.PATCH). Changelog MUST include privacy and security impact notes. Release notes MUST clearly document any breaking changes. All provider configurations MUST be backward compatible when possible.

## Governance

This Constitution supersedes all other project practices and guidelines. Amendments MUST be documented with clear rationale and impact assessment. All pull requests MUST verify compliance with constitutional principles. Complexity deviations MUST be explicitly justified and documented. Use README.md and docs/ for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2025-10-06 | **Last Amended**: 2025-10-06