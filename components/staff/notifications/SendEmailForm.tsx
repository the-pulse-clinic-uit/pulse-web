"use client";

import { useState } from "react";

interface SendEmailFormProps {
    selectedTemplate?: string;
    onCancel: () => void;
    onSaveDraft: (data: {
        patient: string;
        template: string;
        subject: string;
        content: string;
    }) => void;
    onSend: (data: {
        patient: string;
        template: string;
        subject: string;
        content: string;
    }) => void;
}

export default function SendEmailForm({
    selectedTemplate,
    onCancel,
    onSaveDraft,
    onSend,
}: SendEmailFormProps) {
    const [formData, setFormData] = useState({
        patient: "",
        template: selectedTemplate || "",
        subject: "",
        content: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveDraft = () => {
        onSaveDraft(formData);
    };

    const handleSend = () => {
        if (
            formData.patient &&
            formData.template &&
            formData.subject &&
            formData.content
        ) {
            onSend(formData);
        }
    };

    const isFormValid =
        formData.patient &&
        formData.template &&
        formData.subject &&
        formData.content;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Send Email
            </h3>

            <div className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-gray-600">
                            Chose Patient
                        </span>
                    </label>
                    <input
                        type="text"
                        name="patient"
                        value={formData.patient}
                        onChange={handleChange}
                        placeholder="Select patient"
                        className="input input-bordered w-full"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-gray-600">
                            Email template
                        </span>
                    </label>
                    <input
                        type="text"
                        name="template"
                        value={formData.template}
                        onChange={handleChange}
                        placeholder="Select template"
                        className="input input-bordered w-full"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-gray-600">
                            Subject
                        </span>
                    </label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter subject"
                        className="input input-bordered w-full"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-gray-600">
                            Content
                        </span>
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Enter email content"
                        className="textarea textarea-bordered w-full h-32"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button className="btn btn-ghost" onClick={onCancel}>
                    Cancel
                </button>
                <button
                    className="btn btn-outline btn-primary"
                    onClick={handleSaveDraft}
                >
                    Save Draft
                </button>
                <button
                    className="btn btn-primary"
                    onClick={handleSend}
                    disabled={!isFormValid}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
