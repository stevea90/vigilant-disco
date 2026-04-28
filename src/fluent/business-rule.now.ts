import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['br_auto_create_manifest'],
    name: 'AI SDLC: Auto-Create Story Manifest',
    table: 'rm_story',
    when: 'after',
    action: ['insert'],
    active: true,
    order: 100,
    description: 'Automatically creates a Story Manifest shell when a new rm_story is inserted',
    script: `(function executeRule(current, previous) {
    if (gs.getProperty('x_1676392_sdlc_a_0.auto_create_manifest', 'true') !== 'true') {
        return;
    }
    var gr = new GlideRecord('x_1676392_sdlc_a_0_story_manifest');
    gr.initialize();
    gr.setValue('story', current.getUniqueValue());
    gr.setValue('orchestration_status', 'pending');
    gr.setValue('tokens_consumed', 0);
    gr.insert();
})(current, previous);`,
})
