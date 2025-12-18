import Image from "next/image";

interface ChatMessageProps {
    text: string;
    timestamp: string;
    isFromPatient: boolean;
    avatar: string;
}

export default function ChatMessage({
    text,
    timestamp,
    isFromPatient,
    avatar,
}: ChatMessageProps) {
    return (
        <div className={`chat ${isFromPatient ? "chat-start" : "chat-end"}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <Image src={avatar} alt="Avatar" width={40} height={40} />
                </div>
            </div>
            <div
                className={`chat-bubble ${
                    isFromPatient ? "chat-bubble-accent" : "chat-bubble-primary"
                }`}
            >
                {text}
            </div>
            <div className="chat-footer opacity-50">
                <time className="text-xs">{timestamp}</time>
            </div>
        </div>
    );
}
