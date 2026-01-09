"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, UserCircle } from "lucide-react";
import { websocketService, ChatMessage } from "@/services/websocket.service";
import Cookies from "js-cookie";

interface StaffChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    timestamp: Date;
    isOwn: boolean;
}

interface UserData {
    id: string;
    email: string;
    fullName: string;
    roleDto: {
        name: string;
    };
}

const StaffChatModal: React.FC<StaffChatModalProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [isRequestingStaff, setIsRequestingStaff] = useState(false);
    const [staffInfo, setStaffInfo] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const fetchUserAndConnect = async () => {
            const token = Cookies.get("token");

            if (!token) {
                return;
            }

            try {
                const response = await fetch("/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    return;
                }

                const user: UserData = await response.json();
                setUserData(user);

                const userId = user.email;
                const userName = user.fullName;
                const userRole = user.roleDto.name.toUpperCase() as
                    | "PATIENT"
                    | "STAFF"
                    | "DOCTOR";

                websocketService.connect(userId, userName, userRole);

                websocketService.onStatusChange((connected) => {
                    setIsConnected(connected);
                });

                websocketService.onMessage((message: ChatMessage) => {
                    if ((message.type === "STAFF_AVAILABLE" || message.senderRole === "STAFF") && !staffInfo) {
                        setStaffInfo({
                            id: message.senderId,
                            name: message.senderName || "Staff Member",
                        });
                        setIsRequestingStaff(false);
                    }
                    
                    if (message.type === "CHAT") {
                        const messageId = `${message.senderId}-${Date.now()}-${Math.random()}`;
                        const newMessage: Message = {
                            id: messageId,
                            content: message.content || "",
                            senderId: message.senderId,
                            senderName: message.senderName || "Staff Member",
                            timestamp: new Date(),
                            isOwn: message.senderId === userId,
                        };
                        setMessages((prev) => {
                            const isDuplicate = prev.some(msg => 
                                msg.content === newMessage.content && 
                                msg.senderId === newMessage.senderId &&
                                Math.abs(msg.timestamp.getTime() - newMessage.timestamp.getTime()) < 1000
                            );
                            return isDuplicate ? prev : [...prev, newMessage];
                        });
                    }
                });

                websocketService.onTyping((message: ChatMessage) => {
                    if (message.senderId !== userId) {
                        setIsTyping(true);
                        if (typingTimeoutRef.current) {
                            clearTimeout(typingTimeoutRef.current);
                        }
                        typingTimeoutRef.current = setTimeout(() => {
                            setIsTyping(false);
                        }, 3000);
                    }
                });

                websocketService.onNotification((message: ChatMessage) => {
                    
                    if (message.type === "STAFF_AVAILABLE" && message.senderRole === "STAFF") {
                        setStaffInfo({
                            id: message.senderId,
                            name: message.senderName,
                        });
                        setIsRequestingStaff(false);
                    }
                });
            } catch (error) {
            }
        };

        fetchUserAndConnect();

        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [isOpen]);

    const handleRequestStaff = () => {
        if (!userData) {
            console.error("No user data available");
            return;
        }

        const userId = userData.email;
        const userName = userData.fullName;

        setIsRequestingStaff(true);
        websocketService.requestStaff(userId, userName);

    };

    const handleSendMessage = () => {
        if (!inputMessage.trim() || !staffInfo || !isConnected || !userData)
            return;

        const userId = userData.email;
        const userName = userData.fullName;
        const userRole = userData.roleDto.name.toUpperCase() as
            | "PATIENT"
            | "STAFF"
            | "DOCTOR";

        websocketService.sendMessage(
            staffInfo.id,
            inputMessage.trim(),
            userId,
            userName,
            userRole
        );

        const messageId = `${userId}-${Date.now()}-${Math.random()}`;
        const newMessage: Message = {
            id: messageId,
            content: inputMessage.trim(),
            senderId: userId,
            senderName: userName,
            timestamp: new Date(),
            isOwn: true,
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputMessage("");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);

        if (staffInfo && isConnected && userData) {
            const userId = userData.email;
            const userName = userData.fullName;
            const userRole = userData.roleDto.name.toUpperCase() as
                | "PATIENT"
                | "STAFF"
                | "DOCTOR";

            websocketService.sendTypingIndicator(
                staffInfo.id,
                userId,
                userName,
                userRole
            );
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleClose = () => {
        if (userData) {
            const userId = userData.email;
            websocketService.endSession(userId);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col animate-in slide-in-from-bottom-5 duration-200">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                            <UserCircle className="text-white" size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-lg">
                                {staffInfo ? staffInfo.name : "Chat with Staff"}
                            </h3>
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        isConnected
                                            ? "bg-green-400"
                                            : "bg-gray-400"
                                    }`}
                                />
                                <p className="text-white/80 text-xs">
                                    {isConnected
                                        ? "Connected"
                                        : "Connecting..."}
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                        aria-label="Close chat"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {!staffInfo && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                            <UserCircle className="text-purple-600" size={32} />
                        </div>
                        <h4 className="text-gray-900 font-semibold mb-2">
                            Need Help?
                        </h4>
                        <p className="text-gray-500 text-sm mb-4">
                            Request a staff member to assist you
                        </p>
                        <button
                            onClick={handleRequestStaff}
                            disabled={isRequestingStaff || !isConnected}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {isRequestingStaff ? (
                                <>
                                    <Loader2
                                        className="animate-spin"
                                        size={16}
                                    />
                                    Requesting...
                                </>
                            ) : (
                                "Request Staff"
                            )}
                        </button>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.isOwn ? "justify-end" : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                                message.isOwn
                                    ? "bg-purple-600 text-white"
                                    : "bg-white text-gray-900 border border-gray-200"
                            }`}
                        >
                            {!message.isOwn && (
                                <p className="text-xs font-semibold mb-1 text-purple-600">
                                    {message.senderName}
                                </p>
                            )}
                            <p className="text-sm whitespace-pre-wrap">
                                {message.content}
                            </p>
                            <p
                                className={`text-xs mt-1 ${
                                    message.isOwn
                                        ? "text-white/70"
                                        : "text-gray-500"
                                }`}
                            >
                                {message.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-3 bg-white border border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <span
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0ms" }}
                                    ></span>
                                    <span
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "150ms" }}
                                    ></span>
                                    <span
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "300ms" }}
                                    ></span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    typing...
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {staffInfo && (
                <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
                    <div className="flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputMessage}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            disabled={!isConnected}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || !isConnected}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            aria-label="Send message"
                        >
                            <Send className="text-white" size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffChatModal;
