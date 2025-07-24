import axios from 'axios';

const FORGECODE_API_URL = 'https://api.forgecode.dev/v1/chat/completions';

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
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
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          error: 'Validation error',
          message: 'Message is required and cannot be empty'
        }),
      };
    }

    const apiKey = process.env.FORGE_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          error: 'Configuration error',
          message: 'API key not configured'
        }),
      };
    }

    // Format messages
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

    // For streaming on Netlify, we'll use a simplified approach
    // Since Netlify functions have limitations with streaming
    const response = await axios.post(FORGECODE_API_URL, {
      model: model,
      messages: messages,
      max_tokens: 4096,
      temperature: 0.7,
      stream: false // Use non-streaming for now
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000
    });

    const content = response.data.choices[0].message.content;
    
    // Simulate streaming by sending chunks
    let streamBody = '';
    const words = content.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      const chunk = words[i] + (i < words.length - 1 ? ' ' : '');
      streamBody += `data: ${JSON.stringify({ type: 'content', text: chunk })}\n\n`;
      
      // Add small delay simulation for better UX
      if (i % 5 === 0) {
        streamBody += `data: ${JSON.stringify({ type: 'content', text: '' })}\n\n`;
      }
    }
    
    streamBody += `data: [DONE]\n\n`;

    return {
      statusCode: 200,
      headers,
      body: streamBody,
    };

  } catch (error) {
    console.error('Stream function error:', error);
    
    let errorMessage = 'Internal server error';
    if (error.response?.status === 429) {
      errorMessage = 'Rate limit exceeded. Please wait before sending another message.';
    } else if (error.response?.status === 401) {
      errorMessage = 'Invalid API key configuration.';
    }

    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        error: 'Stream error',
        message: errorMessage
      }),
    };
  }
};