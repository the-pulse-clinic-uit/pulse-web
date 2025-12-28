"use client";
import { useState } from "react";
import Cookies from "js-cookie";

type AddDrugModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
};

export default function AddDrugModal({
    isOpen,
    onClose,
    onSave,
}: AddDrugModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        dosageForm: "",
        unit: "",
        strength: "",
        unitPrice: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (
            !formData.name ||
            !formData.dosageForm ||
            !formData.unit ||
            !formData.strength ||
            !formData.unitPrice
        ) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = Cookies.get("token");
            const res = await fetch("/api/drugs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    dosageForm: formData.dosageForm,
                    unit: formData.unit,
                    strength: formData.strength,
                    unitPrice: parseFloat(formData.unitPrice),
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Failed to create drug (${res.status})`
                );
            }

            onSave();
            handleClose();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to create drug"
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
        });
        setError("");
        onClose();
    };

    const isFormValid =
        formData.name &&
        formData.dosageForm &&
        formData.unit &&
        formData.strength &&
        formData.unitPrice;

    return (
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-2xl mb-6">Add New Drug</h3>

                <div className="space-y-4">
                    {error && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Drug Name</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter drug name"
                            className="input input-bordered w-full"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

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
                                <option value="CAPSULE">Capsule</option>
                                <option value="CREAM">Cream</option>
                                <option value="DROPS">Drops</option>
                                <option value="GEL">Gel</option>
                                <option value="INHALER">Inhaler</option>
                                <option value="INJECTION">Injection</option>
                                <option value="LOTION">Lotion</option>
                                <option value="MOUTHWASH">Mouthwash</option>
                                <option value="OINTMENT">Ointment</option>
                                <option value="PATCH">Patch</option>
                                <option value="POWDER">Powder</option>
                                <option value="SOLUTION">Solution</option>
                                <option value="SPRAY">Spray</option>
                                <option value="SUPPOSITORY">Suppository</option>
                                <option value="SUSPENSION">Suspension</option>
                                <option value="SYRUP">Syrup</option>
                                <option value="TABLET">Tablet</option>
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
                                <option value="AMP">Amp</option>
                                <option value="BOTTLE">Bottle</option>
                                <option value="BOX">Box</option>
                                <option value="CAPSULE">Capsule</option>
                                <option value="G">G</option>
                                <option value="ML">ML</option>
                                <option value="PACK">Pack</option>
                                <option value="STRIP">Strip</option>
                                <option value="TABLET">Tablet</option>
                                <option value="TUBE">Tube</option>
                                <option value="VIAL">Vial</option>
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
                        onClick={handleSave}
                        disabled={!isFormValid || loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Saving...
                            </>
                        ) : (
                            "Save Drug"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
