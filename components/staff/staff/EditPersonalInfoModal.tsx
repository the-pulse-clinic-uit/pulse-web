"use client";
import { useState } from "react";

type EditPersonalInfoModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: {
        name: string;
        dateOfBirth: string;
        age: number;
        phoneNumber: string;
        emailAddress: string;
        address: string;
        gender: string;
        ethnicity: string;
    }) => void;
    currentData: {
        name: string;
        dateOfBirth: string;
        age: number;
        phoneNumber: string;
        emailAddress: string;
        address: string;
        gender: string;
        ethnicity: string;
    };
};

export default function EditPersonalInfoModal({
    isOpen,
    onClose,
    onSave,
    currentData,
}: EditPersonalInfoModalProps) {
    const getInitialFormData = () => ({
        name: currentData.name,
        dateOfBirth: currentData.dateOfBirth,
        age: currentData.age.toString(),
        phoneNumber: currentData.phoneNumber,
        emailAddress: currentData.emailAddress,
        address: currentData.address,
        gender: currentData.gender,
        ethnicity: currentData.ethnicity,
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
        if (
            formData.name &&
            formData.dateOfBirth &&
            formData.age &&
            formData.phoneNumber &&
            formData.emailAddress &&
            formData.address &&
            formData.gender &&
            formData.ethnicity
        ) {
            onSave({
                ...formData,
                age: parseInt(formData.age),
            });
            onClose();
        }
    };

    const handleClose = () => {
        setFormData(getInitialFormData());
        onClose();
    };

    const handleOpen = () => {
        setFormData(getInitialFormData());
    };

    // Reset form when modal opens
    if (isOpen && formData.name !== currentData.name) {
        setFormData(getInitialFormData());
    }

    const isFormValid =
        formData.name &&
        formData.dateOfBirth &&
        formData.age &&
        formData.phoneNumber &&
        formData.emailAddress &&
        formData.address &&
        formData.gender &&
        formData.ethnicity;

    return (
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box max-w-3xl">
                <h3 className="font-bold text-2xl mb-6">
                    Edit Personal Information
                </h3>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Name <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter name"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Date of Birth{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                placeholder="DD/MM/YYYY"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Age <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Enter age"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Phone Number{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Email Address{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="email"
                                name="emailAddress"
                                value={formData.emailAddress}
                                onChange={handleChange}
                                placeholder="Enter email"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Address{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter address"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Gender <span className="text-error">*</span>
                                </span>
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Ethnicity{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="ethnicity"
                                value={formData.ethnicity}
                                onChange={handleChange}
                                placeholder="Enter ethnicity"
                                className="input input-bordered w-full"
                            />
                        </div>
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
