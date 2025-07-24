import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../context/ThemeContext';

const MessageBubble = ({ message, onCopy, copied }) => {
  const { isDark } = useTheme();
  const isUser = message.role === 'user';

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
    >
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
        }`}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Message Content */}
        <div className={`${isUser ? 'mr-2' : 'ml-2'} flex-1`}>
          <div
            className={`rounded-lg px-4 py-3 ${
              isUser
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            ) : (
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
                            <button
                              onClick={() => onCopy(String(children).replace(/\n$/, ''))}
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
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
                    },
                    table({ children }) {
                      return (
                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                            {children}
                          </table>
                        </div>
                      );
                    },
                    th({ children }) {
                      return (
                        <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800 font-semibold text-left">
                          {children}
                        </th>
                      );
                    },
                    td({ children }) {
                      return (
                        <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                          {children}
                        </td>
                      );
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Message Actions & Timestamp */}
          <div className={`flex items-center mt-1 space-x-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(message.timestamp)}
            </span>
            
            {!isUser && (
              <motion.button
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                onClick={() => onCopy(message.content)}
                title="Copy message"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;