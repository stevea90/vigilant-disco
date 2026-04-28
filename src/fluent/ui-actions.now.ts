import '@servicenow/sdk/global'
import { UiAction } from '@servicenow/sdk/core'

UiAction({
    $id: Now.ID['ua_uplift_story'],
    table: 'rm_story',
    name: 'AI: Uplift Story',
    actionName: 'ai_uplift_story',
    active: true,
    form: { showLink: true, showButton: false },
    showUpdate: true,
    showInsert: false,
    condition: 'current.canWrite()',
    order: 200,
    hint: 'Rewrite this story using INVEST principles and Gherkin acceptance criteria via AI',
    script: `(function aiUpliftStory() {
    var orchestrator = new x_1676392_sdlc_a_0.AIOrchestrator(current);
    var success = orchestrator.upliftStory();
    if (success) {
        gs.addInfoMessage('Story uplifted successfully. View the Story Manifest for AI outputs.');
    } else {
        gs.addErrorMessage('Story uplift failed. Check the orchestration log in the Story Manifest.');
    }
    action.setRedirectURL(current);
})();`,
})

UiAction({
    $id: Now.ID['ua_generate_code'],
    table: 'rm_story',
    name: 'AI: Generate Code',
    actionName: 'ai_generate_code',
    active: true,
    form: { showLink: true, showButton: false },
    showUpdate: true,
    showInsert: false,
    condition: 'current.canWrite()',
    order: 201,
    hint: 'Generate ServiceNow code artifacts from the uplifted story via AI',
    script: `(function aiGenerateCode() {
    var orchestrator = new x_1676392_sdlc_a_0.AIOrchestrator(current);
    var success = orchestrator.generateCode();
    if (success) {
        gs.addInfoMessage('Code generated successfully. View the Story Manifest for generated artifacts.');
    } else {
        gs.addErrorMessage('Code generation failed. Ensure AI: Uplift Story has been run first.');
    }
    action.setRedirectURL(current);
})();`,
})

UiAction({
    $id: Now.ID['ua_generate_test_steps'],
    table: 'rm_story',
    name: 'AI: Generate Test Steps',
    actionName: 'ai_generate_test_steps',
    active: true,
    form: { showLink: true, showButton: false },
    showUpdate: true,
    showInsert: false,
    condition: 'current.canWrite()',
    order: 202,
    hint: 'Generate stakeholder test steps and Jasmine unit tests via AI',
    script: `(function aiGenerateTestSteps() {
    var orchestrator = new x_1676392_sdlc_a_0.AIOrchestrator(current);
    orchestrator.generateStakeholderTestSteps();
    orchestrator.generateUnitTests();
    gs.addInfoMessage('Test steps and unit tests generated. View the Story Manifest.');
    action.setRedirectURL(current);
})();`,
})

UiAction({
    $id: Now.ID['ua_create_atf_records'],
    table: 'rm_story',
    name: 'AI: Create ATF Records',
    actionName: 'ai_create_atf_records',
    active: true,
    form: { showLink: true, showButton: false },
    showUpdate: true,
    showInsert: false,
    condition: 'current.canWrite()',
    order: 203,
    hint: 'Create ATF Suite, Test and Steps from stakeholder test steps via AI',
    script: `(function aiCreateATFRecords() {
    var orchestrator = new x_1676392_sdlc_a_0.AIOrchestrator(current);
    var result = orchestrator.createATFRecords();
    if (result.suiteId) {
        gs.addInfoMessage(
            'ATF records created. <a href="sys_atf_suite.do?sys_id=' + result.suiteId + '">View ATF Suite</a>'
        );
    } else {
        gs.addErrorMessage('ATF record creation failed. Ensure AI: Generate Test Steps has been run first.');
    }
    action.setRedirectURL(current);
})();`,
})
