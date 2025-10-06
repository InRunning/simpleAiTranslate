# Tasks: Use Plasmo for Development

**Input**: Design documents from `/specs/001-use-plasmo-for-development/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project structure from plan.md

## Phase 3.1: Setup
- [ ] T001 Create Plasmo project structure per implementation plan
- [ ] T002 Initialize TypeScript project with Plasmo LTS dependencies
- [ ] T003 [P] Configure ESLint and Prettier for TypeScript code formatting

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] AI Provider API contract test in tests/contract/test_ai_provider_contract.ts
- [ ] T005 [P] Translation request API contract test in tests/contract/test_translation_request_contract.ts
- [ ] T006 [P] User settings API contract test in tests/contract/test_user_settings_contract.ts
- [ ] T007 [P] Translation history API contract test in tests/contract/test_translation_history_contract.ts
- [ ] T008 [P] Privacy compliance test in tests/integration/test_privacy_compliance.ts
- [ ] T009 [P] Content script isolation test in tests/integration/test_content_script_isolation.ts
- [ ] T010 [P] AI provider switching integration test in tests/integration/test_provider_switching.ts
- [ ] T011 [P] Translation workflow integration test in tests/integration/test_translation_workflow.ts
- [ ] T012 [P] Encrypted storage unit test in tests/unit/test_encrypted_storage.ts
- [ ] T013 [P] Custom prompt validation unit test in tests/unit/test_custom_prompt_validation.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T014 [P] AIProvider entity model in src/types/ai-provider.ts
- [ ] T015 [P] TranslationRequest entity model in src/types/translation-request.ts
- [ ] T016 [P] TranslationResult entity model in src/types/translation-result.ts
- [ ] T017 [P] UserSettings entity model in src/types/user-settings.ts
- [ ] T018 [P] TranslationHistory entity model in src/types/translation-history.ts
- [ ] T019 [P] Encrypted storage utilities in src/lib/storage.ts
- [ ] T020 [P] AI client base interface in src/lib/ai-client.ts
- [ ] T021 [P] OpenAI provider implementation in src/background/providers/openai-provider.ts
- [ ] T022 [P] Gemini provider implementation in src/background/providers/gemini-provider.ts
- [ ] T023 [P] Claude provider implementation in src/background/providers/claude-provider.ts
- [ ] T024 [P] Custom provider implementation in src/background/providers/custom-provider.ts
- [ ] T025 [P] Background service worker in src/background/service-worker.ts
- [ ] T026 [P] Text selection content script in src/contents/text-selector.tsx
- [ ] T027 [P] Translation UI content script in src/contents/translation-ui.tsx
- [ ] T028 [P] Popup UI components in src/components/popup/index.tsx
- [ ] T029 [P] Options page components in src/components/options/index.tsx
- [ ] T030 [P] Configuration management in src/lib/config.ts
- [ ] T031 [P] Custom prompt manager in src/lib/prompt-manager.ts

## Phase 3.4: Integration
- [ ] T032 Connect AI providers to translation workflow
- [ ] T033 Implement content script to background service worker communication
- [ ] T034 Add translation request queuing and caching system
- [ ] T035 Integrate custom prompts with translation workflow
- [ ] T036 Implement user settings synchronization
- [ ] T037 Add translation history management and cleanup
- [ ] T038 Implement error handling and user feedback system
- [ ] T039 Add performance monitoring and optimization
- [ ] T040 Implement Plasmo configuration file (plasmo.config.ts)

## Phase 3.5: Polish
- [ ] T041 [P] Unit tests for all AI providers in tests/unit/test-ai-providers.ts
- [ ] T042 [P] Unit tests for storage utilities in tests/unit/test-storage.ts
- [ ] T043 [P] Unit tests for prompt manager in tests/unit/test-prompt-manager.ts
- [ ] T044 [P] Integration tests for translation workflow in tests/integration/test-translation-workflow.ts
- [ ] T045 Performance tests (<5s translation, <2s hot-reload)
- [ ] T046 [P] Update package.json with proper scripts and dependencies
- [ ] T047 [P] Create README.md with setup and usage instructions
- [ ] T048 Privacy audit and security review
- [ ] T049 Chrome Web Store preparation and validation

## Dependencies
- Tests (T004-T013) before implementation (T014-T031)
- T014-T018 (entity models) block T019-T031 (implementation tasks)
- T019 (storage) blocks T020-T031 (implementation tasks)
- Implementation before integration (T032-T040)
- Integration before polish (T041-T049)

## Parallel Example
```
# Launch T004-T013 together:
Task: "AI Provider API contract test in tests/contract/test_ai_provider_contract.ts"
Task: "Translation request API contract test in tests/contract/test_translation_request_contract.ts"
Task: "User settings API contract test in tests/contract/test_user_settings_contract.ts"
Task: "Translation history API contract test in tests/contract/test_translation_history_contract.ts"
Task: "Privacy compliance test in tests/integration/test_privacy_compliance.ts"
Task: "Content script isolation test in tests/integration/test_content_script_isolation.ts"
Task: "AI provider switching integration test in tests/integration/test_provider_switching.ts"
Task: "Translation workflow integration test in tests/integration/test_translation_workflow.ts"
Task: "Encrypted storage unit test in tests/unit/test_encrypted_storage.ts"
Task: "Custom prompt validation unit test in tests/unit/test_custom_prompt_validation.ts"

# Launch T014-T018 together:
Task: "AIProvider entity model in src/types/ai-provider.ts"
Task: "TranslationRequest entity model in src/types/translation-request.ts"
Task: "TranslationResult entity model in src/types/translation-result.ts"
Task: "UserSettings entity model in src/types/user-settings.ts"
Task: "TranslationHistory entity model in src/types/translation-history.ts"

# Launch T021-T024 together:
Task: "OpenAI provider implementation in src/background/providers/openai-provider.ts"
Task: "Gemini provider implementation in src/background/providers/gemini-provider.ts"
Task: "Claude provider implementation in src/background/providers/claude-provider.ts"
Task: "Custom provider implementation in src/background/providers/custom-provider.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From API Contracts**:
   - Each endpoint in api-contract.yaml → contract test [P]
   - Each schema → entity model task [P]

2. **From Data Model**:
   - Each entity in data-model.md → TypeScript interface task [P]
   - Each relationship → integration task

3. **From Privacy Requirements**:
   - Each privacy constraint → privacy compliance test [P]
   - Data handling requirement → secure storage task

4. **From Provider Requirements**:
   - Each AI provider → provider implementation task [P]
   - Provider interface → interface contract test [P]

5. **From Plasmo Framework**:
   - Plasmo configuration → configuration task
   - Content scripts → content script implementation [P]
   - Background service worker → service worker task

6. **From Performance Requirements**:
   - Hot-reload requirement → Plasmo configuration
   - Translation speed → performance test

7. **Ordering**:
   - Setup → Contract Tests → Entity Models → Implementation → Integration → Polish
   - Dependencies block parallel execution
   - Tests MUST precede implementation (TDD principle)

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All API contracts have corresponding tests
- [ ] All entities have TypeScript interface definitions
- [ ] All privacy requirements have compliance tests
- [ ] All tests come before implementation (TDD compliance)
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
- [ ] Plasmo-specific constraints addressed (hot-reload, manifest management)
- [ ] Performance requirements included in test tasks
- [ ] Security requirements have corresponding test tasks
- [ ] All AI providers have implementation tasks
- [ ] Content scripts and background service worker are implemented