"use client";
import { useState } from "react";

type AddDrugModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (drug: {
        name: string;
        drugClassification: string;
        unit: string;
        stock: number;
        price: string;
        expirationDate: string;
    }) => void;
};

export default function AddDrugModal({
    isOpen,
    onClose,
    onSave,
}: AddDrugModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        drugClassification: "",
        unit: "",
        stock: "",
        price: "",
        expirationDate: "",
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
            formData.drugClassification &&
            formData.unit &&
            formData.stock &&
            formData.price &&
            formData.expirationDate
        ) {
            onSave({
                ...formData,
                stock: parseInt(formData.stock),
            });
            handleClose();
        }
    };

    const handleClose = () => {
        setFormData({
            name: "",
            drugClassification: "",
            unit: "",
            stock: "",
            price: "",
            expirationDate: "",
        });
        onClose();
    };

    const isFormValid =
        formData.name &&
        formData.drugClassification &&
        formData.unit &&
        formData.stock &&
        formData.price &&
        formData.expirationDate;

    return (
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-2xl mb-6">Add New Drug</h3>

                <div className="space-y-4">
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Drug Classification
                                </span>
                            </label>
                            <select
                                name="drugClassification"
                                className="select select-bordered w-full"
                                value={formData.drugClassification}
                                onChange={handleChange}
                            >
                                <option value="">Select Classification</option>
                                <option value="Pain Relief">Pain Relief</option>
                                <option value="Antibiotic">Antibiotic</option>
                                <option value="Antiviral">Antiviral</option>
                                <option value="Antihistamine">
                                    Antihistamine
                                </option>
                                <option value="Cardiovascular">
                                    Cardiovascular
                                </option>
                                <option value="Diabetes">Diabetes</option>
                                <option value="Other">Other</option>
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
                                <option value="Tablet">Tablet</option>
                                <option value="Capsule">Capsule</option>
                                <option value="Bottle">Bottle</option>
                                <option value="Box">Box</option>
                                <option value="Vial">Vial</option>
                                <option value="Tube">Tube</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Stock</span>
                            </label>
                            <input
                                type="number"
                                name="stock"
                                placeholder="Enter stock quantity"
                                className="input input-bordered w-full"
                                value={formData.stock}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Price</span>
                            </label>
                            <input
                                type="text"
                                name="price"
                                placeholder="Enter price"
                                className="input input-bordered w-full"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Expiration Date</span>
                        </label>
                        <input
                            type="date"
                            name="expirationDate"
                            className="input input-bordered w-full"
                            value={formData.expirationDate}
                            onChange={handleChange}
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
                        Save Drug
                    </button>
                </div>
            </div>
        </div>
    );
}
