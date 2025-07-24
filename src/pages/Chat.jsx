import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RotateCcw, Trash2, Settings } from 'lucide-react';
import { useChat } from '../context/chatContext';
import MessageBubble from '../components/chat/MessageBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import StreamingMessage from '../components/chat/StreamingMessage';
import ModelSelector from '../components/chat/ModelSelector';

const Chat = () => {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const { 
    messages, 
    isLoading, 
    error, 
    isStreaming,
    streamingMessage,
    selectedModel,
    sendMessage, 
    clearChat, 
    retryLastMessage,
    changeModel
  } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, streamingMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isStreaming) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const suggestedPrompts = [
    "Explain quantum computing in simple terms",
    "Write a creative short story about AI",
    "Help me debug this JavaScript code",
    "What are the latest trends in web development?",
    "Create a meal plan for a busy week",
    "Explain the difference between React and Vue"
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      >
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chat with AdoAI
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by Forgecode API
            </p>
          </div>
          
          {/* Model Selector */}
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={changeModel}
            disabled={isLoading || isStreaming}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={retryLastMessage}
            disabled={messages.length === 0 || isLoading || isStreaming}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Retry last message"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearChat}
            disabled={messages.length === 0}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <AnimatePresence>
          {messages.length === 0 && !isStreaming && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to AdoAI
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Currently using: <span className="font-semibold">{selectedModel}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Start a conversation or try one of these suggestions:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {suggestedPrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setInput(prompt);
                      inputRef.current?.focus();
                    }}
                    className="p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {prompt}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((message, index) => (
            <MessageBubble
              key={message.id || index}
              message={message}
              onCopy={copyToClipboard}
              copied={copied === message.content}
            />
          ))}

          {isStreaming && streamingMessage && (
            <StreamingMessage content={streamingMessage} />
          )}

          {isLoading && !isStreaming && <TypingIndicator />}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300"
          >
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={retryLastMessage}
              className="mt-2 px-3 py-1 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded text-sm hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
            >
              Try Again
            </motion.button>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here... (Shift+Enter for new line)"
              disabled={isLoading || isStreaming}
              className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              rows="1"
              style={{
                minHeight: '48px',
                maxHeight: '120px',
                height: 'auto'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading || isStreaming}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>
            {input.length > 0 && `${input.length} characters`}
          </span>
          <div className="flex items-center space-x-4">
            <span>Press Shift+Enter for new line</span>
            <span>•</span>
            <span>Model: {selectedModel}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;