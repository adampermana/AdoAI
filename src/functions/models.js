export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const models = [
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        description: 'Balanced performance and speed - Recommended for most tasks',
        provider: 'Anthropic',
        category: 'general',
        maxTokens: 4096,
        costPer1kTokens: 0.003,
        features: ['Chat', 'Analysis', 'Writing', 'Coding']
      },
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        description: 'Most capable model - Best for complex reasoning and analysis',
        provider: 'Anthropic',
        category: 'premium',
        maxTokens: 4096,
        costPer1kTokens: 0.015,
        features: ['Advanced Reasoning', 'Complex Analysis', 'Research', 'Expert Tasks']
      },
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        description: 'Fastest and most economical - Great for simple tasks',
        provider: 'Anthropic',
        category: 'economy',
        maxTokens: 4096,
        costPer1kTokens: 0.00025,
        features: ['Quick Responses', 'Simple Tasks', 'Fast Processing']
      },
      {
        id: 'gpt-4',
        name: 'GPT-4',
        description: 'OpenAI\'s flagship model - Excellent for creative and analytical tasks',
        provider: 'OpenAI',
        category: 'premium',
        maxTokens: 8192,
        costPer1kTokens: 0.03,
        features: ['Creative Writing', 'Problem Solving', 'Analysis', 'Coding']
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast and efficient - Good balance of speed and capability',
        provider: 'OpenAI',
        category: 'general',
        maxTokens: 4096,
        costPer1kTokens: 0.0015,
        features: ['Chat', 'General Tasks', 'Quick Responses', 'Coding']
      }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: models
      }),
    };

  } catch (error) {
    console.error('Models function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch available models'
      }),
    };
  }
};