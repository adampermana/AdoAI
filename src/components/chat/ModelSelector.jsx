import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Brain, Sparkles, Check } from 'lucide-react';
import { chatService } from '../../services/chatService';

const ModelSelector = ({ selectedModel, onModelChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const availableModels = await chatService.getAvailableModels();
      setModels(availableModels);
    } catch (error) {
      console.error('Failed to load models:', error);
      // Use default models if API fails
      setModels(chatService.getDefaultModels());
    } finally {
      setLoading(false);
    }
  };

  const getModelIcon = (modelId, provider) => {
    if (provider === 'Anthropic') {
      if (modelId.includes('opus')) return <Brain className="w-4 h-4" />;
      if (modelId.includes('haiku')) return <Zap className="w-4 h-4" />;
      return <Sparkles className="w-4 h-4" />;
    }
    return <Brain className="w-4 h-4" />;
  };

  const getModelColor = (modelId, provider) => {
    if (provider === 'Anthropic') {
      if (modelId.includes('opus')) return 'text-purple-600 dark:text-purple-400';
      if (modelId.includes('haiku')) return 'text-green-600 dark:text-green-400';
      return 'text-blue-600 dark:text-blue-400';
    }
    return 'text-orange-600 dark:text-orange-400';
  };

  const selectedModelData = models.find(m => m.id === selectedModel) || models[0];

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
          disabled 
            ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
        }`}
      >
        {selectedModelData && (
          <>
            <span className={getModelColor(selectedModelData.id, selectedModelData.provider)}>
              {getModelIcon(selectedModelData.id, selectedModelData.provider)}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedModelData.name}
            </span>
            {!disabled && (
              <ChevronDown 
                className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              />
            )}
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <div className="py-2">
              {models.map((model) => (
                <motion.button
                  key={model.id}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className={getModelColor(model.id, model.provider)}>
                      {getModelIcon(model.id, model.provider)}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {model.name}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                          {model.provider}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {model.description}
                      </p>
                    </div>
                  </div>
                  {selectedModel === model.id && (
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Model Info Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-900">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 Switch models anytime during conversation
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ModelSelector;