import axios from 'axios';

const FORGECODE_API_URL = 'https://api.forgecode.dev/v1/chat/completions';

export const handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { message, conversationHistory = [], model = 'claude-3-sonnet' } = JSON.parse(event.body);

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Validation error',
          message: 'Message is required and cannot be empty'
        }),
      };
    }

    // Get API key from environment
    const apiKey = process.env.FORGE_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Configuration error',
          message: 'API key not configured'
        }),
      };
    }

    // Format messages for API
    const messages = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call Forgecode API
    const response = await axios.post(FORGECODE_API_URL, {
      model: model,
      messages: messages,
      max_tokens: 4096,
      temperature: 0.7,
      stream: false
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          message: response.data.choices[0].message.content,
          messageId: response.data.id,
          model: response.data.model,
          usage: response.data.usage
        }
      }),
    };

  } catch (error) {
    console.error('Chat function error:', error);
    
    let statusCode = 500;
    let errorMessage = 'Internal server error';

    if (error.response) {
      statusCode = error.response.status;
      if (statusCode === 429) {
        errorMessage = 'Rate limit exceeded. Please wait before sending another message.';
      } else if (statusCode === 401) {
        errorMessage = 'Invalid API key configuration.';
      } else {
        errorMessage = error.response.data?.error?.message || 'API request failed';
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
    }

    return {
      statusCode: statusCode,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Chat error',
        message: errorMessage
      }),
    };
  }
};