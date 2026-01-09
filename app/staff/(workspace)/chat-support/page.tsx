"use client";

import StaffChatInterface from "@/components/staff/chat/StaffChatInterface";

export default function StaffChatSupportPage() {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Patient Chat Support</h1>
                <p className="text-gray-600 mt-2">
                    Communicate with patients in real-time
                </p>
            </div>
            <StaffChatInterface />
        </div>
    );
}
