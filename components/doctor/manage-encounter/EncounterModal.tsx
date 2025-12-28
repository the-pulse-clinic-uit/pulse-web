"use client";

import { useState } from "react";
import { X, Plus, Trash2, Pill } from "lucide-react";
import { toast } from "react-hot-toast";

interface EncounterDto {
    id: string;
    type: string;
    startedAt: string;
    endedAt: string | null;
    diagnosis: string;
    notes: string;
    createdAt: string;
    appointmentDto: {
        id: string;
        startsAt: string;
        endsAt: string;
        status: string;
        type: string;
        description: string;
    };
    patientDto: {
        id: string;
        healthInsuranceId: string;
        bloodType: string;
        allergies: string;
        userDto: {
            id: string;
            email: string;
            fullName: string;
            citizenId: string;
            phone: string;
            gender: boolean;
            birthDate: string;
        };
    };
    doctorDto: {
        id: string;
        licenseId: string;
        staffDto: {
            userDto: {
                id: string;
                fullName: string;
                email: string;
                phone: string;
            };
        };
        departmentDto: {
            id: string;
            name: string;
            description: string;
        } | null;
    };
}

interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    encounter: EncounterDto;
    onSuccess: () => void;
}

export default function EncounterModal({
    isOpen,
    onClose,
    encounter,
    onSuccess,
}: Props) {
    const [diagnosis, setDiagnosis] = useState(encounter.diagnosis || "");
    const [medications, setMedications] = useState<Medication[]>([]);
    const [saving, setSaving] = useState(false);

    const addMedication = () => {
        const newMedication: Medication = {
            id: Date.now().toString(),
            name: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: "",
        };
        setMedications([...medications, newMedication]);
    };

    const removeMedication = (id: string) => {
        setMedications(medications.filter((med) => med.id !== id));
    };

    const updateMedication = (
        id: string,
        field: keyof Medication,
        value: string
    ) => {
        setMedications(
            medications.map((med) =>
                med.id === id ? { ...med, [field]: value } : med
            )
        );
    };

    const handleSave = async () => {
        if (!diagnosis.trim()) {
            toast.error("Diagnosis is required");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Authentication required");
            return;
        }

        setSaving(true);
        try {
            const diagnosisResponse = await fetch(
                `/api/encounters/${
                    encounter.id
                }/diagnosis?diagnosis=${encodeURIComponent(diagnosis)}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!diagnosisResponse.ok) {
                throw new Error("Failed to save diagnosis");
            }

            if (medications.length > 0) {
                const prescriptionResponse = await fetch(`/api/prescriptions`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        encounterId: encounter.id,
                        medications: medications.map((med) => ({
                            name: med.name,
                            dosage: med.dosage,
                            frequency: med.frequency,
                            duration: med.duration,
                            instructions: med.instructions,
                        })),
                    }),
                });

                if (!prescriptionResponse.ok) {
                    throw new Error("Failed to save prescriptions");
                }
            }

            toast.success("Encounter updated successfully");
            onSuccess();
        } catch (error) {
            console.error("Error saving encounter:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to save encounter"
            );
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-bold text-2xl">Manage Encounter</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Patient: {encounter.patientDto.userDto.fullName}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm btn-circle"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">
                                Diagnosis <span className="text-error">*</span>
                            </span>
                        </label>
                        <textarea
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            placeholder="Enter diagnosis..."
                            className="textarea textarea-bordered w-full h-32"
                            disabled={saving}
                        />
                    </div>

                    <div className="divider">Prescription</div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <Pill className="w-5 h-5" />
                                    Medications
                                </span>
                            </label>
                            <button
                                onClick={addMedication}
                                className="btn btn-sm btn-outline btn-primary gap-2"
                                disabled={saving}
                            >
                                <Plus className="w-4 h-4" />
                                Add Medication
                            </button>
                        </div>

                        {medications.length === 0 ? (
                            <div className="text-center py-8 bg-base-200 rounded-lg">
                                <p className="text-gray-500">
                                    No medications added yet
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {medications.map((medication, index) => (
                                    <div
                                        key={medication.id}
                                        className="card bg-base-200 p-4"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <h4 className="font-semibold">
                                                Medication {index + 1}
                                            </h4>
                                            <button
                                                onClick={() =>
                                                    removeMedication(
                                                        medication.id
                                                    )
                                                }
                                                className="btn btn-ghost btn-sm btn-circle text-error"
                                                disabled={saving}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">
                                                        Medication Name
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={medication.name}
                                                    onChange={(e) =>
                                                        updateMedication(
                                                            medication.id,
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g., Amoxicillin"
                                                    className="input input-bordered"
                                                    disabled={saving}
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">
                                                        Dosage
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={medication.dosage}
                                                    onChange={(e) =>
                                                        updateMedication(
                                                            medication.id,
                                                            "dosage",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g., 500mg"
                                                    className="input input-bordered"
                                                    disabled={saving}
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">
                                                        Frequency
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={medication.frequency}
                                                    onChange={(e) =>
                                                        updateMedication(
                                                            medication.id,
                                                            "frequency",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g., 3 times daily"
                                                    className="input input-bordered"
                                                    disabled={saving}
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">
                                                        Duration
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={medication.duration}
                                                    onChange={(e) =>
                                                        updateMedication(
                                                            medication.id,
                                                            "duration",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g., 7 days"
                                                    className="input input-bordered"
                                                    disabled={saving}
                                                />
                                            </div>

                                            <div className="form-control col-span-2">
                                                <label className="label">
                                                    <span className="label-text">
                                                        Instructions
                                                    </span>
                                                </label>
                                                <textarea
                                                    value={
                                                        medication.instructions
                                                    }
                                                    onChange={(e) =>
                                                        updateMedication(
                                                            medication.id,
                                                            "instructions",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g., Take after meals"
                                                    className="textarea textarea-bordered"
                                                    disabled={saving}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="modal-action">
                    <button onClick={onClose} className="btn" disabled={saving}>
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!diagnosis.trim() || saving}
                        className="btn btn-primary"
                    >
                        {saving ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            "End Encounter"
                        )}
                    </button>
                </div>
            </div>

            <div className="modal-backdrop" onClick={onClose}>
                <button disabled={saving}>close</button>
            </div>
        </div>
    );
}
