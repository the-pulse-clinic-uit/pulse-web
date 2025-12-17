"use client";

type ViewDrugModalProps = {
    isOpen: boolean;
    onClose: () => void;
    drug: {
        id: string;
        name: string;
        drugClassification: string;
        unit: string;
        stock: number;
        price: string;
        expirationDate: string;
        status: "Running Low" | "Adequate";
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
                                    Drug Classification
                                </span>
                            </label>
                            <p className="font-medium">
                                {drug.drugClassification}
                            </p>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base-content/60">
                                    Unit
                                </span>
                            </label>
                            <p className="font-medium">{drug.unit}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base-content/60">
                                    Stock
                                </span>
                            </label>
                            <p className="font-medium">{drug.stock}</p>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base-content/60">
                                    Price
                                </span>
                            </label>
                            <p className="font-medium">{drug.price}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base-content/60">
                                    Expiration Date
                                </span>
                            </label>
                            <p className="font-medium">{drug.expirationDate}</p>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base-content/60">
                                    Status
                                </span>
                            </label>
                            <div>
                                <span
                                    className={`badge ${
                                        drug.status === "Running Low"
                                            ? "badge-warning"
                                            : "badge-success"
                                    } font-medium`}
                                >
                                    {drug.status}
                                </span>
                            </div>
                        </div>
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
