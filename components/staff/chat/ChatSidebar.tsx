"use client";
import { Search, Plus } from "lucide-react";
import ChatConversationList from "./ChatConversationList";

export default function ChatSidebar() {
    return (
        <div className="w-80 bg-base-200 border-r border-base-300 flex flex-col">
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Chat</h2>

                {/* Search and Add Button */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="input input-bordered w-full pl-10"
                        />
                    </div>
                    <button className="btn btn-ghost btn-sm text-primary font-medium gap-1">
                        CHAT
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Conversation List */}
            <ChatConversationList />
        </div>
    );
}
