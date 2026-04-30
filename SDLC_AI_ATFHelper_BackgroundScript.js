// ============================================================
// SDLC AI Orchestrator — One-time Global Helper Setup
// Run this ONCE from: System Definition > Scripts - Background
// (Ensure "Run in global scope" is checked if that option exists)
// ============================================================
var scriptBody = 'var SDLC_AI_ATFHelper = Class.create();\nSDLC_AI_ATFHelper.prototype = {\n    initialize: function() {},\n\n    createSuite: function(name, description) {\n        try {\n            var gr = new GlideRecord(\'sys_atf_test_suite\');\n            gr.initialize();\n            gr.setValue(\'name\', name);\n            gr.setValue(\'description\', description);\n            var id = gr.insert();\n            return id || null;\n        } catch(e) {\n            gs.logError(\'SDLC_AI_ATFHelper.createSuite: \' + e.message, \'SDLC AI\');\n            return null;\n        }\n    },\n\n    createTest: function(suiteId, name, description) {\n        try {\n            var gr = new GlideRecord(\'sys_atf_test\');\n            gr.initialize();\n            gr.setValue(\'name\', name);\n            gr.setValue(\'description\', description);\n            try { gr.setValue(\'sys_atf_suite\', suiteId); } catch(e) {\n                try { gr.setValue(\'test_suite\', suiteId); } catch(e2) {}\n            }\n            var id = gr.insert();\n            return id || null;\n        } catch(e) {\n            gs.logError(\'SDLC_AI_ATFHelper.createTest: \' + e.message, \'SDLC AI\');\n            return null;\n        }\n    },\n\n    createStep: function(testId, order, stepConfigId, description, inputsJson) {\n        try {\n            var gr = new GlideRecord(\'sys_atf_step\');\n            gr.initialize();\n            gr.setValue(\'test\', testId);\n            gr.setValue(\'order\', order);\n            gr.setValue(\'step_config\', stepConfigId);\n            gr.setValue(\'description\', description || \'\');\n            if (inputsJson) {\n                try { gr.setValue(\'inputs\', inputsJson); } catch(e) {}\n            }\n            return gr.insert() || null;\n        } catch(e) {\n            gs.logError(\'SDLC_AI_ATFHelper.createStep: \' + e.message, \'SDLC AI\');\n            return null;\n        }\n    },\n\n    resolveStepConfig: function(stepType, action) {\n        try {\n            var configMap = {\n                \'form_open\': \'Navigate to URL\',\n                \'form_submit\': \'Submit\',\n                \'form_set_field\': \'Set Field Value\',\n                \'server_run_script\': \'Run Server Side Script\',\n                \'server_assert_record\': \'Assert Record\'\n            };\n            var key = (stepType || \'\') + \'_\' + (action || \'\');\n            var configName = configMap[key];\n            if (!configName) { return null; }\n            var gr = new GlideRecord(\'sys_atf_step_config\');\n            gr.addQuery(\'name\', configName);\n            gr.setLimit(1);\n            gr.query();\n            return gr.next() ? gr.getUniqueValue() : null;\n        } catch(e) {\n            return null;\n        }\n    },\n\n    type: \'SDLC_AI_ATFHelper\'\n};';

var gr = new GlideRecord('sys_script_include');
gr.addQuery('name', 'SDLC_AI_ATFHelper');
gr.setLimit(1);
gr.query();
var isNew = !gr.next();
if (isNew) { gr.initialize(); }

gr.setValue('name', 'SDLC_AI_ATFHelper');
gr.setValue('api_name', 'SDLC_AI_ATFHelper');
gr.setValue('access', 'public');
gr.setValue('active', true);
gr.setValue('client_callable', false);
gr.setValue('description', 'Global ATF helper for SDLC AI Orchestrator — creates ATF records from global scope');
gr.setValue('script', scriptBody);

if (isNew) {
    gr.insert();
    gs.print('SUCCESS: SDLC_AI_ATFHelper Script Include created in global scope.');
} else {
    gr.update();
    gs.print('SUCCESS: SDLC_AI_ATFHelper Script Include updated.');
}
