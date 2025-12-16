"use client";
import { useState } from "react";

type AddAppointmentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (appointment: {
        name: string;
        time: string;
        phoneNumber: string;
        doctor: string;
        department: string;
        room: string;
    }) => void;
};

export default function AddAppointmentModal({
    isOpen,
    onClose,
    onSave,
}: AddAppointmentModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        time: "",
        phoneNumber: "",
        doctor: "",
        department: "",
        room: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = () => {
        if (
            formData.name &&
            formData.time &&
            formData.phoneNumber &&
            formData.doctor &&
            formData.department &&
            formData.room
        ) {
            onSave(formData);
            setFormData({
                name: "",
                time: "",
                phoneNumber: "",
                doctor: "",
                department: "",
                room: "",
            });
        }
    };

    const handleClose = () => {
        setFormData({
            name: "",
            time: "",
            phoneNumber: "",
            doctor: "",
            department: "",
            room: "",
        });
        onClose();
    };

    const isFormValid =
        formData.name &&
        formData.time &&
        formData.phoneNumber &&
        formData.doctor &&
        formData.department &&
        formData.room;

    return (
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-2xl mb-6">Add New Appointment</h3>

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
                                    Appointment Time{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Room <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="room"
                                value={formData.room}
                                onChange={handleChange}
                                placeholder="B108"
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Doctor <span className="text-error">*</span>
                                </span>
                            </label>
                            <select
                                name="doctor"
                                value={formData.doctor}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select doctor</option>
                                <option value="Nguyen Van B">
                                    Nguyen Van B
                                </option>
                                <option value="Le Van C">Le Van C</option>
                                <option value="Tran Van E">Tran Van E</option>
                                <option value="Pham Van F">Pham Van F</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Department{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select department</option>
                                <option value="Infectious Disease">
                                    Infectious Disease
                                </option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Neurology">Neurology</option>
                                <option value="Orthopedics">Orthopedics</option>
                            </select>
                        </div>
                    </div>
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
