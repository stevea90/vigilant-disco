export var ManifestHelper = Class.create();
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
});
