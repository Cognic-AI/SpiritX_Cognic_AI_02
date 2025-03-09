'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SpiriterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi there! I\'m Spiriter, your fantasy cricket assistant. Ask me anything about player statistics, team building advice, or player comparisons!'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/spiriter');
    }
  }, [status, router]);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Call the Spiriter API
      const response = await fetch('/api/spiriter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });
      
      if (!response.ok) throw new Error('Failed to get response from Spiriter');
      
      const data = await response.json();
      
      // Add assistant's response to chat
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: data.response || 'Sorry, I couldn\'t process that request.' }
      ]);
    } catch (error) {
      console.error('Error fetching from Spiriter API:', error);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error processing your request. Please try again later.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sample suggestions for users
  const suggestions = [
    "Who is the best batsman?",
    "Compare Dimuth Dhananjaya and Avishka Mendis",
    "Which bowler has the best economy?",
    "How do I build a balanced team?",
    "Who should be my captain?",
    "Which university has the best players?"
  ];

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Spiriter - Your Cricket AI Assistant</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main chat area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-md shadow-md h-[600px] flex flex-col">
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask Spiriter about cricket players..."
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-full ${
                    isLoading || !inputMessage.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                  }`}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Sidebar with suggestions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-md shadow-md p-4">
            <h2 className="font-semibold text-lg mb-4">Suggested Questions</h2>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-md shadow-md p-4 mt-4">
            <h2 className="font-semibold text-lg mb-2">About Spiriter</h2>
            <p className="text-sm text-gray-600">
              Spiriter is your AI assistant for all things cricket. Get player stats, team advice, and strategic insights to help you build the best fantasy cricket team!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 