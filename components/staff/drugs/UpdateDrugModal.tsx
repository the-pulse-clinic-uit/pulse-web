"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { DOSAGE_FORMS, DRUG_UNITS } from "@/constants/drug-constants";

type UpdateDrugModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    drug: {
        id: string;
        name: string;
        dosageForm: string;
        unit: string;
        strength: string;
        unitPrice: number;
        createdAt: string;
        quantity: number | null;
        expiryDate: string | null;
        minStockLevel: number | null;
        batchNumber: string | null;
    } | null;
};

export default function UpdateDrugModal({
    isOpen,
    onClose,
    onUpdate,
    drug,
}: UpdateDrugModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        dosageForm: "",
        unit: "",
        strength: "",
        unitPrice: "",
        quantity: "",
        minStockLevel: "",
        expiryDate: "",
        batchNumber: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (drug) {
            setFormData({
                name: drug.name,
                dosageForm: drug.dosageForm,
                unit: drug.unit,
                strength: drug.strength || "",
                unitPrice: drug.unitPrice.toString(),
                quantity: drug.quantity?.toString() || "",
                minStockLevel: drug.minStockLevel?.toString() || "",
                expiryDate: drug.expiryDate
                    ? drug.expiryDate.split("T")[0]
                    : "",
                batchNumber: drug.batchNumber || "",
            });
        }
    }, [drug]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        if (!formData.name || !drug) {
            setError("Drug name is required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = Cookies.get("token");

            const payload: Drug = {
                name: formData.name,
                dosageForm: formData.dosageForm,
                unit: formData.unit,
            };

            if (formData.strength) payload.strength = formData.strength;
            if (formData.unitPrice)
                payload.unitPrice = parseFloat(formData.unitPrice);
            if (formData.quantity)
                payload.quantity = parseInt(formData.quantity);
            if (formData.minStockLevel)
                payload.minStockLevel = parseInt(formData.minStockLevel);
            if (formData.expiryDate) payload.expiryDate = formData.expiryDate;
            if (formData.batchNumber)
                payload.batchNumber = formData.batchNumber;

            const res = await fetch(`/api/drugs/${drug.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Failed to update drug (${res.status})`
                );
            }

            onUpdate();
            handleClose();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update drug"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: "",
            dosageForm: "",
            unit: "",
            strength: "",
            unitPrice: "",
            quantity: "",
            minStockLevel: "",
            expiryDate: "",
            batchNumber: "",
        });
        setError("");
        onClose();
    };

    const isFormValid = formData.name.trim() !== "";

    if (!drug) return null;

    return (
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-2xl mb-6">Update Drug</h3>

                <div className="space-y-4">
                    {error && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Drug Name <span className="text-error">*</span>
                            </span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter drug name"
                            className="input input-bordered w-full"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Strength</span>
                            </label>
                            <input
                                type="text"
                                name="strength"
                                placeholder="e.g., 500mg, 100IU/ml"
                                className="input input-bordered w-full"
                                value={formData.strength}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Batch Number</span>
                            </label>
                            <input
                                type="text"
                                name="batchNumber"
                                placeholder="Enter batch number"
                                className="input input-bordered w-full"
                                value={formData.batchNumber}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Dosage Form</span>
                            </label>
                            <select
                                name="dosageForm"
                                className="select select-bordered w-full"
                                value={formData.dosageForm}
                                onChange={handleChange}
                            >
                                <option value="">Select Dosage Form</option>
                                {DOSAGE_FORMS.map((form) => (
                                    <option key={form.value} value={form.value}>
                                        {form.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Unit</span>
                            </label>
                            <select
                                name="unit"
                                className="select select-bordered w-full"
                                value={formData.unit}
                                onChange={handleChange}
                            >
                                <option value="">Select Unit</option>
                                {DRUG_UNITS.map((unit) => (
                                    <option key={unit.value} value={unit.value}>
                                        {unit.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Unit Price ($)</span>
                        </label>
                        <input
                            type="number"
                            name="unitPrice"
                            placeholder="Enter unit price"
                            step="0.01"
                            min="0"
                            className="input input-bordered w-full"
                            value={formData.unitPrice}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="modal-action">
                    <button
                        className="btn btn-ghost"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleUpdate}
                        disabled={!isFormValid || loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Updating...
                            </>
                        ) : (
                            "Update Drug"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
