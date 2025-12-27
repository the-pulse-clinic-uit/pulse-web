"use client";

type ViewPatientModalProps = {
    isOpen: boolean;
    onClose: () => void;
    patient: {
        id: string;
        name: string;
        birthDate: string;
        gender: string;
        phoneNumber: string;
        email: string;
        address: string;
        healthInsurance: boolean;
        insuranceNumber?: string;
        citizenId?: string;
        bloodType?: string;
        allergies?: string;
    } | null;
};

export default function ViewPatientModal({
    isOpen,
    onClose,
    patient,
}: ViewPatientModalProps) {
    if (!patient) return null;

    return (
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-2xl mb-6">Patient Details</h3>

                <div className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-500">
                                Patient ID
                            </span>
                        </label>
                        <p className="font-medium text-lg">{patient.id}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-500">
                                    Name
                                </span>
                            </label>
                            <p className="font-medium">{patient.name}</p>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-500">
                                    Birth Date
                                </span>
                            </label>
                            <p className="font-medium">{patient.birthDate}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-500">
                                    Gender
                                </span>
                            </label>
                            <p className="font-medium">{patient.gender}</p>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-500">
                                    Blood Type
                                </span>
                            </label>
                            <p className="font-medium">
                                {patient.bloodType || "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-500">
                                    Phone Number
                                </span>
                            </label>
                            <p className="font-medium">{patient.phoneNumber}</p>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-500">
                                    Citizen ID (CCCD)
                                </span>
                            </label>
                            <p className="font-medium">
                                {patient.citizenId || "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-500">
                                Email
                            </span>
                        </label>
                        <p className="font-medium">{patient.email}</p>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-500">
                                Address
                            </span>
                        </label>
                        <p className="font-medium">{patient.address}</p>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-500">
                                Allergies
                            </span>
                        </label>
                        <p
                            className={`font-medium ${
                                patient.allergies ? "text-red-600" : ""
                            }`}
                        >
                            {patient.allergies || "None"}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-500">
                                    Health Insurance
                                </span>
                            </label>
                            <span
                                className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-medium w-fit ${
                                    patient.healthInsurance
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                                {patient.healthInsurance ? "Is Insured" : "No"}
                            </span>
                        </div>

                        {patient.healthInsurance && patient.insuranceNumber && (
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-gray-500">
                                        Insurance Number
                                    </span>
                                </label>
                                <p className="font-medium">
                                    {patient.insuranceNumber}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="modal-action">
                    <button onClick={onClose} className="btn btn-primary">
                        Close
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose}>
                <button>close</button>
            </div>
        </div>
    );
}
