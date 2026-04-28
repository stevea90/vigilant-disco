import '@servicenow/sdk/global'
import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['prop_llm_provider'],
    name: 'x_1676392_sdlc_a_0.llm_provider',
    value: 'anthropic',
    type: 'string',
    description: 'LLM provider to use: anthropic or openai',
})

Property({
    $id: Now.ID['prop_anthropic_api_key'],
    name: 'x_1676392_sdlc_a_0.anthropic_api_key',
    value: '',
    type: 'password2',
    description: 'Anthropic API key for Claude models',
})

Property({
    $id: Now.ID['prop_openai_api_key'],
    name: 'x_1676392_sdlc_a_0.openai_api_key',
    value: '',
    type: 'password2',
    description: 'OpenAI API key (fallback provider)',
})

Property({
    $id: Now.ID['prop_anthropic_model'],
    name: 'x_1676392_sdlc_a_0.anthropic_model',
    value: 'claude-3-5-sonnet-20241022',
    type: 'string',
    description: 'Anthropic model ID to use',
})

Property({
    $id: Now.ID['prop_openai_model'],
    name: 'x_1676392_sdlc_a_0.openai_model',
    value: 'gpt-4o',
    type: 'string',
    description: 'OpenAI model ID to use',
})

Property({
    $id: Now.ID['prop_llm_max_tokens'],
    name: 'x_1676392_sdlc_a_0.llm_max_tokens',
    value: '4000',
    type: 'integer',
    description: 'Maximum tokens to request per LLM call',
})

Property({
    $id: Now.ID['prop_llm_temperature'],
    name: 'x_1676392_sdlc_a_0.llm_temperature',
    value: '0.3',
    type: 'string',
    description: 'LLM temperature (0.0 - 1.0)',
})

Property({
    $id: Now.ID['prop_auto_create_manifest'],
    name: 'x_1676392_sdlc_a_0.auto_create_manifest',
    value: 'true',
    type: 'boolean',
    description: 'Automatically create a Story Manifest when a new rm_story is inserted',
})

Property({
    $id: Now.ID['prop_debug_logging'],
    name: 'x_1676392_sdlc_a_0.debug_logging',
    value: 'false',
    type: 'boolean',
    description: 'Enable debug logging to system log',
})
