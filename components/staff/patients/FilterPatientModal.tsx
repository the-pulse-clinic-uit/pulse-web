"use client";

type FilterPatientModalProps = {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        gender: string;
        bloodType: string;
        hasInsurance: string;
        hasViolations: string;
    };
    onFilterChange: (
        key: string,
        value: string
    ) => void;
    onApply: () => void;
    onReset: () => void;
};

export default function FilterPatientModal({
    isOpen,
    onClose,
    filters,
    onFilterChange,
    onApply,
    onReset,
}: FilterPatientModalProps) {
    const handleApply = () => {
        onApply();
        onClose();
    };

    const handleReset = () => {
        onReset();
    };

    return (
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box">
                <h3 className="font-bold text-xl mb-4">Filter Patients</h3>

                <div className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Gender</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={filters.gender}
                            onChange={(e) =>
                                onFilterChange("gender", e.target.value)
                            }
                        >
                            <option value="">All</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Blood Type</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={filters.bloodType}
                            onChange={(e) =>
                                onFilterChange("bloodType", e.target.value)
                            }
                        >
                            <option value="">All</option>
                            <option value="A">A+</option>
                            <option value="A_neg">A-</option>
                            <option value="B">B+</option>
                            <option value="B_neg">B-</option>
                            <option value="AB">AB+</option>
                            <option value="AB_neg">AB-</option>
                            <option value="O">O+</option>
                            <option value="O_neg">O-</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Has Insurance</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={filters.hasInsurance}
                            onChange={(e) =>
                                onFilterChange("hasInsurance", e.target.value)
                            }
                        >
                            <option value="">All</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Has Violations</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={filters.hasViolations}
                            onChange={(e) =>
                                onFilterChange("hasViolations", e.target.value)
                            }
                        >
                            <option value="">All</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>

                <div className="modal-action">
                    <button onClick={handleReset} className="btn btn-ghost">
                        Reset
                    </button>
                    <button onClick={onClose} className="btn">
                        Cancel
                    </button>
                    <button onClick={handleApply} className="btn btn-primary">
                        Apply Filters
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose}>
                <button>close</button>
            </div>
        </div>
    );
}
