"use client";
import { useState, useEffect } from "react";

type AddPatientModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (patient: {
        name: string;
        birthDate: string;
        gender: "Male" | "Female" | "Other";
        phoneNumber: string;
        email: string;
        address: string;
        citizenId: string;
        healthInsurance: boolean;
        insuranceNumber?: string;
        bloodType: string;
        allergies: string;
    }) => void;
};

export default function AddPatientModal({
    isOpen,
    onClose,
    onSave,
}: AddPatientModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        birthDate: "",
        gender: "" as "Male" | "Female" | "Other" | "",
        phoneNumber: "",
        citizenId: "",
        email: "",
        address: "",
        healthInsurance: false,
        insuranceNumber: "",
        bloodType: "",
        allergies: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSave = () => {
        if (isFormValid) {
            onSave({
                ...formData,
                gender: formData.gender as "Male" | "Female" | "Other",
            });
            handleClose();
        }
    };

    const handleClose = () => {
        onClose();
    };

    const isFormValid =
        formData.name &&
        formData.birthDate &&
        formData.gender &&
        formData.phoneNumber &&
        formData.citizenId &&
        formData.email &&
        formData.address &&
        (!formData.healthInsurance || formData.insuranceNumber);

    return (
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-2xl mb-6">Add New Patient</h3>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Patient Name{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter patient name"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Birth Date{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                                    Phone Number{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="0979010101"
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                                placeholder="00123456789"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Email <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="patient@gmail.com"
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Address <span className="text-error">*</span>
                            </span>
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Street, City"
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Blood Type</span>
                            </label>
                            <select
                                name="bloodType"
                                value={formData.bloodType}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select Type</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Allergies</span>
                            </label>
                            <input
                                type="text"
                                name="allergies"
                                value={formData.allergies}
                                onChange={handleChange}
                                placeholder="Peanuts, Penicillin..."
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                            <input
                                type="checkbox"
                                name="healthInsurance"
                                checked={formData.healthInsurance}
                                onChange={handleChange}
                                className="checkbox"
                            />
                            <span className="label-text">
                                Has Health Insurance
                            </span>
                        </label>
                    </div>

                    {formData.healthInsurance && (
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Insurance Number{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="insuranceNumber"
                                value={formData.insuranceNumber}
                                onChange={handleChange}
                                placeholder="BH123456789"
                                className="input input-bordered w-full"
                            />
                        </div>
                    )}
                </div>

                <div className="modal-action">
                    <button onClick={handleClose} className="btn">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isFormValid}
                        className="btn btn-primary"
                    >
                        Save
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={handleClose}>
                <button>close</button>
            </div>
        </div>
    );
}
