"use client";

import { useState } from "react";
import Image from "next/image";
import SendEmailForm from "@/components/staff/notifications/SendEmailForm";
import TemplateList from "@/components/staff/notifications/TemplateList";
import Header from "@/components/staff/Header";

type Template = {
    id: string;
    title: string;
    description: string;
};

const mockTemplates: Template[] = [
    {
        id: "1",
        title: "Appointment Reminder",
        description: "Send an appointment reminder to the patient",
    },
    {
        id: "2",
        title: "Diagnostic Result",
        description: "Send an Diagnosis Result to the patient",
    },
    {
        id: "3",
        title: "Diagnostic Result",
        description: "Send an Diagnosis Result to the patient",
    },
    {
        id: "4",
        title: "Diagnostic Result",
        description: "Send an Diagnosis Result to the patient",
    },
];

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState<"new" | "sent">("new");
    const [selectedMonth, setSelectedMonth] = useState("May'23");
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
        mockTemplates[0]
    );

    const handleCancel = () => {
        console.log("Cancel email");
    };

    const handleSaveDraft = (data: {
        patient: string;
        template: string;
        subject: string;
        content: string;
    }) => {
        console.log("Save draft:", data);
    };

    const handleSend = (data: {
        patient: string;
        template: string;
        subject: string;
        content: string;
    }) => {
        console.log("Send email:", data);
    };

    const handleSelectTemplate = (template: Template) => {
        setSelectedTemplate(template);
    };

    const handleCreateTemplate = () => {
        console.log("Create new template");
    };

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header
                tabName="Send Notifications"
                userName="Nguyen Huu Duy"
            ></Header>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab("new")}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                activeTab === "new"
                                    ? "bg-gray-100 text-gray-900"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            New
                        </button>
                        <button
                            onClick={() => setActiveTab("sent")}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                activeTab === "sent"
                                    ? "bg-gray-100 text-gray-900"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            Sent
                        </button>
                    </div>

                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="select select-bordered"
                    >
                        <option value="May'23">May&apos;23</option>
                        <option value="Jun'23">Jun&apos;23</option>
                        <option value="Jul'23">Jul&apos;23</option>
                        <option value="Aug'23">Aug&apos;23</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <SendEmailForm
                        selectedTemplate={selectedTemplate?.title}
                        onCancel={handleCancel}
                        onSaveDraft={handleSaveDraft}
                        onSend={handleSend}
                    />
                    <TemplateList
                        templates={mockTemplates}
                        selectedTemplateId={selectedTemplate?.id}
                        onSelectTemplate={handleSelectTemplate}
                        onCreateNew={handleCreateTemplate}
                    />
                </div>
            </div>
        </div>
    );
}
