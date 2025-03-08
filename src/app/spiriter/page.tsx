"use client";

import { useState } from "react";

export default function SpiriterPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { 
      role: "assistant", 
      content: "Hello! I'm Spiriter, your fantasy cricket assistant. I can help you with team selection and player insights. This feature will be fully implemented soon by another team member, but I can provide some basic information for now." 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    const newMessages = [
      ...messages,
      { role: "user", content: message }
    ];
    
    setMessages(newMessages);
    setMessage("");
    setIsLoading(true);
    
    // Simulate response delay
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { 
          role: "assistant", 
          content: "I'm a placeholder for the Spiriter AI chatbot. This feature will be fully implemented by another team member soon. For now, I can tell you that building a balanced team of batsmen, bowlers, and all-rounders is usually a good strategy!" 
        }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Spiriter AI Assistant</h1>
      <p className="text-gray-600 mb-6">
        Get help with team selection and player insights from Spiriter.
      </p>

      <div className="bg-white rounded-lg shadow-md h-[60vh] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div 
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === "user" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="h-3 w-3 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="h-3 w-3 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask Spiriter for player advice..."
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              disabled={!message.trim() || isLoading}
            >
              Send
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">Coming Soon</h2>
        <p className="text-sm text-yellow-700">
          The full Spiriter AI chatbot is currently being developed by another team member. 
          When complete, it will provide advanced player insights, team optimization suggestions, 
          and help you build the best possible fantasy cricket team.
        </p>
      </div>
    </div>
  );
} 