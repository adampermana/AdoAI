import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../context/ThemeContext';

const StreamingMessage = ({ content }) => {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start group"
    >
      <div className="flex max-w-[80%] items-start space-x-2">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center">
          <Bot className="w-4 h-4" />
        </div>

        {/* Message Content */}
        <div className="ml-2 flex-1">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';
                    
                    return !inline && language ? (
                      <div className="relative">
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
                          <span className="text-xs font-mono text-gray-600 dark:text-gray-400 uppercase">
                            {language}
                          </span>
                        </div>
                        <SyntaxHighlighter
                          style={isDark ? oneDark : oneLight}
                          language={language}
                          PreTag="div"
                          className="!mt-0 !rounded-t-none"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code
                        className={`${className} bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
                        {children}
                      </blockquote>
                    );
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
            
            {/* Typing cursor */}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              className="inline-block w-2 h-4 bg-blue-500 ml-1"
            />
          </div>

          {/* Status */}
          <div className="flex items-center mt-1">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full mr-2"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Streaming response...
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StreamingMessage;