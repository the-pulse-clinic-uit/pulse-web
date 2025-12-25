"use client";

import { useState } from "react";
import { Send, MessageSquare, User, Clock } from "lucide-react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "staff",
      name: "Dr. Emily Carter",
      message: "Hello! How can I help you today?",
      time: "10:30 AM",
      avatar: "EC"
    },
    {
      id: 2,
      sender: "patient",
      name: "You",
      message: "Hi, I have a question about my recent blood test results.",
      time: "10:32 AM",
      avatar: "P"
    },
    {
      id: 3,
      sender: "staff",
      name: "Dr. Emily Carter",
      message: "Of course! I've reviewed your results and everything looks normal. Your cholesterol levels have improved since your last visit.",
      time: "10:35 AM",
      avatar: "EC"
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "patient",
        name: "You",
        message: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: "P"
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-purple-900 mb-2">
            Chat with Medical Staff
          </h1>
          <p className="text-gray-600">
            Ask questions and get support from our medical team
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === 'patient' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  msg.sender === 'patient' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {msg.avatar}
                </div>
                <div className={`max-w-xs lg:max-w-md ${
                  msg.sender === 'patient' ? 'text-right' : ''
                }`}>
                  <div className={`rounded-2xl px-4 py-2 ${
                    msg.sender === 'patient'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{msg.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <button className="bg-white rounded-xl shadow-lg p-4 text-left hover:shadow-xl transition-all">
            <MessageSquare className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">General Questions</h3>
            <p className="text-sm text-gray-600">Ask about appointments, services, or general health questions</p>
          </button>
          
          <button className="bg-white rounded-xl shadow-lg p-4 text-left hover:shadow-xl transition-all">
            <User className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Speak to Doctor</h3>
            <p className="text-sm text-gray-600">Connect directly with your assigned physician</p>
          </button>
          
          <button className="bg-white rounded-xl shadow-lg p-4 text-left hover:shadow-xl transition-all">
            <Clock className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Emergency Support</h3>
            <p className="text-sm text-gray-600">Get immediate assistance for urgent matters</p>
          </button>
        </div>
      </div>
    </div>
  );
}