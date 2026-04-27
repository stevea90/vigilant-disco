# SDLC AI Orchestrator

**Scope:** `x_snc_ai_sdlc`  
**Version:** 1.0.0  
**Minimum ServiceNow Version:** Tokyo (supports Helsinki JS level)

Automates the full SDLC pipeline from User Story to Verified Code using LLM APIs (Anthropic Claude or OpenAI GPT-4o). Operates entirely within a scoped application — no global scope modifications required.

---

## Features

| Feature | Trigger | Output |
|---|---|---|
| **Story Uplift** | UI Action on rm_story | INVEST-compliant story + Gherkin acceptance criteria |
| **Code Generation** | UI Action on rm_story | Business Rule, Script Include, Client Script boilerplate |
| **Unit Tests** | UI Action on rm_story | Jasmine test suite for generated Script Include |
| **Stakeholder Test Steps** | UI Action on rm_story | Numbered, plain-English manual test steps (HTML) |
| **ATF Creation** | UI Action on rm_story | sys_atf_suite + sys_atf_test + sys_atf_step records |
| **AI Command Center** | Navigate to `x_snc_ai_sdlc_ai_command_center.do` | Dashboard of all story manifest statuses |

---

## Prerequisites

- ServiceNow Tokyo or later
- **Agile Development** plugin active (`com.snc.sdlc.agile.2.0`) — provides the `rm_story` table
- **Automated Test Framework** plugin active (`com.snc.test_management2`) — required for ATF creation
- Outbound network access to `api.anthropic.com` (port 443) or `api.openai.com`

---

## Installation

### 1. Import via Studio Source Control

1. In your ServiceNow instance, open **Studio** (`/nav_to.do?uri=sys_app_studio.do`)
2. Click **Import From Source Control**
3. Enter the repository URL and credentials
4. Select branch `claude/sdlc-ai-orchestrator-MjCgr`
5. Click **Import**

### 2. Import via Update Set (alternative)

Package all XML files in `x_snc_ai_sdlc/` into a single Update Set XML in the following load order:
1. `sys_scope/` → `sys_app/` → `sys_properties/`
2. `sys_db_object/` → `sys_dictionary/` → `sys_choice/`
3. `sys_rest_message/` → `sys_rest_message_fn/` → `sys_rest_message_fn_headers/`
4. `sys_script_include/` (PromptTemplates, LLMAPIClient, ATFBuilder, ManifestHelper, AIOrchestrator)
5. `sys_ui_action/` → `sys_script/` (Business Rule)
6. `sys_ui_view/` → `sys_ui_section/` → `sys_ui_list/` → `sys_ui_page/`

---

## Post-Installation Configuration

Navigate to **System Properties > SDLC AI Orchestrator** (filter list by `x_snc_ai_sdlc.*`):

| Property | Required | Description |
|---|---|---|
| `x_snc_ai_sdlc.llm_provider` | Yes | `anthropic` (default) or `openai` |
| `x_snc_ai_sdlc.anthropic_api_key` | If using Anthropic | Your `sk-ant-...` key |
| `x_snc_ai_sdlc.openai_api_key` | If using OpenAI | Your `sk-...` key |
| `x_snc_ai_sdlc.anthropic_model` | No | Default: `claude-3-5-sonnet-20241022` |
| `x_snc_ai_sdlc.openai_model` | No | Default: `gpt-4o` |
| `x_snc_ai_sdlc.llm_max_tokens` | No | Default: `4096` |
| `x_snc_ai_sdlc.llm_temperature` | No | Default: `0.2` |
| `x_snc_ai_sdlc.auto_create_manifest` | No | Default: `true` |
| `x_snc_ai_sdlc.debug_logging` | No | Default: `false` |

> **Security note:** API keys use `password2` type and are encrypted on the instance. They are intentionally blank in source control and must be set manually after each import.

---

## Usage Guide

All AI actions appear as **Related Links** on the `rm_story` form.

### Step 1 — AI: Uplift Story
Rewrites the story `description` and `acceptance_criteria` fields using the INVEST framework and Gherkin BDD syntax. Output is saved to the Story AI Manifest record linked to the story.

### Step 2 — AI: Generate Code
Reads the uplifted story and generates ServiceNow-specific JavaScript:
- A **Script Include** implementing the story's business logic
- A **Business Rule** stub wiring the Script Include to a table event
- A **Client Script** stub for any UI-side behavior

All three code blocks are saved to the `generated_code` field on the manifest.

