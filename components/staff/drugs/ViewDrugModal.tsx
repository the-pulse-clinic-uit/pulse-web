"use client";

type ViewDrugModalProps = {
    isOpen: boolean;
    onClose: () => void;
    drug: {
        id: string;
        name: string;
        dosageForm: string;
        unit: string;
        strength: string;
        unitPrice: number;
        createdAt: string;
    } | null;
};

export default function ViewDrugModal({
    isOpen,
    onClose,
    drug,
}: ViewDrugModalProps) {
    if (!drug) return null;

    return (
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-2xl mb-6">Drug Details</h3>

                <div className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-base-content/60">
                                Drug ID
                            </span>
                        </label>
                        <p className="font-medium text-lg">{drug.id}</p>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-base-content/60">
                                Drug Name
                            </span>
                        </label>
                        <p className="font-medium text-lg">{drug.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base-content/60">
                                    Strength
                                </span>
                            </label>
                            <p className="font-medium">{drug.strength}</p>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base-content/60">
                                    Dosage Form
                                </span>
                            </label>
                            <p className="font-medium">{drug.dosageForm}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base-content/60">
                                    Unit
                                </span>
                            </label>
                            <p className="font-medium">{drug.unit}</p>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base-content/60">
                                    Unit Price
                                </span>
                            </label>
                            <p className="font-medium">${drug.unitPrice.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-base-content/60">
                                Created At
                            </span>
                        </label>
                        <p className="font-medium">
                            {new Date(drug.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="modal-action">
                    <button className="btn btn-ghost" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
