import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['si_prompt_templates'],
    name: 'PromptTemplates',
    apiName: 'x_1676392_sdlc_a_0.PromptTemplates',
    description: 'Centralised LLM prompt library for all SDLC AI pipeline steps',
    accessibleFrom: 'public',
    active: true,
    clientCallable: false,
    script: `var PromptTemplates = Class.create();
PromptTemplates.prototype = {
    initialize: function() {},

    getStoryUpliftSystem: function() {
        return 'You are an expert Agile coach and Business Analyst specialising in ServiceNow implementations. Rewrite user stories using the INVEST framework (Independent, Negotiable, Valuable, Estimable, Small, Testable). Return ONLY valid JSON. No markdown code fences, no preamble.';
    },

    getStoryUpliftUser: function(story, description, acceptanceCriteria) {
        return 'Rewrite this user story using INVEST principles and Gherkin acceptance criteria.\\n\\nStory: ' + story + '\\nDescription: ' + description + '\\nAcceptance Criteria: ' + acceptanceCriteria + '\\n\\nReturn JSON: {"uplifted_story": "<html>INVEST-compliant story...</html>", "uplifted_acceptance_criteria": "<html><ul><li>Given/When/Then scenarios...</li></ul></html>"}';
    },

    getCodeGenSystem: function() {
        return 'You are a ServiceNow platform expert. Generate production-ready ServiceNow JavaScript artifacts (Business Rules, Script Includes, Client Scripts) based on user stories. Follow ServiceNow best practices and scoped app patterns. Return ONLY valid JSON. No markdown code fences, no preamble.';
    },

    getCodeGenUser: function(upliftedStory, acceptanceCriteria) {
        return 'Generate ServiceNow code artifacts for this story.\\n\\nStory: ' + upliftedStory + '\\nAcceptance Criteria: ' + acceptanceCriteria + '\\n\\nReturn JSON: {"artifacts": [{"type": "Script Include|Business Rule|Client Script", "name": "ArtifactName", "code": "// full code here"}]}';
    },

    getUnitTestSystem: function() {
        return 'You are a ServiceNow test automation expert. Generate Jasmine unit tests for ServiceNow Script Includes using the ATF server-side test framework. Return ONLY valid JSON. No markdown code fences, no preamble.';
    },

    getUnitTestUser: function(generatedCode) {
        return 'Generate Jasmine unit tests for this ServiceNow code.\\n\\nCode:\\n' + generatedCode + '\\n\\nReturn JSON: {"unit_tests": "// Jasmine describe/it test suite here"}';
    },

    getStakeholderTestSystem: function() {
        return 'You are a QA expert. Generate clear, human-readable manual test steps for business stakeholders (non-technical). Steps should be actionable and verifiable. Return ONLY valid JSON. No markdown code fences, no preamble.';
    },

    getStakeholderTestUser: function(acceptanceCriteria) {
        return 'Generate manual test steps for stakeholders based on these acceptance criteria.\\n\\nAcceptance Criteria: ' + acceptanceCriteria + '\\n\\nReturn JSON: {"test_steps": "<html><ol><li><strong>Step 1:</strong> Navigate to...</li></ol></html>"}';
    },

    getATFStepSystem: function() {
        return 'You are a ServiceNow ATF (Automated Test Framework) expert. Convert test steps into ATF step definitions. Valid step_type+action combos: form+open, form+submit, form+set_field, server+run_script, server+assert_record. Return ONLY valid JSON. No markdown code fences, no preamble.';
    },

    getATFStepUser: function(testSteps) {
        return 'Convert these test steps into ServiceNow ATF step definitions.\\n\\nTest Steps: ' + testSteps + '\\n\\nReturn JSON: {"steps": [{"step_type": "form", "action": "open", "table": "rm_story", "description": "Open story form"}, {"step_type": "server", "action": "run_script", "script": "// verification", "description": "Verify result"}]}';
    },

    type: 'PromptTemplates',
};`,
})

