"use client";

import { useState } from "react";

type PatientOption = {
    id: string;
    userId: string;
    name: string;
    email: string;
};

interface SendEmailFormProps {
    selectedTemplate?: string;
    patients: PatientOption[];
    onCancel: () => void;
    onSend: (data: {
        patient: string;
        template: string;
        subject: string;
        content: string;
    }) => void;
}

export default function SendEmailForm({
    selectedTemplate,
    patients,
    onCancel,
    onSend,
}: SendEmailFormProps) {
    const [formData, setFormData] = useState({
        patient: "",
        template: selectedTemplate || "",
        subject: "",
        content: "",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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
                            Choose Patient
                        </span>
                    </label>
                    <select
                        name="patient"
                        value={formData.patient}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                    >
                        <option value="" disabled>
                            Select a patient
                        </option>
                        {patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                                {patient.name} ({patient.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-gray-600">Title</span>
                    </label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter title"
                        className="input input-bordered w-full"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-gray-600">
                            Message
                        </span>
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Enter message"
                        className="textarea textarea-bordered w-full h-32"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button className="btn btn-ghost" onClick={onCancel}>
                    Cancel
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
