"use client";
import { useState, useEffect } from "react";

type EditPatientModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (
        id: string,
        patient: {
            name: string;
            age: number;
            gender: "Male" | "Female" | "Other";
            phoneNumber: string;
            email: string;
            address: string;
            healthInsurance: boolean;
            insuranceNumber?: string;
        }
    ) => void;
    patient: {
        id: string;
        name: string;
        age: number;
        gender: "Male" | "Female" | "Other";
        phoneNumber: string;
        email: string;
        address: string;
        healthInsurance: boolean;
        insuranceNumber?: string;
    } | null;
};

export default function EditPatientModal({
    isOpen,
    onClose,
    onSave,
    patient,
}: EditPatientModalProps) {
    const initialFormData = patient
        ? {
              name: patient.name,
              age: patient.age.toString(),
              gender: patient.gender,
              phoneNumber: patient.phoneNumber,
              email: patient.email,
              address: patient.address,
              healthInsurance: patient.healthInsurance,
              insuranceNumber: patient.insuranceNumber || "",
          }
        : {
              name: "",
              age: "",
              gender: "" as "Male" | "Female" | "Other" | "",
              phoneNumber: "",
              email: "",
              address: "",
              healthInsurance: false,
              insuranceNumber: "",
          };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (patient && isOpen) {
            // Update form data when patient or modal open state changes
            const updatedFormData = {
                name: patient.name,
                age: patient.age.toString(),
                gender: patient.gender,
                phoneNumber: patient.phoneNumber,
                email: patient.email,
                address: patient.address,
                healthInsurance: patient.healthInsurance,
                insuranceNumber: patient.insuranceNumber || "",
            };
            setFormData(updatedFormData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patient?.id, isOpen]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSave = () => {
        if (
            patient &&
            formData.name &&
            formData.age &&
            formData.gender &&
            formData.phoneNumber &&
            formData.email &&
            formData.address
        ) {
            onSave(patient.id, {
                ...formData,
                age: parseInt(formData.age),
                gender: formData.gender as "Male" | "Female" | "Other",
            });
        }
    };

    const isFormValid =
        formData.name &&
        formData.age &&
        formData.gender &&
        formData.phoneNumber &&
        formData.email &&
        formData.address &&
        (!formData.healthInsurance || formData.insuranceNumber);

    if (!patient) return null;

    return (
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-2xl mb-6">Edit Patient</h3>

                <div className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-500">
                                Patient ID
                            </span>
                        </label>
                        <p className="font-medium text-lg">{patient.id}</p>
                    </div>

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
                            placeholder="Thu Duc, Ho Chi Minh city"
                            className="input input-bordered w-full"
                        />
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
                    <button onClick={onClose} className="btn">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isFormValid}
                        className="btn btn-primary"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose}>
                <button>close</button>
            </div>
        </div>
    );
}