ScriptInclude({
    $id: Now.ID['si_llm_api_client'],
    name: 'LLMAPIClient',
    apiName: 'x_1676392_sdlc_a_0.LLMAPIClient',
    description: 'Outbound HTTP client for Anthropic Claude and OpenAI APIs',
    accessibleFrom: 'public',
    active: true,
    clientCallable: false,
    script: `var LLMAPIClient = Class.create();
LLMAPIClient.prototype = {
    initialize: function() {
        this.provider = gs.getProperty('x_1676392_sdlc_a_0.llm_provider', 'anthropic');
        this.maxTokens = parseInt(gs.getProperty('x_1676392_sdlc_a_0.llm_max_tokens', '4000'));
        this.temperature = parseFloat(gs.getProperty('x_1676392_sdlc_a_0.llm_temperature', '0.3'));
    },

    sendMessage: function(systemPrompt, userPrompt) {
        try {
            if (this.provider === 'openai') {
                return this._sendOpenAI(systemPrompt, userPrompt);
            }
            return this._sendAnthropic(systemPrompt, userPrompt);
        } catch (e) {
            return { content: null, model: null, tokens: 0, error: e.message };
        }
    },

    _sendAnthropic: function(systemPrompt, userPrompt) {
        var model = gs.getProperty('x_1676392_sdlc_a_0.anthropic_model', 'claude-sonnet-4-6');
        var rm = new sn_ws.RESTMessageV2();
        rm.setEndpoint('https://api.anthropic.com/v1/messages');
        rm.setHttpMethod('post');
        rm.setRequestHeader('x-api-key', gs.getProperty('x_1676392_sdlc_a_0.anthropic_api_key', ''));
        rm.setRequestHeader('anthropic-version', '2023-06-01');
        rm.setRequestHeader('content-type', 'application/json');
        rm.setRequestBody(JSON.stringify({
            model: model,
            max_tokens: this.maxTokens,
            temperature: this.temperature,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
        }));
        rm.setHttpTimeout(55000);

        var response = rm.execute();
        var status = response.getStatusCode();
        var body = response.getBody();

        if (status !== 200) {
            return { content: null, model: model, tokens: 0, error: 'HTTP ' + status + ': ' + body };
        }

        var parsed = JSON.parse(body);
        var content = this._stripMarkdownFences(parsed.content[0].text);
        return {
            content: content,
            model: parsed.model,
            tokens: ((parsed.usage || {}).input_tokens || 0) + ((parsed.usage || {}).output_tokens || 0),
            error: null,
        };
    },

    _sendOpenAI: function(systemPrompt, userPrompt) {
        var model = gs.getProperty('x_1676392_sdlc_a_0.openai_model', 'gpt-4o');
        var rm = new sn_ws.RESTMessageV2();
        rm.setEndpoint('https://api.openai.com/v1/chat/completions');
        rm.setHttpMethod('post');
        rm.setRequestHeader('Authorization', 'Bearer ' + gs.getProperty('x_1676392_sdlc_a_0.openai_api_key', ''));
        rm.setRequestHeader('content-type', 'application/json');
        rm.setRequestBody(JSON.stringify({
            model: model,
            max_tokens: this.maxTokens,
            temperature: this.temperature,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
        }));
        rm.setHttpTimeout(55000);

        var response = rm.execute();
        var status = response.getStatusCode();
        var body = response.getBody();

        if (status !== 200) {
            return { content: null, model: model, tokens: 0, error: 'HTTP ' + status + ': ' + body };
        }

        var parsed = JSON.parse(body);
        var content = this._stripMarkdownFences(parsed.choices[0].message.content);
        return {
            content: content,
            model: parsed.model,
            tokens: (parsed.usage || {}).total_tokens || 0,
            error: null,
        };
    },

    _stripMarkdownFences: function(text) {
        if (!text) { return text; }
        var bt = String.fromCharCode(96);
        var fence = bt + bt + bt;
        var t = text.trim();
        if (t.substring(0, 7) === fence + 'json') {
            t = t.substring(7);
            if (t.charAt(0) === '\\n') { t = t.substring(1); }
        } else if (t.substring(0, 3) === fence) {
            t = t.substring(3);
            if (t.charAt(0) === '\\n') { t = t.substring(1); }
        }
        if (t.substring(t.length - 3) === fence) {
            t = t.substring(0, t.length - 3).trim();
        }
        return t;
    },

    type: 'LLMAPIClient',
};`,
})

