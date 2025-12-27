"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

type AddPatientModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

export default function AddPatientModal({
    isOpen,
    onClose,
    onSuccess,
}: AddPatientModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        birthDate: "",
        gender: "" as "Male" | "Female" | "Other" | "",
        phoneNumber: "",
        citizenId: "",
        email: "",
        healthInsuranceId: "",
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

    const handleSave = async () => {
        if (!isFormValid) return;

        setLoading(true);
        try {
            const generatedPassword =
                Math.random().toString(36).slice(-8) + "1A@";

            const registerBody = {
                email: formData.email,
                full_name: formData.name,
                password: generatedPassword,
                citizen_id: formData.citizenId,
                phone: formData.phoneNumber,
                gender: formData.gender === "Male",
                birth_date: formData.birthDate,
                roleDto: {
                    name: "patient",
                },
            };

            const regRes = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerBody),
            });

            if (!regRes.ok) {
                const err = await regRes.json();
                throw new Error(err.message || "Registration failed");
            }

            const regData = await regRes.json();
            const tempToken = regData.token;

            const meRes = await fetch("/api/users/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${tempToken}`,
                },
            });

            if (!meRes.ok) throw new Error("Failed to fetch new user profile");

            const meData = await meRes.json();
            const newUserId = meData.id;

            const patientBody = {
                userId: newUserId,
                healthInsuranceId: formData.healthInsuranceId,
                bloodType: formData.bloodType,
                allergies: formData.allergies,
            };

            console.log("Patient Body:", patientBody);

            const token = Cookies.get("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const patientRes = await fetch("/api/patients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(patientBody),
            });

            if (!patientRes.ok)
                throw new Error("Failed to create patient record");

            toast.success("Patient created successfully!");

            console.log("Generated Password for new user:", generatedPassword);

            onSuccess();
            handleClose();
        } catch (error) {
            console.error("Error creating patient:", error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
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
        formData.healthInsuranceId;

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
                                <option value="A">A</option>
                                <option value="A_neg">A-</option>
                                <option value="B">B</option>
                                <option value="B_neg">B-</option>
                                <option value="O">O</option>
                                <option value="O_neg">O-</option>
                                <option value="AB">AB</option>
                                <option value="AB_neg">AB-</option>
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
                        <label className="label">
                            <span className="label-text">
                                Health Insurance ID{" "}
                                <span className="text-error">*</span>
                            </span>
                        </label>
                        <input
                            type="text"
                            name="healthInsuranceId"
                            value={formData.healthInsuranceId}
                            onChange={handleChange}
                            placeholder="BH123456789"
                            className="input input-bordered w-full"
                        />
                    </div>
                </div>

                <div className="modal-action">
                    <button
                        onClick={handleClose}
                        className="btn"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isFormValid || loading}
                        className="btn btn-primary"
                    >
                        {loading ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            "Save"
                        )}
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={handleClose}>
                <button disabled={loading}>close</button>
            </div>
        </div>
    );
}
