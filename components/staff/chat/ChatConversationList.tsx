import ChatConversationItem from "./ChatConversationItem";

const conversations = [
    {
        id: 1,
        patientName: "Patient 1",
        lastMessage: "Last message...",
        timestamp: "now",
        unreadCount: 0,
        isActive: true,
        avatar: "/images/patient-avatar.png",
    },
    {
        id: 2,
        patientName: "Patient 2",
        lastMessage: "Last message...",
        timestamp: "21 minutes ago",
        unreadCount: 11,
        isActive: false,
        avatar: "/images/patient-avatar.png",
    },
    {
        id: 3,
        patientName: "Patient 3",
        lastMessage: "Last message...",
        timestamp: "21 minutes ago",
        unreadCount: 17,
        isActive: false,
        avatar: "/images/patient-avatar.png",
    },
    {
        id: 4,
        patientName: "Patient 4",
        lastMessage: "Last message...",
        timestamp: "21 minutes ago",
        unreadCount: 17,
        isActive: false,
        avatar: "/images/patient-avatar.png",
    },
    {
        id: 5,
        patientName: "Patient 5",
        lastMessage: "Last message...",
        timestamp: "21 minutes ago",
        unreadCount: 17,
        isActive: false,
        avatar: "/images/patient-avatar.png",
    },
];

export default function ChatConversationList() {
    return (
        <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
                <ChatConversationItem key={conversation.id} {...conversation} />
            ))}
        </div>
    );
}
