    // For Netlify deployment, we'll use Netlify Functions
const API_BASE_URL = import.meta.env.VITE_API_URL || '/.netlify/functions';

class ChatService {
  async sendMessage(message, conversationHistory = [], model = 'claude-3-sonnet') {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: this.formatConversationHistory(conversationHistory),
          model,
          stream: false
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      if (!data.success) {
        throw new Error(data.message || 'Server error');
      }

      return data.data;
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  }

  async streamMessage(message, conversationHistory = [], onChunk, model = 'claude-3-sonnet') {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: this.formatConversationHistory(conversationHistory),
          model,
          stream: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to stream message');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last incomplete line in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            
            if (data === '[DONE]') {
              onChunk({ type: 'stop' });
              return;
            }

            if (data.trim() === '') continue;

            try {
              const parsed = JSON.parse(data);
              onChunk(parsed);
            } catch (e) {
              // Skip invalid JSON
              console.warn('Invalid JSON in stream:', data);
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream service error:', error);
      throw error;
    }
  }

  async getAvailableModels() {
    try {
      const response = await fetch(`${API_BASE_URL}/models`);
      
      if (!response.ok) {
        throw new Error('Failed to get available models');
      }

      const data = await response.json();
      return data.data || this.getDefaultModels();
    } catch (error) {
      console.error('Get models error:', error);
      return this.getDefaultModels();
    }
  }

  getDefaultModels() {
    return [
      { 
        id: 'claude-3-sonnet', 
        name: 'Claude 3 Sonnet', 
        description: 'Balanced performance and speed',
        provider: 'Anthropic' 
      },
      { 
        id: 'claude-3-opus', 
        name: 'Claude 3 Opus', 
        description: 'Most capable model',
        provider: 'Anthropic' 
      },
      { 
        id: 'claude-3-haiku', 
        name: 'Claude 3 Haiku', 
        description: 'Fastest and most economical',
        provider: 'Anthropic' 
      },
      { 
        id: 'gpt-4', 
        name: 'GPT-4', 
        description: 'OpenAI GPT-4',
        provider: 'OpenAI' 
      },
      { 
        id: 'gpt-3.5-turbo', 
        name: 'GPT-3.5 Turbo', 
        description: 'Fast and efficient',
        provider: 'OpenAI' 
      }
    ];
  }

  formatConversationHistory(messages) {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  validateMessage(message) {
    if (!message || typeof message !== 'string') {
      throw new Error('Message must be a non-empty string');
    }

    if (message.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    if (message.length > 50000) {
      throw new Error('Message is too long. Please keep it under 50,000 characters.');
    }

    return true;
  }

  formatErrorMessage(error) {
    if (error.message.includes('Rate limit')) {
      return 'Too many requests. Please wait a moment before sending another message.';
    }

    if (error.message.includes('API key')) {
      return 'Service configuration error. Please contact support.';
    }

    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }

    if (error.message.includes('Network')) {
      return 'Network error. Please check your connection and try again.';
    }

    return error.message || 'An unexpected error occurred. Please try again.';
  }
}

export const chatService = new ChatService();