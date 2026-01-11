"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, UserCircle, Bell, BellOff, X, Loader2 } from "lucide-react";
import { websocketService, ChatMessage } from "@/services/websocket.service";
import Cookies from "js-cookie";

interface Message {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    timestamp: Date;
    isOwn: boolean;
}

interface PatientRequest {
    id: string;
    name: string;
    timestamp: Date;
}

interface UserData {
    id: string;
    email: string;
    fullName: string;
    roleDto: {
        name: string;
    };
}

const StaffChatInterface: React.FC = () => {
    const [isAvailable, setIsAvailable] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [activePatient, setActivePatient] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [patientRequests, setPatientRequests] = useState<PatientRequest[]>(
        []
    );
    const [isTyping, setIsTyping] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
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
                    if (message.type === "CHAT") {
                        const messageId = `${
                            message.senderId
                        }-${Date.now()}-${Math.random()}`;
                        const newMessage: Message = {
                            id: messageId,
                            content: message.content || "",
                            senderId: message.senderId,
                            senderName: message.senderName,
                            timestamp: new Date(),
                            isOwn: message.senderId === userId,
                        };
                        setMessages((prev) => {
                            const isDuplicate = prev.some(
                                (msg) =>
                                    msg.content === newMessage.content &&
                                    msg.senderId === newMessage.senderId &&
                                    Math.abs(
                                        msg.timestamp.getTime() -
                                            newMessage.timestamp.getTime()
                                    ) < 1000
                            );
                            return isDuplicate ? prev : [...prev, newMessage];
                        });

                        if (
                            message.senderRole === "PATIENT" &&
                            !activePatient
                        ) {
                            setActivePatient({
                                id: message.senderId,
                                name: message.senderName,
                            });
                        }
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
                    if (message.type === "PATIENT_CONNECTED") {
                        const newRequest: PatientRequest = {
                            id: message.senderId,
                            name: message.senderName,
                            timestamp: new Date(),
                        };
                        setPatientRequests((prev) => [...prev, newRequest]);
                    } else if (message.type === "PATIENT_DISCONNECTED") {
                        setPatientRequests((prev) =>
                            prev.filter((r) => r.id !== message.senderId)
                        );
                        if (activePatient?.id === message.senderId) {
                            setActivePatient(null);
                        }
                    }
                });
            } catch (error) {}
        };

        fetchUserAndConnect();

        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const handleToggleAvailability = () => {
        if (!userData) {
            console.error("No user data available");
            return;
        }

        const userId = userData.email;
        const userName = userData.fullName;

        if (isAvailable) {
            websocketService.setStaffUnavailable(userId, userName);
            setIsAvailable(false);
        } else {
            websocketService.setStaffAvailable(userId, userName);
            setIsAvailable(true);
        }
    };

    const handleAcceptRequest = (request: PatientRequest) => {
        setActivePatient({ id: request.id, name: request.name });
        setPatientRequests((prev) => prev.filter((r) => r.id !== request.id));
        setMessages([]);
    };

    const handleSendMessage = () => {
        if (!inputMessage.trim() || !activePatient || !isConnected || !userData)
            return;

        const userId = userData.email;
        const userName = userData.fullName;
        const userRole = userData.roleDto.name.toUpperCase() as
            | "PATIENT"
            | "STAFF"
            | "DOCTOR";

        websocketService.sendMessage(
            activePatient.id,
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

        if (activePatient && isConnected && userData) {
            const userId = userData.email;
            const userName = userData.fullName;
            const userRole = userData.roleDto.name.toUpperCase() as
                | "PATIENT"
                | "STAFF"
                | "DOCTOR";

            websocketService.sendTypingIndicator(
                activePatient.id,
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

    const handleEndChat = () => {
        setActivePatient(null);
        setMessages([]);
    };

    return (
        <div className="flex h-[calc(100vh-80px)] gap-4">
            <div className="w-80 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Chat Status
                    </h2>
                    <button
                        onClick={handleToggleAvailability}
                        disabled={!isConnected}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                            isAvailable
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isAvailable ? (
                            <>
                                <Bell size={20} />
                                Available
                            </>
                        ) : (
                            <>
                                <BellOff size={20} />
                                Unavailable
                            </>
                        )}
                    </button>
                    <div className="flex items-center gap-2 mt-3">
                        <div
                            className={`w-2 h-2 rounded-full ${
                                isConnected ? "bg-green-500" : "bg-red-500"
                            }`}
                        />
                        <span className="text-xs text-gray-600">
                            {isConnected ? "Connected" : "Disconnected"}
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Patient Requests ({patientRequests.length})
                    </h3>
                    {patientRequests.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center mt-8">
                            No pending requests
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {patientRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="p-3 bg-purple-50 rounded-lg border border-purple-200"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <UserCircle
                                            className="text-purple-600"
                                            size={20}
                                        />
                                        <p className="font-medium text-gray-900 text-sm">
                                            {request.name}
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">
                                        {request.timestamp.toLocaleTimeString()}
                                    </p>
                                    <button
                                        onClick={() =>
                                            handleAcceptRequest(request)
                                        }
                                        className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                                    >
                                        Accept
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col">
                {activePatient ? (
                    <>
                        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <UserCircle
                                            className="text-white"
                                            size={20}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">
                                            {activePatient.name}
                                        </h3>
                                        <p className="text-white/80 text-xs">
                                            Patient
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleEndChat}
                                    className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        message.isOwn
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg p-3 ${
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
                                            {message.timestamp.toLocaleTimeString(
                                                [],
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="max-w-[70%] rounded-lg p-3 bg-white border border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                <span
                                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                    style={{
                                                        animationDelay: "0ms",
                                                    }}
                                                ></span>
                                                <span
                                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                    style={{
                                                        animationDelay: "150ms",
                                                    }}
                                                ></span>
                                                <span
                                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                    style={{
                                                        animationDelay: "300ms",
                                                    }}
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

                        <div className="p-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                    disabled={!isConnected}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={
                                        !inputMessage.trim() || !isConnected
                                    }
                                    className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="text-white" size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                                <UserCircle
                                    className="text-purple-600"
                                    size={40}
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No Active Chat
                            </h3>
                            <p className="text-gray-500">
                                {isAvailable
                                    ? "Waiting for patient requests..."
                                    : "Set yourself as available to receive patient requests"}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffChatInterface;
