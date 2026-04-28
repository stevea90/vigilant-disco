export var LLMAPIClient = Class.create();
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
        var model = gs.getProperty('x_1676392_sdlc_a_0.anthropic_model', 'claude-3-5-sonnet-20241022');
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
        return text.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
    },

    type: 'LLMAPIClient',
};
