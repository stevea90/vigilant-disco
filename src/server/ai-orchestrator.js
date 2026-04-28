export var AIOrchestrator = Class.create();
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
                    codeBlocks += '// === ' + art.type + ': ' + art.name + ' ===\n';
                    codeBlocks += art.code + '\n\n';
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
        this.manifestGR.setValue('orchestration_log', existing ? existing + '\n' + entry : entry);
        this.manifestGR.update();
        if (this.debug) { gs.log(entry, 'SDLC AI Orchestrator'); }
    },

    _addTokens: function(newTokens) {
        if (!newTokens) { return; }
        var current = parseInt(this.manifestGR.getValue('tokens_consumed') || '0');
        this.manifestGR.setValue('tokens_consumed', current + newTokens);
    },

    type: 'AIOrchestrator',
};