ScriptInclude({
    $id: Now.ID['si_atf_builder'],
    name: 'ATFBuilder',
    apiName: 'x_1676392_sdlc_a_0.ATFBuilder',
    description: 'Creates sys_atf_suite, sys_atf_test and sys_atf_step records programmatically',
    accessibleFrom: 'public',
    active: true,
    clientCallable: false,
    script: `var ATFBuilder = Class.create();
ATFBuilder.prototype = {
    initialize: function() {},

    build: function(stepDefs) {
        if (!GlidePluginManager.isActive('com.snc.test_management2')) {
            return { suiteId: null, testId: null, error: 'ATF plugin (com.snc.test_management2) is not active on this instance' };
        }

        var suiteId = this._createSuite();
        if (!suiteId) {
            return { suiteId: null, testId: null, error: 'Failed to create ATF suite' };
        }

        var testId = this._createTest(suiteId);
        if (!testId) {
            return { suiteId: suiteId, testId: null, error: 'Failed to create ATF test' };
        }

        for (var i = 0; i < stepDefs.length; i++) {
            this._createStep(testId, stepDefs[i], i + 1);
        }

        return { suiteId: suiteId, testId: testId, error: null };
    },

    _createSuite: function() {
        var gr = new GlideRecord('sys_atf_suite');
        gr.initialize();
        gr.setValue('name', 'SDLC AI - Generated Suite ' + new GlideDateTime().getDisplayValue());
        gr.setValue('description', 'Auto-generated by SDLC AI Orchestrator');
        return gr.insert();
    },

    _createTest: function(suiteId) {
        var gr = new GlideRecord('sys_atf_test');
        gr.initialize();
        gr.setValue('name', 'SDLC AI - Generated Test');
        gr.setValue('description', 'Auto-generated by SDLC AI Orchestrator');
        gr.setValue('sys_atf_suite', suiteId);
        return gr.insert();
    },

    _createStep: function(testId, stepDef, order) {
        var configId = this._resolveStepConfig(stepDef.step_type, stepDef.action);
        if (!configId) { return; }

        var gr = new GlideRecord('sys_atf_step');
        gr.initialize();
        gr.setValue('test', testId);
        gr.setValue('order', order * 100);
        gr.setValue('step_config', configId);
        gr.setValue('description', stepDef.description || '');

        var inputs = {};
        if (stepDef.step_type === 'server' && stepDef.script) {
            inputs.script = stepDef.script;
        } else if (stepDef.table) {
            inputs.table = stepDef.table;
        }
        if (Object.keys(inputs).length > 0) {
            gr.setValue('inputs', JSON.stringify(inputs));
        }

        gr.insert();
    },

    _resolveStepConfig: function(stepType, action) {
        var configMap = {
            'form.open':            'Open a Form',
            'form.submit':          'Submit a Form',
            'form.set_field':       'Set Field Values',
            'server.run_script':    'Run Server Side Script',
            'server.assert_record': 'Assert Record Field Values',
        };

        var key = stepType + '.' + action;
        var sysName = configMap[key];
        if (!sysName) { return null; }

        var gr = new GlideRecord('sys_atf_step_config');
        gr.addQuery('sys_name', sysName);
        gr.setLimit(1);
        gr.query();
        return gr.next() ? gr.getUniqueValue() : null;
    },

    type: 'ATFBuilder',
};`,
})

