import '@servicenow/sdk/global'
import {
    Table,
    StringColumn,
    IntegerColumn,
    ReferenceColumn,
    ChoiceColumn,
    HtmlColumn,
    ScriptColumn,
    MultiLineTextColumn,
    GuidColumn,
} from '@servicenow/sdk/core'

export const x_1676392_sdlc_a_0_story_manifest = Table({
    name: 'x_1676392_sdlc_a_0_story_manifest',
    label: 'Story Manifest',
    extensible: false,
    accessibleFrom: 'public',
    allowWebServiceAccess: true,
    allowNewFields: true,
    allowUiActions: true,
    allowClientScripts: true,
    schema: {
        story: ReferenceColumn({
            label: 'Story',
            referenceTable: 'rm_story',
            mandatory: true,
        }),
        uplifted_story: HtmlColumn({
            label: 'Uplifted Story',
            maxLength: 65536,
        }),
        uplifted_acceptance_criteria: HtmlColumn({
            label: 'Uplifted Acceptance Criteria',
            maxLength: 65536,
        }),
        generated_code: ScriptColumn({
            label: 'Generated Code',
            maxLength: 65536,
        }),
        generated_unit_tests: ScriptColumn({
            label: 'Generated Unit Tests',
            maxLength: 65536,
        }),
        stakeholder_test_steps: HtmlColumn({
            label: 'Stakeholder Test Steps',
            maxLength: 65536,
        }),
        atf_suite_sys_id: GuidColumn({
            label: 'ATF Suite Sys ID',
            maxLength: 32,
        }),
        atf_test_sys_id: GuidColumn({
            label: 'ATF Test Sys ID',
            maxLength: 32,
        }),
        orchestration_status: ChoiceColumn({
            label: 'Orchestration Status',
            default: 'pending',
            dropdown: 'dropdown_with_none',
            choices: {
                pending:   { label: 'Pending' },
                running:   { label: 'Running' },
                completed: { label: 'Completed' },
                partial:   { label: 'Partial' },
                failed:    { label: 'Failed' },
            },
        }),
        orchestration_log: MultiLineTextColumn({
            label: 'Orchestration Log',
            maxLength: 65536,
        }),
        llm_model_used: StringColumn({
            label: 'LLM Model Used',
            maxLength: 100,
        }),
        tokens_consumed: IntegerColumn({
            label: 'Tokens Consumed',
            default: '0',
        }),
        last_run_by: ReferenceColumn({
            label: 'Last Run By',
            referenceTable: 'sys_user',
        }),
    },
})
