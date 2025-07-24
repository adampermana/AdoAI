import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -10 },
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex justify-start"
    >
      <div className="flex items-start space-x-2">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center">
          <Bot className="w-4 h-4" />
        </div>

        {/* Typing Animation */}
        <div className="ml-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
              AdoAI is typing
            </span>
            <div className="flex space-x-1">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  variants={dotVariants}
                  initial="initial"
                  animate="animate"
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: index * 0.2,
                  }}
                  className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;