"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Pill, Download, Printer } from "lucide-react";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";

interface Drug {
    id: string;
    name: string;
    dosageForm: string;
    unit: string;
    strength: string;
    createdAt: string;
    unitPrice: number;
}

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
    drugId: string;
    dose: string;
    frequency: string;
    timing: string;
    duration: string;
    quantity: number;
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
    const [step, setStep] = useState(1); // Step 1: Diagnosis, Step 2: Prescriptions, Step 3: Summary
    const [diagnosis, setDiagnosis] = useState(encounter.diagnosis || "");
    const [notes, setNotes] = useState(encounter.notes || "");
    const [medications, setMedications] = useState<Medication[]>([]);
    const [drugs, setDrugs] = useState<Drug[]>([]);
    const [saving, setSaving] = useState(false);
    const [loadingDrugs, setLoadingDrugs] = useState(false);
    const [prescriptionId, setPrescriptionId] = useState<string | null>(null);
    const [totalCost, setTotalCost] = useState<number>(0);

    useEffect(() => {
        const fetchDrugs = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("No token found");
                return;
            }

            setLoadingDrugs(true);
            try {
                console.log("Fetching drugs...");
                const response = await fetch("/api/drugs", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Response status:", response.status);

                if (response.ok) {
                    const data: Drug[] = await response.json();
                    console.log("Drugs fetched:", data.length, data);
                    setDrugs(data);
                } else {
                    console.error(
                        "Failed to fetch drugs:",
                        response.status,
                        response.statusText
                    );
                    toast.error("Failed to load drugs");
                }
            } catch (error) {
                console.error("Error fetching drugs:", error);
                toast.error("Error loading drugs");
            } finally {
                setLoadingDrugs(false);
            }
        };

        if (isOpen) {
            fetchDrugs();
        }
    }, [isOpen]);

    const addMedication = () => {
        const newMedication: Medication = {
            id: Date.now().toString(),
            drugId: "",
            dose: "",
            frequency: "",
            timing: "",
            duration: "",
            quantity: 0,
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

    const handleSaveDiagnosis = async () => {
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

            if (notes.trim()) {
                const notesResponse = await fetch(
                    `/api/encounters/${
                        encounter.id
                    }/notes?notes=${encodeURIComponent(notes)}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!notesResponse.ok) {
                    throw new Error("Failed to save notes");
                }
            }

            toast.success("Diagnosis saved successfully");
            setStep(2); // Move to prescriptions step
        } catch (error) {
            console.error("Error saving diagnosis:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to save diagnosis"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleSavePrescriptions = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Authentication required");
            return;
        }

        setSaving(true);
        try {
            // First create the prescription
            const prescriptionResponse = await fetch(`/api/prescriptions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    encounterId: encounter.id,
                }),
            });

            if (!prescriptionResponse.ok) {
                throw new Error("Failed to create prescription");
            }

            const prescription = await prescriptionResponse.json();
            const newPrescriptionId = prescription.id;
            setPrescriptionId(newPrescriptionId);

            // Then add each medication to the prescription
            if (medications.length > 0) {
                for (const med of medications) {
                    if (!med.drugId) {
                        toast.error("Please select a drug for all medications");
                        setSaving(false);
                        return;
                    }

                    const medResponse = await fetch(
                        `/api/prescriptions/details`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                prescriptionId: newPrescriptionId,
                                drugId: med.drugId,
                                dose: med.dose,
                                frequency: med.frequency,
                                timing: med.timing,
                                duration: med.duration,
                                quantity: med.quantity,
                                instructions: med.instructions,
                            }),
                        }
                    );

                    if (!medResponse.ok) {
                        throw new Error(`Failed to add medication: ${med.drugId}`);
                    }
                }
            }

            // Fetch the total cost from the API
            const totalResponse = await fetch(
                `/api/prescriptions/${newPrescriptionId}/total`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (totalResponse.ok) {
                const total = await totalResponse.json();
                setTotalCost(total);
            }

            toast.success("Prescription saved successfully");
            setStep(3); // Move to summary step
        } catch (error) {
            console.error("Error saving prescriptions:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to save prescriptions"
            );
        } finally {
            setSaving(false);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let yPosition = 20;

        // Header
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("Medical Encounter Summary", pageWidth / 2, yPosition, { align: "center" });

        yPosition += 15;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: "center" });

        // Patient Information
        yPosition += 15;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Patient Information", 20, yPosition);

        yPosition += 8;
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${encounter.patientDto.userDto.fullName}`, 20, yPosition);

        yPosition += 6;
        doc.text(`Phone: ${encounter.patientDto.userDto.phone}`, 20, yPosition);

        yPosition += 6;
        doc.text(`Blood Type: ${encounter.patientDto.bloodType || "N/A"}`, 20, yPosition);

        yPosition += 6;
        doc.text(`Gender: ${encounter.patientDto.userDto.gender ? "Male" : "Female"}`, 20, yPosition);

        if (encounter.patientDto.allergies) {
            yPosition += 6;
            doc.setTextColor(200, 0, 0);
            doc.setFont("helvetica", "bold");
            doc.text(`Allergies: ${encounter.patientDto.allergies}`, 20, yPosition);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
        }

        // Diagnosis
        yPosition += 15;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Diagnosis", 20, yPosition);

        yPosition += 8;
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const diagnosisLines = doc.splitTextToSize(diagnosis, pageWidth - 40);
        doc.text(diagnosisLines, 20, yPosition);
        yPosition += diagnosisLines.length * 6;

        // Notes
        if (notes) {
            yPosition += 10;
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Clinical Notes", 20, yPosition);

            yPosition += 8;
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            const notesLines = doc.splitTextToSize(notes, pageWidth - 40);
            doc.text(notesLines, 20, yPosition);
            yPosition += notesLines.length * 6;
        }

        // Medications
        if (medications.length > 0) {
            yPosition += 15;
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Prescribed Medications", 20, yPosition);

            yPosition += 10;

            medications.forEach((med, index) => {
                const drug = drugs.find(d => d.id === med.drugId);

                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }

                // Medication number
                doc.setFontSize(12);
                doc.setFont("helvetica", "bold");
                doc.text(`${index + 1}. ${drug?.name || "N/A"}`, 20, yPosition);

                yPosition += 6;
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(80, 80, 80);

                // Drug details (strength, form, unit)
                if (drug) {
                    const drugDetails = `${drug.strength} - ${drug.dosageForm} (${drug.unit})`;
                    doc.text(drugDetails, 25, yPosition);
                    yPosition += 6;
                }

                doc.setTextColor(0, 0, 0);

                // Medication details in a structured format
                doc.setFont("helvetica", "bold");
                doc.text("Dose:", 25, yPosition);
                doc.setFont("helvetica", "normal");
                doc.text(med.dose || "N/A", 50, yPosition);
                yPosition += 5;

                doc.setFont("helvetica", "bold");
                doc.text("Frequency:", 25, yPosition);
                doc.setFont("helvetica", "normal");
                doc.text(med.frequency || "N/A", 50, yPosition);
                yPosition += 5;

                doc.setFont("helvetica", "bold");
                doc.text("Timing:", 25, yPosition);
                doc.setFont("helvetica", "normal");
                doc.text(med.timing || "N/A", 50, yPosition);
                yPosition += 5;

                doc.setFont("helvetica", "bold");
                doc.text("Duration:", 25, yPosition);
                doc.setFont("helvetica", "normal");
                doc.text(med.duration || "N/A", 50, yPosition);
                yPosition += 5;

                doc.setFont("helvetica", "bold");
                doc.text("Quantity:", 25, yPosition);
                doc.setFont("helvetica", "normal");
                doc.text(med.quantity.toString(), 50, yPosition);
                yPosition += 5;

                if (drug) {
                    doc.setFont("helvetica", "bold");
                    doc.text("Unit Price:", 25, yPosition);
                    doc.setFont("helvetica", "normal");
                    doc.text(`$${drug.unitPrice.toFixed(2)}`, 50, yPosition);
                    yPosition += 5;

                    doc.setFont("helvetica", "bold");
                    doc.text("Subtotal:", 25, yPosition);
                    doc.setFont("helvetica", "normal");
                    doc.text(`$${(drug.unitPrice * med.quantity).toFixed(2)}`, 50, yPosition);
                    yPosition += 5;
                }

                if (med.instructions) {
                    doc.setFont("helvetica", "bold");
                    doc.text("Instructions:", 25, yPosition);
                    yPosition += 5;
                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(60, 60, 60);
                    const instructionLines = doc.splitTextToSize(med.instructions, pageWidth - 50);
                    doc.text(instructionLines, 25, yPosition);
                    yPosition += instructionLines.length * 5;
                    doc.setTextColor(0, 0, 0);
                }

                yPosition += 8;

                // Draw separator line between medications
                if (index < medications.length - 1) {
                    doc.setDrawColor(200, 200, 200);
                    doc.line(20, yPosition, pageWidth - 20, yPosition);
                    yPosition += 8;
                }
            });
        }

        // Total Cost
        yPosition += 10;
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Total Cost: $${totalCost.toFixed(2)}`, 20, yPosition);

        // Footer
        yPosition = doc.internal.pageSize.getHeight() - 20;
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 100, 100);
        doc.text(`Doctor: ${encounter.doctorDto.staffDto.userDto.fullName}`, 20, yPosition);
        if (encounter.doctorDto.departmentDto) {
            yPosition += 5;
            doc.text(`Department: ${encounter.doctorDto.departmentDto.name}`, 20, yPosition);
        }

        return doc;
    };

    const handleDownloadPDF = () => {
        const doc = generatePDF();
        doc.save(`encounter-${encounter.id.substring(0, 8)}-${encounter.patientDto.userDto.fullName}.pdf`);
        toast.success("PDF downloaded successfully");
    };

    const handlePrintPDF = () => {
        const doc = generatePDF();
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
        toast.success("Opening print dialog...");
    };

    const handleCompleteEncounter = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Authentication required");
            return;
        }

        if (!prescriptionId) {
            toast.error("No prescription found");
            return;
        }

        setSaving(true);
        try {
            // Create invoice for this encounter
            const invoiceResponse = await fetch("/api/invoices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    patientId: encounter.patientDto.id,
                    encounterId: encounter.id,
                    status: "UNPAID",
                }),
            });

            if (!invoiceResponse.ok) {
                throw new Error("Failed to create invoice");
            }

            // Download PDF
            handleDownloadPDF();

            toast.success("Encounter completed and invoice created successfully");
            onSuccess();
        } catch (error) {
            console.error("Error completing encounter:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to complete encounter"
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
                        <h3 className="font-bold text-2xl">
                            {step === 1 ? "Step 1: Diagnosis" : step === 2 ? "Step 2: Prescriptions" : "Step 3: Summary"}
                        </h3>
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

                {/* Step indicator */}
                <div className="steps steps-horizontal w-full mb-6">
                    <div className={`step ${step >= 1 ? "step-primary" : ""}`}>
                        Diagnosis
                    </div>
                    <div className={`step ${step >= 2 ? "step-primary" : ""}`}>
                        Prescriptions
                    </div>
                    <div className={`step ${step >= 3 ? "step-primary" : ""}`}>
                        Summary
                    </div>
                </div>

                <div className="space-y-6">
                    {step === 1 && (
                        <>
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

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Notes
                                    </span>
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Enter clinical notes..."
                                    className="textarea textarea-bordered w-full h-32"
                                    disabled={saving}
                                />
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="alert alert-info">
                                <div>
                                    <p className="font-semibold">Diagnosis: {diagnosis}</p>
                                    {notes && <p className="text-sm mt-1">Notes: {notes}</p>}
                                </div>
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
                                            <div className="form-control col-span-2">
                                                <label className="label">
                                                    <span className="label-text">
                                                        Drug{" "}
                                                        <span className="text-error">
                                                            *
                                                        </span>
                                                        <span className="text-xs text-gray-500 ml-2">
                                                            ({drugs.length}{" "}
                                                            available)
                                                        </span>
                                                    </span>
                                                </label>
                                                <select
                                                    value={medication.drugId}
                                                    onChange={(e) =>
                                                        updateMedication(
                                                            medication.id,
                                                            "drugId",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="select select-bordered w-full"
                                                    disabled={
                                                        saving || loadingDrugs
                                                    }
                                                >
                                                    <option value="">
                                                        {loadingDrugs
                                                            ? "Loading drugs..."
                                                            : `Select a drug (${drugs.length} available)`}
                                                    </option>
                                                    {drugs.map((drug) => (
                                                        <option
                                                            key={drug.id}
                                                            value={drug.id}
                                                        >
                                                            {drug.name} -{" "}
                                                            {drug.strength} (
                                                            {drug.dosageForm})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">
                                                        Dose
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={medication.dose}
                                                    onChange={(e) =>
                                                        updateMedication(
                                                            medication.id,
                                                            "dose",
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
                                                    placeholder="e.g., Twice daily"
                                                    className="input input-bordered"
                                                    disabled={saving}
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">
                                                        Timing
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={medication.timing}
                                                    onChange={(e) =>
                                                        updateMedication(
                                                            medication.id,
                                                            "timing",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g., After meals"
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

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">
                                                        Quantity
                                                    </span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={medication.quantity}
                                                    onChange={(e) =>
                                                        updateMedication(
                                                            medication.id,
                                                            "quantity",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g., 14"
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
                                                    placeholder="e.g., Take it twice a day, after meals"
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
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className="alert alert-success mb-4">
                                <div>
                                    <p className="font-semibold">Prescription created successfully!</p>
                                    <p className="text-sm">Review the details below before completing the encounter.</p>
                                </div>
                            </div>

                            <div className="card bg-base-100 border">
                                <div className="card-body">
                                    <h3 className="card-title">Encounter Summary</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="font-semibold text-sm text-gray-500">Diagnosis</p>
                                            <p>{diagnosis}</p>
                                        </div>

                                        {notes && (
                                            <div>
                                                <p className="font-semibold text-sm text-gray-500">Notes</p>
                                                <p>{notes}</p>
                                            </div>
                                        )}

                                        <div className="divider">Medications</div>

                                        <div className="overflow-x-auto">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Drug</th>
                                                        <th>Dose</th>
                                                        <th>Quantity</th>
                                                        <th>Unit Price</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {medications.map((med) => {
                                                        const drug = drugs.find(d => d.id === med.drugId);
                                                        const itemTotal = drug ? drug.unitPrice * med.quantity : 0;
                                                        return (
                                                            <tr key={med.id}>
                                                                <td>{drug?.name || 'N/A'}</td>
                                                                <td>{med.dose}</td>
                                                                <td>{med.quantity}</td>
                                                                <td>${drug?.unitPrice.toFixed(2) || '0.00'}</td>
                                                                <td>${itemTotal.toFixed(2)}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="font-bold">
                                                        <td colSpan={4} className="text-right">Total:</td>
                                                        <td>${totalCost.toFixed(2)}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PDF Action Buttons */}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={handleDownloadPDF}
                                    className="btn btn-outline btn-primary gap-2 flex-1"
                                >
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </button>
                                <button
                                    onClick={handlePrintPDF}
                                    className="btn btn-outline btn-secondary gap-2 flex-1"
                                >
                                    <Printer className="w-4 h-4" />
                                    Print PDF
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="modal-action">
                    {step === 1 ? (
                        <>
                            <button onClick={onClose} className="btn" disabled={saving}>
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveDiagnosis}
                                disabled={!diagnosis.trim() || saving}
                                className="btn btn-primary"
                            >
                                {saving ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    "Next: Prescriptions"
                                )}
                            </button>
                        </>
                    ) : step === 2 ? (
                        <>
                            <button
                                onClick={() => setStep(1)}
                                className="btn"
                                disabled={saving}
                            >
                                Back to Diagnosis
                            </button>
                            <button
                                onClick={handleSavePrescriptions}
                                disabled={saving}
                                className="btn btn-primary"
                            >
                                {saving ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    "Next: Summary"
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setStep(2)}
                                className="btn"
                                disabled={saving}
                            >
                                Back to Prescriptions
                            </button>
                            <button
                                onClick={handleCompleteEncounter}
                                disabled={saving}
                                className="btn btn-success"
                            >
                                {saving ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    "Complete Encounter & Download"
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="modal-backdrop" onClick={onClose}>
                <button disabled={saving}>close</button>
            </div>
        </div>
    );
}
