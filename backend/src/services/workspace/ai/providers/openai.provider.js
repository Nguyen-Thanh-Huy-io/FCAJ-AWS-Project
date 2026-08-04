const axios = require('axios');
const BaseAiProvider = require('./base.provider');
const { compileResponseSchemaInstruction, OPENAI_CONFIG } = require('../../../../config/ai.config');

class OpenAiProvider extends BaseAiProvider {
  async generate(prompt, options = {}) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured in environment variables');
    }

    const messages = [];
    const systemPrompt = options.systemInstruction || `You are a social media copywriter AI assistant. Generate engaging copy.\n${compileResponseSchemaInstruction()}`;

    messages.push({ role: 'system', content: systemPrompt });

    if (options.image) {
      const base64Data = options.image.includes('base64,') ? options.image.split('base64,')[1] : options.image;
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Data}`
            }
          }
        ]
      });
    } else {
      messages.push({ role: 'user', content: prompt });
    }

    try {
      const response = await axios.post(OPENAI_CONFIG.API_URL, {
        model: OPENAI_CONFIG.MODEL,
        messages,
        response_format: { type: 'json_object' },
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('[OpenAiProvider] API call failed:', error.response?.data || error.message);
      throw new Error(`OpenAI API call failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

module.exports = OpenAiProvider;
