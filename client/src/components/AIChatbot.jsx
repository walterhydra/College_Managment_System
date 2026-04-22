import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, X, Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import axios from 'axios';

const AIChatbot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi there! I'm your College AI Assistant. Ask me about your attendance, schedule, or fees!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/integrations/chatbot', { message: userMessage.text });
      
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.data.reply || "I didn't quite understand that."
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "I'm having trouble connecting to the network right now. Please try again later."
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 transition-all z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden text-sm md:text-base">
          {/* Header */}
          <div className="bg-teal-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6" />
              <h3 className="font-semibold text-lg">AI Assistant</h3>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto h-80 bg-gray-50 dark:bg-navy-800 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 flex items-start space-x-2 ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-gray-200 dark:bg-navy-700 text-gray-800 dark:text-gray-100 rounded-tl-none'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <Bot className="w-4 h-4 mt-1 flex-shrink-0 opacity-70" />
                  )}
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-navy-700 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-none px-4 py-2 flex items-center space-x-2">
                  <Bot className="w-4 h-4 opacity-70" />
                  <Loader2 className="w-4 h-4 animate-spin text-teal-600 dark:text-teal-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-navy-900 border-t border-gray-200 dark:border-navy-700">
            <form onSubmit={handleSendMessage} className="flex relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask something..."
                className="w-full bg-gray-100 dark:bg-navy-800 text-gray-900 dark:text-gray-100 border-none rounded-full pl-4 pr-12 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-1 top-1 bottom-1 bg-teal-600 text-white rounded-full p-2 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
