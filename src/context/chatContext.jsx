import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { chatService } from '../services/chatService';

const ChatContext = createContext();

const initialState = {
  messages: [],
  isLoading: false,
  error: null,
  conversationId: null,
  streamingMessage: '',
  isStreaming: false,
  selectedModel: 'claude-3-sonnet',
  availableModels: []
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null
      };
    
    case 'UPDATE_LAST_MESSAGE':
      const updatedMessages = [...state.messages];
      if (updatedMessages.length > 0) {
        updatedMessages[updatedMessages.length - 1] = {
          ...updatedMessages[updatedMessages.length - 1],
          ...action.payload
        };
      }
      return { ...state, messages: updatedMessages };
    
    case 'START_STREAMING':
      return {
        ...state,
        isStreaming: true,
        streamingMessage: '',
        isLoading: false
      };
    
    case 'UPDATE_STREAMING':
      return {
        ...state,
        streamingMessage: state.streamingMessage + action.payload
      };
    
    case 'FINISH_STREAMING':
      const assistantMessage = {
        id: Date.now(),
        role: 'assistant',
        content: state.streamingMessage,
        timestamp: new Date().toISOString(),
        model: state.selectedModel
      };
      return {
        ...state,
        messages: [...state.messages, assistantMessage],
        isStreaming: false,
        streamingMessage: '',
        isLoading: false
      };
    
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [], error: null };
    
    case 'SET_CONVERSATION_ID':
      return { ...state, conversationId: action.payload };
    
    case 'SET_SELECTED_MODEL':
      return { ...state, selectedModel: action.payload };
    
    case 'SET_AVAILABLE_MODELS':
      return { ...state, availableModels: action.payload };
    
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load available models on init
  React.useEffect(() => {
    const loadModels = async () => {
      try {
        const models = await chatService.getAvailableModels();
        dispatch({ type: 'SET_AVAILABLE_MODELS', payload: models });
      } catch (error) {
        console.error('Failed to load models:', error);
      }
    };
    loadModels();
  }, []);

  const sendMessage = useCallback(async (message, useStreaming = true, customModel = null) => {
    if (!message.trim()) return;

    const modelToUse = customModel || state.selectedModel;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
      model: modelToUse
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      if (useStreaming) {
        dispatch({ type: 'START_STREAMING' });
        
        await chatService.streamMessage(
          message,
          state.messages,
          (chunk) => {
            if (chunk.type === 'content') {
              dispatch({ type: 'UPDATE_STREAMING', payload: chunk.text });
            } else if (chunk.type === 'stop') {
              dispatch({ type: 'FINISH_STREAMING' });
            }
          },
          modelToUse
        );
      } else {
        const response = await chatService.sendMessage(message, state.messages, modelToUse);
        
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.message,
          timestamp: new Date().toISOString(),
          messageId: response.messageId,
          model: response.model || modelToUse,
          usage: response.usage
        };

        dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Chat error:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: chatService.formatErrorMessage(error)
      });
    }
  }, [state.messages, state.selectedModel]);

  const changeModel = useCallback((modelId) => {
    dispatch({ type: 'SET_SELECTED_MODEL', payload: modelId });
  }, []);

  const clearChat = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...state.messages].reverse().find(msg => msg.role === 'user');
    if (lastUserMessage) {
      // Remove the last assistant message if it exists
      const messagesWithoutLastAssistant = state.messages.filter((msg, index) => {
        if (index === state.messages.length - 1 && msg.role === 'assistant') {
          return false;
        }
        return true;
      });
      
      dispatch({ type: 'CLEAR_MESSAGES' });
      messagesWithoutLastAssistant.forEach(msg => {
        dispatch({ type: 'ADD_MESSAGE', payload: msg });
      });
      
      sendMessage(lastUserMessage.content, true, lastUserMessage.model);
    }
  }, [state.messages, sendMessage]);

  const value = {
    ...state,
    sendMessage,
    clearChat,
    retryLastMessage,
    changeModel
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};