ScriptInclude({
    $id: Now.ID['si_manifest_helper'],
    name: 'ManifestHelper',
    apiName: 'x_1676392_sdlc_a_0.ManifestHelper',
    description: 'AJAX processor for the AI Command Center dashboard',
    accessibleFrom: 'public',
    active: true,
    clientCallable: true,
    script: `var ManifestHelper = Class.create();
ManifestHelper.prototype = Object.extendsObject(AbstractAjaxProcessor, {

    getManifestStatus: function() {
        var storySysId = this.getParameter('sysparm_story_sys_id');
        var gr = new GlideRecord('x_1676392_sdlc_a_0_story_manifest');
        gr.addQuery('story', storySysId);
        gr.setLimit(1);
        gr.query();

        if (!gr.next()) {
            return JSON.stringify({ found: false });
        }

        return JSON.stringify({
            found: true,
            sys_id: gr.getUniqueValue(),
            status: gr.getValue('orchestration_status'),
            model: gr.getValue('llm_model_used'),
            tokens: gr.getValue('tokens_consumed'),
            has_uplift: !!gr.getValue('uplifted_story'),
            has_code: !!gr.getValue('generated_code'),
            has_tests: !!gr.getValue('generated_unit_tests'),
            has_stakeholder_steps: !!gr.getValue('stakeholder_test_steps'),
            has_atf: !!gr.getValue('atf_suite_sys_id'),
        });
    },

    getDashboardStats: function() {
        var statuses = ['pending', 'running', 'completed', 'partial', 'failed'];
        var stats = { total: 0 };
        for (var i = 0; i < statuses.length; i++) {
            stats[statuses[i]] = 0;
        }

        var agg = new GlideAggregate('x_1676392_sdlc_a_0_story_manifest');
        agg.addAggregate('COUNT', 'orchestration_status');
        agg.groupBy('orchestration_status');
        agg.query();

        while (agg.next()) {
            var status = agg.getValue('orchestration_status');
            var count = parseInt(agg.getAggregate('COUNT', 'orchestration_status'));
            if (stats.hasOwnProperty(status)) {
                stats[status] = count;
            }
            stats.total += count;
        }

        return JSON.stringify(stats);
    },

    getRecentManifests: function() {
        var limit = parseInt(this.getParameter('sysparm_limit') || '100');
        var filterStatus = this.getParameter('sysparm_status') || '';

        var gr = new GlideRecord('x_1676392_sdlc_a_0_story_manifest');
        if (filterStatus) { gr.addQuery('orchestration_status', filterStatus); }
        gr.orderByDesc('sys_updated_on');
        gr.setLimit(limit);
        gr.query();

        var results = [];
        while (gr.next()) {
            results.push({
                sys_id: gr.getUniqueValue(),
                story_sys_id: gr.getValue('story'),
                story_display: gr.getDisplayValue('story'),
                status: gr.getValue('orchestration_status'),
                model: gr.getValue('llm_model_used'),
                tokens: gr.getValue('tokens_consumed') || 0,
                last_run_by: gr.getDisplayValue('last_run_by'),
                updated_on: gr.getValue('sys_updated_on'),
                has_uplift: !!gr.getValue('uplifted_story'),
                has_code: !!gr.getValue('generated_code'),
                has_tests: !!gr.getValue('generated_unit_tests'),
                has_stakeholder_steps: !!gr.getValue('stakeholder_test_steps'),
                has_atf: !!gr.getValue('atf_suite_sys_id'),
            });
        }

        return JSON.stringify(results);
    },

    type: 'ManifestHelper',
});`,
})

