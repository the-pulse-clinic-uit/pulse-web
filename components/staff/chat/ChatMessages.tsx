"use client";
import ChatMessage from "./ChatMessage";

const messages = [
    {
        id: 1,
        text: "Lorem ipsum has been the industry's standard dummy text ever since the 1500s,",
        timestamp: "8:00 PM",
        isFromPatient: true,
        avatar: "/images/patient-avatar.png",
    },
    {
        id: 2,
        text: "Lorem ipsum has been the industry's standard dummy text ever since the 1500s,",
        timestamp: "8:00 PM",
        isFromPatient: false,
        avatar: "/images/staff-avatar.png",
    },
    {
        id: 3,
        text: "Lorem ipsum has been the industry's standard dummy text ever since the 1500s,",
        timestamp: "8:00 PM",
        isFromPatient: true,
        avatar: "/images/patient-avatar.png",
    },
    {
        id: 4,
        text: "Lorem ipsum has been the industry's standard dummy text ever since the 1500s,",
        timestamp: "8:00 PM",
        isFromPatient: false,
        avatar: "/images/staff-avatar.png",
    },
];

export default function ChatMessages() {
    return (
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {messages.map((message) => (
                <ChatMessage key={message.id} {...message} />
            ))}
        </div>
    );
}
