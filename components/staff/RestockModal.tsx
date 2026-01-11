"use client";
import { useState } from "react";
import Cookies from "js-cookie";

interface Drug {
    id: string;
    name: string;
    dosageForm: string;
    unit: string;
    strength: string;
    quantity: number | null;
    minStockLevel: number | null;
    expiryDate: string | null;
    batchNumber: string | null;
}

interface RestockModalProps {
    drug: Drug | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RestockModal({
    drug,
    isOpen,
    onClose,
    onSuccess,
}: RestockModalProps) {
    const [restockAmount, setRestockAmount] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!drug || !restockAmount) return;

        const amount = parseInt(restockAmount);
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = Cookies.get("token");
            const response = await fetch(`/api/drugs/restock/${drug.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(amount),
            });

            if (response.ok) {
                setRestockAmount("");
                onSuccess();
                onClose();
            } else {
                alert("Failed to restock drug");
            }
        } catch (error) {
            console.error(error);
            alert("Error restocking drug");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setRestockAmount("");
        onClose();
    };

    if (!isOpen || !drug) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Restock Drug</h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-600">Drug Name</p>
                        <p className="font-semibold">{drug.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Current Stock</p>
                        <p className="font-semibold">
                            {drug.quantity ?? 0} {drug.unit}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">
                            Minimum Stock Level
                        </p>
                        <p className="font-semibold">
                            {drug.minStockLevel ?? "N/A"}
                        </p>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Restock Amount</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Enter amount to add"
                            className="input input-bordered w-full"
                            value={restockAmount}
                            onChange={(e) => setRestockAmount(e.target.value)}
                            min="1"
                            autoFocus
                            disabled={isSubmitting}
                        />
                    </div>
                    {restockAmount && (
                        <div className="bg-base-200 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">New Total</p>
                            <p className="font-bold text-lg text-success">
                                {(drug.quantity ?? 0) +
                                    parseInt(restockAmount || "0")}{" "}
                                {drug.unit}
                            </p>
                        </div>
                    )}
                </div>
                <div className="modal-action">
                    <button
                        className="btn btn-ghost"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={
                            !restockAmount ||
                            parseInt(restockAmount) <= 0 ||
                            isSubmitting
                        }
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Restocking...
                            </>
                        ) : (
                            "Confirm Restock"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