ScriptInclude({
    $id: Now.ID['si_ai_orchestrator'],
    name: 'AIOrchestrator',
    apiName: 'x_1676392_sdlc_a_0.AIOrchestrator',
    description: 'Main pipeline coordinator: uplift -> code gen -> tests -> ATF',
    accessibleFrom: 'public',
    active: true,
    clientCallable: false,
    script: `var AIOrchestrator = Class.create();
AIOrchestrator.prototype = {
    initialize: function(storyGR) {
        this.storyGR = storyGR;
        this.storyId = storyGR.getUniqueValue();
        this.manifestGR = null;
        this.llmClient = new x_1676392_sdlc_a_0.LLMAPIClient();
        this.prompts = new x_1676392_sdlc_a_0.PromptTemplates();
        this.debug = gs.getProperty('x_1676392_sdlc_a_0.debug_logging', 'false') === 'true';
    },

    upliftStory: function() {
        this._ensureManifest();
        this._setStatus('running');
        this._log('Starting story uplift...');

        try {
            var story = this.storyGR.getDisplayValue('short_description') || '';
            var description = this.storyGR.getValue('description') || '';
            var acceptanceCriteria = this.storyGR.getValue('acceptance_criteria') || '';

            var result = this.llmClient.sendMessage(
                this.prompts.getStoryUpliftSystem(),
                this.prompts.getStoryUpliftUser(story, description, acceptanceCriteria)
            );

            if (result.error) {
                this._setStatus('failed');
                this._log('Uplift failed: ' + result.error);
                return false;
            }

            var parsed = JSON.parse(result.content);
            this.manifestGR.setValue('uplifted_story', parsed.uplifted_story || '');
            this.manifestGR.setValue('uplifted_acceptance_criteria', parsed.uplifted_acceptance_criteria || '');
            this.manifestGR.setValue('llm_model_used', result.model || '');
            this._addTokens(result.tokens);
            this.manifestGR.update();

            this._setStatus('completed');
            this._log('Story uplift completed successfully.');
            return true;
        } catch (e) {
            this._setStatus('failed');
            this._log('Uplift exception: ' + e.message);
            return false;
        }
    },

    generateCode: function() {
        this._ensureManifest();
        var upliftedStory = this.manifestGR.getValue('uplifted_story');
        if (!upliftedStory) {
            gs.addErrorMessage('Cannot generate code: run AI: Uplift Story first.');
            return false;
        }

        this._setStatus('running');
        this._log('Starting code generation...');

        try {
            var acceptanceCriteria = this.manifestGR.getValue('uplifted_acceptance_criteria') || '';
            var result = this.llmClient.sendMessage(
                this.prompts.getCodeGenSystem(),
                this.prompts.getCodeGenUser(upliftedStory, acceptanceCriteria)
            );

            if (result.error) {
                this._setStatus('failed');
                this._log('Code generation failed: ' + result.error);
                return false;
            }

            var parsed = JSON.parse(result.content);
            var codeBlocks = '';
            if (parsed.artifacts && parsed.artifacts.length > 0) {
                for (var i = 0; i < parsed.artifacts.length; i++) {
                    var art = parsed.artifacts[i];
                    codeBlocks += '// === ' + art.type + ': ' + art.name + ' ===\\n';
                    codeBlocks += art.code + '\\n\\n';
                }
            }

            this.manifestGR.setValue('generated_code', codeBlocks);
            this.manifestGR.setValue('llm_model_used', result.model || '');
            this._addTokens(result.tokens);
            this.manifestGR.update();

            this._setStatus('completed');
            this._log('Code generation completed successfully.');
            return true;
        } catch (e) {
            this._setStatus('failed');
            this._log('Code generation exception: ' + e.message);
            return false;
        }
    },

    generateUnitTests: function() {
        this._ensureManifest();
        var generatedCode = this.manifestGR.getValue('generated_code');
        if (!generatedCode) {
            gs.addErrorMessage('Cannot generate unit tests: run AI: Generate Code first.');
            return false;
        }

        this._setStatus('running');
        this._log('Starting unit test generation...');

        try {
            var result = this.llmClient.sendMessage(
                this.prompts.getUnitTestSystem(),
                this.prompts.getUnitTestUser(generatedCode)
            );

            if (result.error) {
                this._setStatus('failed');
                this._log('Unit test generation failed: ' + result.error);
                return false;
            }

            var parsed = JSON.parse(result.content);
            this.manifestGR.setValue('generated_unit_tests', parsed.unit_tests || '');
            this._addTokens(result.tokens);
            this.manifestGR.update();

            this._setStatus('completed');
            this._log('Unit test generation completed.');
            return true;
        } catch (e) {
            this._setStatus('failed');
            this._log('Unit test exception: ' + e.message);
            return false;
        }
    },

    generateStakeholderTestSteps: function() {
        this._ensureManifest();
        var acceptanceCriteria = this.manifestGR.getValue('uplifted_acceptance_criteria') ||
                                  this.storyGR.getValue('acceptance_criteria') || '';

        if (!acceptanceCriteria) {
            gs.addErrorMessage('No acceptance criteria available for stakeholder test steps.');
            return false;
        }

        this._setStatus('running');
        this._log('Generating stakeholder test steps...');

        try {
            var result = this.llmClient.sendMessage(
                this.prompts.getStakeholderTestSystem(),
                this.prompts.getStakeholderTestUser(acceptanceCriteria)
            );

            if (result.error) {
                this._setStatus('failed');
                this._log('Stakeholder test steps failed: ' + result.error);
                return false;
            }

            var parsed = JSON.parse(result.content);
            this.manifestGR.setValue('stakeholder_test_steps', parsed.test_steps || '');
            this._addTokens(result.tokens);
            this.manifestGR.update();

            this._setStatus('completed');
            this._log('Stakeholder test steps generated.');
            return true;
        } catch (e) {
            this._setStatus('failed');
            this._log('Stakeholder test steps exception: ' + e.message);
            return false;
        }
    },

    createATFRecords: function() {
        this._ensureManifest();
        this._setStatus('running');
        this._log('Creating ATF records...');

        try {
            var testSteps = this.manifestGR.getValue('stakeholder_test_steps') || '';
            var result = this.llmClient.sendMessage(
                this.prompts.getATFStepSystem(),
                this.prompts.getATFStepUser(testSteps)
            );

            if (result.error) {
                this._setStatus('failed');
                this._log('ATF step generation failed: ' + result.error);
                return { suiteId: null, testId: null };
            }

            var parsed = JSON.parse(result.content);
            var stepDefs = parsed.steps || [];

            var builder = new x_1676392_sdlc_a_0.ATFBuilder();
            var atfResult = builder.build(stepDefs);

            if (atfResult.error) {
                this._setStatus('failed');
                this._log('ATF build failed: ' + atfResult.error);
                return atfResult;
            }

            this.manifestGR.setValue('atf_suite_sys_id', atfResult.suiteId || '');
            this.manifestGR.setValue('atf_test_sys_id', atfResult.testId || '');
            this._addTokens(result.tokens);
            this.manifestGR.update();

            this._setStatus('completed');
            this._log('ATF records created. Suite: ' + atfResult.suiteId + ', Test: ' + atfResult.testId);
            return atfResult;
        } catch (e) {
            this._setStatus('failed');
            this._log('ATF exception: ' + e.message);
            return { suiteId: null, testId: null };
        }
    },

    _ensureManifest: function() {
        if (!this.manifestGR) {
            this.manifestGR = this._getOrCreateManifest();
        }
    },

    _getOrCreateManifest: function() {
        var gr = new GlideRecord('x_1676392_sdlc_a_0_story_manifest');
        gr.addQuery('story', this.storyId);
        gr.setLimit(1);
        gr.query();
        if (gr.next()) { return gr; }

        var newGR = new GlideRecord('x_1676392_sdlc_a_0_story_manifest');
        newGR.initialize();
        newGR.setValue('story', this.storyId);
        newGR.setValue('orchestration_status', 'pending');
        newGR.setValue('tokens_consumed', 0);
        var newId = newGR.insert();

        var fetch = new GlideRecord('x_1676392_sdlc_a_0_story_manifest');
        fetch.get(newId);
        return fetch;
    },

    _setStatus: function(status) {
        if (!this.manifestGR) { return; }
        this.manifestGR.setValue('orchestration_status', status);
        this.manifestGR.setValue('last_run_by', gs.getUserID());
        this.manifestGR.update();
    },

    _log: function(message) {
        if (!this.manifestGR) { return; }
        var existing = this.manifestGR.getValue('orchestration_log') || '';
        var timestamp = new GlideDateTime().getDisplayValue();
        var entry = '[' + timestamp + '] ' + message;
        this.manifestGR.setValue('orchestration_log', existing ? existing + '\\n' + entry : entry);
        this.manifestGR.update();
        if (this.debug) { gs.log(entry, 'SDLC AI Orchestrator'); }
    },

    _addTokens: function(newTokens) {
        if (!newTokens) { return; }
        var current = parseInt(this.manifestGR.getValue('tokens_consumed') || '0');
        this.manifestGR.setValue('tokens_consumed', current + newTokens);
    },

    type: 'AIOrchestrator',
};`,
})
