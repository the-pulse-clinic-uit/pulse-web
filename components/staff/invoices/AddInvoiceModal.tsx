"use client";
import { useState } from "react";

type AddInvoiceModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (invoice: {
        name: string;
        date: string;
        service: string;
        medication: number;
        totalAmount: number;
        paid: number;
        status: "Paid" | "Unpaid";
    }) => void;
};

export default function AddInvoiceModal({
    isOpen,
    onClose,
    onSave,
}: AddInvoiceModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        service: "",
        medication: "",
        totalAmount: "",
        paid: "",
        status: "" as "Paid" | "Unpaid" | "",
    });

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
            formData.date &&
            formData.service &&
            formData.medication &&
            formData.totalAmount &&
            formData.paid &&
            formData.status
        ) {
            onSave({
                ...formData,
                medication: parseInt(formData.medication),
                totalAmount: parseFloat(formData.totalAmount),
                paid: parseFloat(formData.paid),
                status: formData.status as "Paid" | "Unpaid",
            });
            handleClose();
        }
    };

    const handleClose = () => {
        setFormData({
            name: "",
            date: "",
            service: "",
            medication: "",
            totalAmount: "",
            paid: "",
            status: "",
        });
        onClose();
    };

    const isFormValid =
        formData.name &&
        formData.date &&
        formData.service &&
        formData.medication &&
        formData.totalAmount &&
        formData.paid &&
        formData.status;

    return (
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box max-w-3xl">
                <h3 className="font-bold text-2xl mb-6">Add New Invoice</h3>

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
                                    Date <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                placeholder="DD/MM/YYYY"
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Service <span className="text-error">*</span>
                                </span>
                            </label>
                            <select
                                name="service"
                                value={formData.service}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select service</option>
                                <option value="General Check-up">
                                    General Check-up
                                </option>
                                <option value="Blood Test">Blood Test</option>
                                <option value="X-Ray">X-Ray</option>
                                <option value="Consultation">
                                    Consultation
                                </option>
                                <option value="Ultrasound">Ultrasound</option>
                                <option value="CT Scan">CT Scan</option>
                                <option value="MRI">MRI</option>
                                <option value="Surgery">Surgery</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Medication Count{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="number"
                                name="medication"
                                value={formData.medication}
                                onChange={handleChange}
                                placeholder="Enter number of medications"
                                className="input input-bordered w-full"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Total Amount (VND){" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="number"
                                name="totalAmount"
                                value={formData.totalAmount}
                                onChange={handleChange}
                                placeholder="Enter total amount"
                                className="input input-bordered w-full"
                                min="0"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Paid Amount (VND){" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="number"
                                name="paid"
                                value={formData.paid}
                                onChange={handleChange}
                                placeholder="Enter paid amount"
                                className="input input-bordered w-full"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Status <span className="text-error">*</span>
                            </span>
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="select select-bordered w-full"
                        >
                            <option value="">Select status</option>
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                        </select>
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
                        Save Invoice
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={handleClose}></div>
        </div>
    );
}
