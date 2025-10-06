
# Implementation Plan: Use Plasmo for Development

**Branch**: `001-use-plasmo-for-development` | **Date**: 2025-10-06 | **Spec**: [`/specs/001-use-plasmo-for-development/spec.md`](/specs/001-use-plasmo-for-development/spec.md)
**Input**: Feature specification from `/specs/001-use-plasmo-for-development/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code, or `AGENTS.md` for all other agents).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
This implementation plan focuses on integrating Plasmo framework to accelerate the development of SimpleAiTranslate Chrome extension. The primary requirement is to maintain all existing functionality (text selection, AI translation, multiple AI provider support) while improving developer experience through hot-reloading, automated manifest management, and reduced boilerplate code. The technical approach involves using Plasmo's LTS version to structure the extension with content scripts, background scripts, and popup components, ensuring encrypted data storage and user-controlled cloud sync capabilities.

## Technical Context
**Language/Version**: TypeScript/JavaScript (Plasmo framework)
**Primary Dependencies**: Plasmo (LTS version), Chrome Extension APIs
**Storage**: Encrypted local storage, user-controlled cloud sync
**Testing**: Jest, Chrome Extension Testing Framework
**Target Platform**: Chrome Extension (Manifest V3), macOS only
**Project Type**: Single project (Chrome Extension)
**Performance Goals**: Hot-reload within 2 seconds, translation requests within 5 seconds
**Constraints**: Chrome Manifest V3, macOS only, VS Code as primary IDE, encrypted data storage
**Scale/Scope**: Developer tool for single user, focused on development experience improvement

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Privacy Compliance
- [x] User text data handling follows privacy-first principle (encrypted storage, user-controlled sync)
- [x] API keys stored using Chrome's secure storage
- [x] No permanent data storage without explicit consent (user-controlled cloud sync)

### Multi-AI Provider Support
- [x] Provider implementation follows modular interface (maintain existing functionality)
- [x] Standardized API across all providers (OpenAI, Gemini, Claude, custom APIs)
- [x] Independent provider configurations (custom AI configuration support)
- [x] Custom AI base URLs, API keys, and models supported

### Custom Prompt Flexibility
- [x] Users can supply custom prompts for translation (maintain existing functionality)
- [x] Different prompt templates for word vs sentence contexts (existing requirement)
- [x] Custom prompts validated for provider compatibility (existing requirement)
- [x] Variable substitution supported in prompt templates (existing requirement)

### Extensibility Design
- [x] New providers can be added without core changes (modular provider interface)
- [x] Plugin pattern architecture implemented ( Plasmo's modular structure)
- [x] Dynamic configuration system in place (custom AI configuration support)

### Test-Driven Development
- [ ] Tests written before implementation (TDD) (NEEDS IMPLEMENTATION)
- [ ] Unit tests for all provider implementations (NEEDS IMPLEMENTATION)
- [ ] Integration tests for translation workflows (NEEDS IMPLEMENTATION)
- [ ] UI component interaction tests (NEEDS IMPLEMENTATION)

### Contextual Translation
- [x] Single word translations include context (maintain existing functionality)
- [x] Word position and context provided to AI (existing requirement)
- [x] IPA pronunciation included for single words (existing requirement)
- [x] Multiple AI results displayed side-by-side (existing requirement)

### Technical Constraints
- [x] Chrome Manifest V3 compliance (Plasmo supports Manifest V3)
- [x] Performance requirements met (5s translation, 2s hot-reload)
- [x] Security standards followed (HTTPS, encrypted storage)

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── components/          # Plasmo React components
│   ├── popup/          # Extension popup UI
│   ├── options/        # Options page
│   └── content/        # Content script UI components
├── contents/           # Plasmo content scripts
│   ├── text-selector.ts  # Text selection handling
│   └── translation-ui.ts # Translation display UI
├── background/         # Plasmo background scripts
│   ├── service-worker.ts # Background service worker
│   └── ai-providers.ts   # AI provider integrations
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
│   ├── storage.ts     # Encrypted storage utilities
│   ├── ai-client.ts   # AI API client
│   └── config.ts      # Configuration management
├── types/             # TypeScript type definitions
└── utils/             # General utilities

tests/
├── unit/              # Unit tests
│   ├── components/    # Component tests
│   ├── services/      # Service tests
│   └── utils/         # Utility tests
├── integration/       # Integration tests
│   ├── ai-providers/ # AI provider integration tests
│   └── extension/     # Extension integration tests
└── e2e/               # End-to-end tests
    └── chrome/        # Chrome extension E2E tests

plasmo.config.ts       # Plasmo configuration
package.json           # Project dependencies
tsconfig.json          # TypeScript configuration
```

**Structure Decision**: Single project structure using Plasmo's recommended Chrome extension layout with TypeScript. The structure separates content scripts, background scripts, and UI components while maintaining modularity for AI provider integrations and encrypted storage utilities.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh roo`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---
*Based on Constitution v1.0.0 - See `/memory/constitution.md`*
