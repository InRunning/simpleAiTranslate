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
- [ ] T010 [P] Custom prompt validation test in tests/unit/test_custom_prompt_validation.js
- [ ] T011 [P] Prompt template variable substitution test in tests/unit/test_prompt_substitution.js

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T012 [P] Provider interface base class in src/providers/base_provider.js
- [ ] T013 [P] OpenAI provider implementation in src/providers/openai_provider.js
- [ ] T014 [P] Gemini provider implementation in src/providers/gemini_provider.js
- [ ] T015 [P] Claude provider implementation in src/providers/claude_provider.js
- [ ] T016 [P] Custom provider configuration in src/providers/custom_provider.js
- [ ] T017 [P] Secure API key storage in src/storage/api_key_storage.js
- [ ] T018 [P] Custom prompt manager in src/prompts/prompt_manager.js
- [ ] T019 [P] Prompt template engine in src/prompts/template_engine.js
- [ ] T020 [P] Translation context manager in src/context/translation_context.js
- [ ] T021 [P] Content script manager in src/content/content_manager.js
- [ ] T022 [P] Background service worker in src/background/service_worker.js
- [ ] T023 [P] UI components for provider selection in src/ui/provider_selection.js
- [ ] T024 [P] UI components for custom prompt configuration in src/ui/prompt_configuration.js
- [ ] T025 [P] Translation result display in src/ui/result_display.js

## Phase 3.4: Integration
- [ ] T026 Connect providers to UI components
- [ ] T027 Implement content script to background communication
- [ ] T028 Add translation request queuing and caching
- [ ] T029 Integrate custom prompts with translation workflow
- [ ] T030 Implement privacy controls and data clearing
- [ ] T031 Add performance monitoring and optimization

## Phase 3.5: Polish
- [ ] T032 [P] Unit tests for all providers in tests/unit/test_providers.js
- [ ] T033 [P] Unit tests for custom prompt system in tests/unit/test_prompt_system.js
- [ ] T034 Performance tests (<5s translation, <500ms startup)
- [ ] T035 [P] Update docs/extension_usage.md
- [ ] T036 [P] Update docs/custom_prompt_guide.md
- [ ] T037 Privacy audit and security review
- [ ] T038 Chrome Web Store preparation and validation

## Dependencies
- Tests (T004-T011) before implementation (T012-T025)
- T012 blocks T013-T016
- T017 blocks T018-T020
- T018 blocks T019
- T019 blocks T021
- T021 blocks T022
- Implementation before integration (T026-T031)
- Integration before polish (T032-T038)

## Parallel Example
```
# Launch T004-T011 together:
Task: "Privacy compliance test in tests/contract/test_privacy_compliance.js"
Task: "Provider interface test in tests/contract/test_provider_interface.js"
Task: "Translation workflow test in tests/integration/test_translation_workflow.js"
Task: "Content script isolation test in tests/integration/test_content_script_isolation.js"
Task: "API key storage test in tests/unit/test_api_key_storage.js"
Task: "Multi-provider switching test in tests/integration/test_provider_switching.js"
Task: "Custom prompt validation test in tests/unit/test_custom_prompt_validation.js"
Task: "Prompt template variable substitution test in tests/unit/test_prompt_substitution.js"
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
   
3. **From Custom Prompt Requirements**:
   - Custom prompt validation → prompt validation test [P]
   - Prompt template engine → template substitution test [P]
   - User prompt configuration → UI configuration task
   
4. **From User Stories**:
   - Each translation workflow → integration test [P]
   - UI interaction → component test [P]
   - Quickstart scenarios → validation tasks

5. **From Extension Constraints**:
   - Manifest V3 requirement → service worker task
   - Content script isolation → isolation test [P]
   - Performance requirement → performance test

6. **Ordering**:
   - Setup → Privacy Tests → Provider Tests → Prompt Tests → Integration Tests → Provider Implementation → Prompt Implementation → Integration → Polish
   - Dependencies block parallel execution
   - Tests MUST precede implementation (TDD principle)

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All privacy requirements have compliance tests
- [ ] All providers have interface tests and implementation tasks
- [ ] All custom prompt requirements have validation tests
- [ ] All tests come before implementation (TDD compliance)
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
- [ ] Extension-specific constraints addressed (Manifest V3, content scripts)
- [ ] Performance requirements included in test tasks
- [ ] Security requirements have corresponding test tasks
- [ ] Custom prompt system has both unit and integration tests