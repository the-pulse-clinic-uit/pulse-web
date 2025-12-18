"use client";
import { useState } from "react";

type EditProfessionalInfoModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: {
        specialty: string;
        practicingCertificate?: string;
    }) => void;
    currentData: {
        specialty: string;
        practicingCertificate?: string;
    };
};

export default function EditProfessionalInfoModal({
    isOpen,
    onClose,
    onSave,
    currentData,
}: EditProfessionalInfoModalProps) {
    const getInitialFormData = () => ({
        specialty: currentData.specialty,
        practicingCertificate: currentData.practicingCertificate || "",
    });

    const [formData, setFormData] = useState(getInitialFormData());

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        if (formData.specialty) {
            onSave(formData);
            onClose();
        }
    };

    const handleClose = () => {
        setFormData(getInitialFormData());
        onClose();
    };

    // Reset form when modal opens
    if (isOpen && formData.specialty !== currentData.specialty) {
        setFormData(getInitialFormData());
    }

    const isFormValid = formData.specialty;

    return (
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box max-w-md">
                <h3 className="font-bold text-2xl mb-6">
                    Edit Professional Information
                </h3>

                <div className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Specialty <span className="text-error">*</span>
                            </span>
                        </label>
                        <select
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                            className="select select-bordered w-full"
                        >
                            <option value="">Select specialty</option>
                            <option value="Internal Medicine">
                                Internal Medicine
                            </option>
                            <option value="Cardiology">Cardiology</option>
                            <option value="Neurology">Neurology</option>
                            <option value="Orthopedics">Orthopedics</option>
                            <option value="Pediatrics">Pediatrics</option>
                            <option value="General Surgery">
                                General Surgery
                            </option>
                            <option value="Emergency Medicine">
                                Emergency Medicine
                            </option>
                            <option value="Infectious Disease">
                                Infectious Disease
                            </option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Practicing Certificate Number
                            </span>
                        </label>
                        <input
                            type="text"
                            name="practicingCertificate"
                            value={formData.practicingCertificate}
                            onChange={handleChange}
                            placeholder="Enter certificate number"
                            className="input input-bordered w-full"
                        />
                    </div>
                </div>

                <div className="modal-action">
                    <button className="btn btn-ghost" onClick={handleClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={!isFormValid}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={handleClose}></div>
        </div>
    );
}
