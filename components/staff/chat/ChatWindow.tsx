"use client";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

export default function ChatWindow() {
    return (
        <div className="flex-1 flex flex-col bg-base-100">
            <ChatHeader />
            <ChatMessages />
            <ChatInput />
        </div>
    );
}
