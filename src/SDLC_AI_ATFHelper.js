var SDLC_AI_ATFHelper = Class.create();
SDLC_AI_ATFHelper.prototype = {
    initialize: function() {},

    createSuite: function(name, description) {
        try {
            var gr = new GlideRecord('sys_atf_test_suite');
            gr.initialize();
            gr.setValue('name', name);
            gr.setValue('description', description);
            var id = gr.insert();
            return id || null;
        } catch(e) {
            gs.logError('SDLC_AI_ATFHelper.createSuite: ' + e.message, 'SDLC AI');
            return null;
        }
    },

    createTest: function(suiteId, name, description) {
        try {
            var gr = new GlideRecord('sys_atf_test');
            gr.initialize();
            gr.setValue('name', name);
            gr.setValue('description', description);
            try { gr.setValue('sys_atf_suite', suiteId); } catch(e) {
                try { gr.setValue('test_suite', suiteId); } catch(e2) {}
            }
            var id = gr.insert();
            return id || null;
        } catch(e) {
            gs.logError('SDLC_AI_ATFHelper.createTest: ' + e.message, 'SDLC AI');
            return null;
        }
    },

    createStep: function(testId, order, stepConfigId, description, inputsJson) {
        try {
            var gr = new GlideRecord('sys_atf_step');
            gr.initialize();
            gr.setValue('test', testId);
            gr.setValue('order', order);
            gr.setValue('step_config', stepConfigId);
            gr.setValue('description', description || '');
            if (inputsJson) {
                try { gr.setValue('inputs', inputsJson); } catch(e) {}
            }
            return gr.insert() || null;
        } catch(e) {
            gs.logError('SDLC_AI_ATFHelper.createStep: ' + e.message, 'SDLC AI');
            return null;
        }
    },

    resolveStepConfig: function(stepType, action) {
        try {
            var configMap = {
                'form_open': 'Navigate to URL',
                'form_submit': 'Submit',
                'form_set_field': 'Set Field Value',
                'server_run_script': 'Run Server Side Script',
                'server_assert_record': 'Assert Record'
            };
            var key = (stepType || '') + '_' + (action || '');
            var configName = configMap[key];
            if (!configName) { return null; }
            var gr = new GlideRecord('sys_atf_step_config');
            gr.addQuery('name', configName);
            gr.setLimit(1);
            gr.query();
            return gr.next() ? gr.getUniqueValue() : null;
        } catch(e) {
            return null;
        }
    },

    type: 'SDLC_AI_ATFHelper'
};