### Step 3 — AI: Generate Test Steps
Runs two operations in one click:
- Generates a **Jasmine unit test suite** for the Script Include
- Generates **stakeholder test steps** (numbered HTML, human-readable)

### Step 4 — AI: Create ATF Records
Calls the LLM to produce structured ATF step definitions from the acceptance criteria, then:
- Creates a `sys_atf_suite` record: *"AI Generated: {story title}"*
- Creates a `sys_atf_test` record linked to the suite
- Creates `sys_atf_step` records for each acceptance criteria scenario

A link to the ATF Suite is displayed as an info message on redirect.

---

## Data Model

**Table:** `x_snc_ai_sdlc_story_manifest`  
**Label:** Story AI Manifest

| Field | Type | Description |
|---|---|---|
| `story` | Reference (rm_story) | The linked story |
| `uplifted_story` | HTML | INVEST-rewritten story text |
| `uplifted_acceptance_criteria` | HTML | Gherkin-formatted criteria |
| `generated_code` | Script | Generated ServiceNow JS code |
| `generated_unit_tests` | Script | Jasmine test suite |
| `stakeholder_test_steps` | HTML | Manual test steps |
| `atf_suite_sys_id` | GUID | sys_id of created ATF Suite |
| `atf_test_sys_id` | GUID | sys_id of created ATF Test |
| `orchestration_status` | Choice | pending / running / completed / partial / failed |
| `orchestration_log` | Journal | Timestamped run log |
| `llm_model_used` | String | Model ID from last successful call |
| `tokens_consumed` | Integer | Cumulative tokens used |
| `last_run_by` | Reference (sys_user) | User who last triggered orchestration |

---

## Architecture

```
rm_story (form)
    │
    ├─ [UI Action] AI: Uplift Story
    ├─ [UI Action] AI: Generate Code
    ├─ [UI Action] AI: Generate Test Steps
    └─ [UI Action] AI: Create ATF Records
              │
              ▼
       AIOrchestrator (Script Include)
          │          │
          │          └──► ATFBuilder ──► sys_atf_suite
          │                              sys_atf_test
          │                              sys_atf_step
          ▼
       LLMAPIClient (Script Include)
          │
          ▼
       RESTMessageV2 → "AI LLM API" (sys_rest_message)
          │
          ├──► Anthropic Claude API (api.anthropic.com/v1/messages)
          └──► OpenAI API          (api.openai.com/v1/chat/completions)
          │
          ▼
       PromptTemplates (Script Include)
       [story uplift / code gen / unit tests / test steps / ATF steps]
          │
          ▼
  x_snc_ai_sdlc_story_manifest (table)
          │
          ▼
  ManifestHelper (AbstractAjaxProcessor)
          │
          ▼
  AI Command Center (sys_ui_page → x_snc_ai_sdlc_ai_command_center.do)
```

---

## Troubleshooting

**"No uplifted story found" error on Generate Code**  
Run *AI: Uplift Story* first. Code generation depends on the uplifted fields.

**LLM call returns an error / manifest status = failed**  
1. Check `orchestration_log` field on the manifest record for the exact error.
2. Verify the API key is set in System Properties.
3. Verify outbound network access from the instance to `api.anthropic.com`.
4. Set `x_snc_ai_sdlc.debug_logging=true` and retry — verbose output appears in System Log (`/syslog_list.do`).

**ATF records not created / "plugin not active" error**  
Ensure the ATF plugin (`com.snc.test_management2`) is active in your instance.

**JSON parse error in orchestration log**  
The LLM returned a response wrapped in markdown code fences. The `LLMAPIClient` strips these automatically, but if the model returns an unexpected format, the raw content is logged. Try lowering `x_snc_ai_sdlc.llm_temperature` to `0.1`.

---

## Extending the App

**Add a new LLM provider:**  
1. Add a new HTTP function to the `AI LLM API` REST Message.
2. Add the provider detection branch in `LLMAPIClient._sendMessage()`.
3. Add new property values to `x_snc_ai_sdlc.llm_provider`.

**Customize prompt templates:**  
All prompts are isolated in `PromptTemplates.xml`. Edit the relevant `get*System()` or `get*User()` method. No changes to orchestration logic needed.

**Add a new orchestration step:**  
1. Add a `get*System/User()` method pair to `PromptTemplates`.
2. Add a public method to `AIOrchestrator` following the existing pattern.
3. Add a new field to `x_snc_ai_sdlc_story_manifest` to store the output.
4. Add a UI Action on `rm_story` to trigger the new method.
