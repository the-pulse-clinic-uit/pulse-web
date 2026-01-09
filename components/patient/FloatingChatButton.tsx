"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, User, Bot, Send, Loader2 } from "lucide-react";
import Cookies from "js-cookie";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const FloatingChatButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        if (isChatOpen) {
            setIsChatOpen(false);
        }
    };

    const openAIChat = () => {
        setIsOpen(false);
        setIsChatOpen(true);
    };

    const closeChat = () => {
        setIsChatOpen(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isChatOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isChatOpen]);

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: Message = {
            role: "user",
            content: inputMessage.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputMessage("");
        setIsLoading(true);

        try {
            const requestBody: { message: string; history?: Message[] } = {
                message: userMessage.content,
            };

            if (messages.length > 0) {
                requestBody.history = messages;
            }
            const token = Cookies.get("token");

            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                const assistantMessage: Message = {
                    role: "assistant",
                    content: data.reply,
                };
                setMessages((prev) => [...prev, assistantMessage]);

                if (data.history && Array.isArray(data.history)) {
                    setMessages(data.history);
                }
            } else {
                const errorMessage: Message = {
                    role: "assistant",
                    content:
                        "Sorry, I'm having trouble connecting right now. Please try again later.",
                };
                setMessages((prev) => [...prev, errorMessage]);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            const errorMessage: Message = {
                role: "assistant",
                content:
                    "Sorry, I'm having trouble connecting right now. Please try again later.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {isChatOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col animate-in slide-in-from-bottom-5 duration-200">
                    <div className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                                    <Bot className="text-white" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-lg">
                                        AI Assistant
                                    </h3>
                                    <p className="text-white/80 text-xs">
                                        Always here to help
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeChat}
                                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                                aria-label="Close chat"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                                    <Bot
                                        className="text-purple-600"
                                        size={32}
                                    />
                                </div>
                                <h4 className="text-gray-900 font-semibold mb-2">
                                    Welcome to AI Assistant!
                                </h4>
                                <p className="text-gray-500 text-sm">
                                    Ask me anything about Pulse Clinic, your
                                    appointments, or general health questions.
                                </p>
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    message.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${
                                        message.role === "user"
                                            ? "bg-purple-600 text-white"
                                            : "bg-gray-100 text-gray-900"
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">
                                        {message.content}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] rounded-lg p-3 bg-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Loader2
                                            className="animate-spin text-purple-600"
                                            size={16}
                                        />
                                        <p className="text-sm text-gray-600">
                                            Thinking...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) =>
                                    setInputMessage(e.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                disabled={isLoading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                aria-label="Send message"
                            >
                                <Send className="text-white" size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isOpen && !isChatOpen && (
                <div className="fixed bottom-24 right-6 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
                    <div className="p-4 bg-gradient-to-r from-purple-600 to-purple-700">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white font-semibold text-lg">
                                Chat Options
                            </h3>
                            <button
                                onClick={toggleMenu}
                                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                                aria-label="Close chat menu"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="p-2 space-y-2">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors group">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                                <User className="text-purple-600" size={20} />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-semibold text-gray-900">
                                    Chat with Staff
                                </p>
                                <p className="text-xs text-gray-500">
                                    Get help from our staff
                                </p>
                            </div>
                        </button>
                        <button
                            onClick={openAIChat}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors group"
                        >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                                <Bot className="text-purple-600" size={20} />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-semibold text-gray-900">
                                    Chat with AI
                                </p>
                                <p className="text-xs text-gray-500">
                                    24/7 instant assistance
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {!isChatOpen && (
                <button
                    onClick={toggleMenu}
                    className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${
                        isOpen
                            ? "bg-gray-600 hover:bg-gray-700 rotate-90"
                            : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:scale-110"
                    }`}
                    aria-label="Open chat menu"
                >
                    {isOpen ? (
                        <X className="text-white" size={24} />
                    ) : (
                        <MessageCircle className="text-white" size={24} />
                    )}
                </button>
            )}
        </>
    );
};

export default FloatingChatButton;
