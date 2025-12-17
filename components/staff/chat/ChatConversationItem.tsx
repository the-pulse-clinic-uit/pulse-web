import Image from "next/image";

interface ChatConversationItemProps {
    patientName: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    isActive: boolean;
    avatar: string;
}

export default function ChatConversationItem({
    patientName,
    lastMessage,
    timestamp,
    unreadCount,
    isActive,
    avatar,
}: ChatConversationItemProps) {
    return (
        <div
            className={`flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-base-300 transition-colors ${
                isActive ? "bg-base-100 border-l-4 border-primary" : ""
            }`}
        >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <div className="avatar">
                    <div className="w-12 rounded-full">
                        <Image src={avatar} alt={patientName} width={48} height={48} />
                    </div>
                </div>
                {isActive && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-info border-2 border-base-100 rounded-full"></div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{patientName}</h3>
                    <span className="text-xs opacity-60">{timestamp}</span>
                </div>
                <p className="text-sm opacity-60 truncate">{lastMessage}</p>
            </div>

            {/* Unread Badge */}
            {unreadCount > 0 && (
                <div className="flex-shrink-0">
                    <div className="badge badge-primary font-bold">
                        {unreadCount}
                    </div>
                </div>
            )}
        </div>
    );
}
