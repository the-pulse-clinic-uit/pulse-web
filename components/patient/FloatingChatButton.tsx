"use client";

import React, { useState } from "react";
import { MessageCircle, X, User, Bot } from "lucide-react";

const FloatingChatButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {isOpen && (
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
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors group">
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
        </>
    );
};

export default FloatingChatButton;
