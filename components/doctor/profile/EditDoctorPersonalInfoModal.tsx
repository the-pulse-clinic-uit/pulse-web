"use client";
import { useState } from "react";

type EditDoctorPersonalInfoModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: {
        name: string;
        dateOfBirth: string;
        phoneNumber: string;
        emailAddress: string;
        address: string;
        gender: string;
        citizenId: string;
    }) => void;
    currentData: {
        name: string;
        dateOfBirth: string;
        phoneNumber: string;
        emailAddress: string;
        address: string;
        gender: string;
        citizenId: string;
    };
};

export default function EditDoctorPersonalInfoModal({
    isOpen,
    onClose,
    onSave,
    currentData,
}: EditDoctorPersonalInfoModalProps) {
    const getInitialFormData = () => ({
        name: currentData.name,
        dateOfBirth: currentData.dateOfBirth,
        phoneNumber: currentData.phoneNumber,
        emailAddress: currentData.emailAddress,
        address: currentData.address,
        gender: currentData.gender,
        citizenId: currentData.citizenId,
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
            formData.phoneNumber &&
            formData.emailAddress &&
            formData.address &&
            formData.gender &&
            formData.citizenId
        ) {
            onSave(formData);
            onClose();
        }
    };

    const handleClose = () => {
        setFormData(getInitialFormData());
        onClose();
    };

    if (isOpen && formData.name !== currentData.name) {
        setFormData(getInitialFormData());
    }

    const isFormValid =
        formData.name &&
        formData.dateOfBirth &&
        formData.phoneNumber &&
        formData.emailAddress &&
        formData.address &&
        formData.gender &&
        formData.citizenId;

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

                        <div className="form-control col-span-2">
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
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Citizen ID{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="citizenId"
                                value={formData.citizenId}
                                onChange={handleChange}
                                placeholder="Enter citizen ID"
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="modal-action mt-6">
                    <button
                        onClick={handleClose}
                        className="btn btn-ghost"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className={`btn btn-primary ${
                            !isFormValid ? "btn-disabled" : ""
                        }`}
                        disabled={!isFormValid}
                        type="button"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={handleClose}></div>
        </div>
    );
}
