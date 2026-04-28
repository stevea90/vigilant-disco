export var PromptTemplates = Class.create();
PromptTemplates.prototype = {
    initialize: function() {},

    getStoryUpliftSystem: function() {
        return 'You are an expert Agile coach and Business Analyst specialising in ServiceNow implementations. Rewrite user stories using the INVEST framework (Independent, Negotiable, Valuable, Estimable, Small, Testable). Return ONLY valid JSON. No markdown code fences, no preamble.';
    },

    getStoryUpliftUser: function(story, description, acceptanceCriteria) {
        return 'Rewrite this user story using INVEST principles and Gherkin acceptance criteria.\n\nStory: ' + story + '\nDescription: ' + description + '\nAcceptance Criteria: ' + acceptanceCriteria + '\n\nReturn JSON: {"uplifted_story": "<html>INVEST-compliant story...</html>", "uplifted_acceptance_criteria": "<html><ul><li>Given/When/Then scenarios...</li></ul></html>"}';
    },

    getCodeGenSystem: function() {
        return 'You are a ServiceNow platform expert. Generate production-ready ServiceNow JavaScript artifacts (Business Rules, Script Includes, Client Scripts) based on user stories. Follow ServiceNow best practices and scoped app patterns. Return ONLY valid JSON. No markdown code fences, no preamble.';
    },

    getCodeGenUser: function(upliftedStory, acceptanceCriteria) {
        return 'Generate ServiceNow code artifacts for this story.\n\nStory: ' + upliftedStory + '\nAcceptance Criteria: ' + acceptanceCriteria + '\n\nReturn JSON: {"artifacts": [{"type": "Script Include|Business Rule|Client Script", "name": "ArtifactName", "code": "// full code here"}]}';
    },

    getUnitTestSystem: function() {
        return 'You are a ServiceNow test automation expert. Generate Jasmine unit tests for ServiceNow Script Includes using the ATF server-side test framework. Return ONLY valid JSON. No markdown code fences, no preamble.';
    },

    getUnitTestUser: function(generatedCode) {
        return 'Generate Jasmine unit tests for this ServiceNow code.\n\nCode:\n' + generatedCode + '\n\nReturn JSON: {"unit_tests": "describe(\'Suite\', function() { it(\'should...\', function() { ... }); });"}';
    },

    getStakeholderTestSystem: function() {
        return 'You are a QA expert. Generate clear, human-readable manual test steps for business stakeholders (non-technical). Steps should be actionable and verifiable. Return ONLY valid JSON. No markdown code fences, no preamble.';
    },

    getStakeholderTestUser: function(acceptanceCriteria) {
        return 'Generate manual test steps for stakeholders based on these acceptance criteria.\n\nAcceptance Criteria: ' + acceptanceCriteria + '\n\nReturn JSON: {"test_steps": "<html><ol><li><strong>Step 1:</strong> Navigate to...</li></ol></html>"}';
    },

    getATFStepSystem: function() {
        return 'You are a ServiceNow ATF (Automated Test Framework) expert. Convert test steps into ATF step definitions. Valid step_type+action combos: form+open, form+submit, form+set_field, server+run_script, server+assert_record. Return ONLY valid JSON. No markdown code fences, no preamble.';
    },

    getATFStepUser: function(testSteps) {
        return 'Convert these test steps into ServiceNow ATF step definitions.\n\nTest Steps: ' + testSteps + '\n\nReturn JSON: {"steps": [{"step_type": "form", "action": "open", "table": "rm_story", "description": "Open story form"}, {"step_type": "server", "action": "run_script", "script": "// verification", "description": "Verify result"}]}';
    },

    type: 'PromptTemplates',
};
