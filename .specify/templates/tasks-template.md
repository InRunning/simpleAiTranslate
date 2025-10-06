# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
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
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup
- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] Privacy compliance test in tests/contract/test_privacy_compliance.js
- [ ] T005 [P] Provider interface test in tests/contract/test_provider_interface.js
- [ ] T006 [P] Translation workflow test in tests/integration/test_translation_workflow.js
- [ ] T007 [P] Content script isolation test in tests/integration/test_content_script_isolation.js
- [ ] T008 [P] API key storage test in tests/unit/test_api_key_storage.js
- [ ] T009 [P] Multi-provider switching test in tests/integration/test_provider_switching.js

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T010 [P] Provider interface base class in src/providers/base_provider.js
- [ ] T011 [P] OpenAI provider implementation in src/providers/openai_provider.js
- [ ] T012 [P] Gemini provider implementation in src/providers/gemini_provider.js
- [ ] T013 [P] Claude provider implementation in src/providers/claude_provider.js
- [ ] T014 [P] Custom provider configuration in src/providers/custom_provider.js
- [ ] T015 [P] Secure API key storage in src/storage/api_key_storage.js
- [ ] T016 [P] Translation context manager in src/context/translation_context.js
- [ ] T017 [P] Content script manager in src/content/content_manager.js
- [ ] T018 [P] Background service worker in src/background/service_worker.js
- [ ] T019 [P] UI components for provider selection in src/ui/provider_selection.js
- [ ] T020 [P] Translation result display in src/ui/result_display.js

## Phase 3.4: Integration
- [ ] T021 Connect providers to UI components
- [ ] T022 Implement content script to background communication
- [ ] T023 Add translation request queuing and caching
- [ ] T024 Implement privacy controls and data clearing
- [ ] T025 Add performance monitoring and optimization

## Phase 3.5: Polish
- [ ] T026 [P] Unit tests for all providers in tests/unit/test_providers.js
- [ ] T027 Performance tests (<5s translation, <500ms startup)
- [ ] T028 [P] Update docs/extension_usage.md
- [ ] T029 Privacy audit and security review
- [ ] T030 Chrome Web Store preparation and validation

## Dependencies
- Tests (T004-T009) before implementation (T010-T020)
- T010 blocks T011-T014
- T015 blocks T016-T018
- T016 blocks T021
- T017 blocks T022
- Implementation before integration (T021-T025)
- Integration before polish (T026-T030)

## Parallel Example
```
# Launch T004-T009 together:
Task: "Privacy compliance test in tests/contract/test_privacy_compliance.js"
Task: "Provider interface test in tests/contract/test_provider_interface.js"
Task: "Translation workflow test in tests/integration/test_translation_workflow.js"
Task: "Content script isolation test in tests/integration/test_content_script_isolation.js"
Task: "API key storage test in tests/unit/test_api_key_storage.js"
Task: "Multi-provider switching test in tests/integration/test_provider_switching.js"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Privacy Requirements**:
   - Each privacy constraint → privacy compliance test [P]
   - Data handling requirement → secure storage task
   
2. **From Provider Requirements**:
   - Each AI provider → provider implementation task [P]
   - Provider interface → interface contract test [P]
   
3. **From User Stories**:
   - Each translation workflow → integration test [P]
   - UI interaction → component test [P]
   - Quickstart scenarios → validation tasks

4. **From Extension Constraints**:
   - Manifest V3 requirement → service worker task
   - Content script isolation → isolation test [P]
   - Performance requirement → performance test

5. **Ordering**:
   - Setup → Privacy Tests → Provider Tests → Integration Tests → Provider Implementation → Integration → Polish
   - Dependencies block parallel execution
   - Tests MUST precede implementation (TDD principle)

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All privacy requirements have compliance tests
- [ ] All providers have interface tests and implementation tasks
- [ ] All tests come before implementation (TDD compliance)
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
- [ ] Extension-specific constraints addressed (Manifest V3, content scripts)
- [ ] Performance requirements included in test tasks
- [ ] Security requirements have corresponding test tasks