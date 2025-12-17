"use client";
import Header from "@/components/staff/Header";
import ChatSidebar from "@/components/staff/chat/ChatSidebar";
import ChatWindow from "@/components/staff/chat/ChatWindow";

export default function PatientsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-base-100">
            <div className="px-6 py-8">
                <Header tabName="Chat with Patient" userName="Nguyen Huu Duy" />
            </div>
            <div className="flex-1 flex overflow-hidden p-3 mx-6 mb-6 border border-base-300 rounded-lg">
                <ChatSidebar />
                <ChatWindow />
            </div>
        </div>
    );
}
