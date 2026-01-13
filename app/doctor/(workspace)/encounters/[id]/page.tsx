"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, User, Calendar, Clock, Stethoscope } from "lucide-react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

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

export default function EncounterDetailPage() {
    const router = useRouter();
    const params = useParams();
    const encounterId = params?.id as string;

    const [encounter, setEncounter] = useState<EncounterDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [diagnosis, setDiagnosis] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        const fetchEncounter = async () => {
            const token = Cookies.get("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:8080/api/encounters/${encounterId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setEncounter(data);
                    setDiagnosis(data.diagnosis || "");
                    setNotes(data.notes || "");
                } else if (response.status === 401 || response.status === 403) {
                    Cookies.remove("token");
                    Cookies.remove("user");
                    router.push("/login");
                } else {
                    toast.error("Failed to load encounter details");
                }
            } catch (error) {
                console.error("Error fetching encounter:", error);
                toast.error("Error loading encounter");
            } finally {
                setLoading(false);
            }
        };

        if (encounterId) {
            fetchEncounter();
        }
    }, [encounterId, router]);

    const handleSaveDiagnosis = async () => {
        if (!diagnosis.trim()) {
            toast.error("Diagnosis is required");
            return;
        }

        const token = Cookies.get("token");
        if (!token) return;

        setSaving(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/encounters/${encounterId}/diagnosis`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ diagnosis }),
                }
            );

            if (response.ok) {
                const updatedEncounter = await response.json();
                setEncounter(updatedEncounter);
                toast.success("Diagnosis saved successfully");
            } else {
                toast.error("Failed to save diagnosis");
            }
        } catch (error) {
            console.error("Error saving diagnosis:", error);
            toast.error("Error saving diagnosis");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNotes = async () => {
        const token = Cookies.get("token");
        if (!token) return;

        setSaving(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/encounters/${encounterId}/notes`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ notes }),
                }
            );

            if (response.ok) {
                const updatedEncounter = await response.json();
                setEncounter(updatedEncounter);
                toast.success("Notes saved successfully");
            } else {
                toast.error("Failed to save notes");
            }
        } catch (error) {
            console.error("Error saving notes:", error);
            toast.error("Error saving notes");
        } finally {
            setSaving(false);
        }
    };

    const handleCloseEncounter = async () => {
        if (!diagnosis.trim()) {
            toast.error("Please provide a diagnosis before closing the encounter");
            return;
        }

        const token = Cookies.get("token");
        if (!token) return;

        setSaving(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/encounters/${encounterId}/end`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                toast.success("Encounter closed successfully");
                router.push("/encounters");
            } else {
                toast.error("Failed to close encounter");
            }
        } catch (error) {
            console.error("Error closing encounter:", error);
            toast.error("Error closing encounter");
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!encounter) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-4">
                        Encounter not found
                    </p>
                    <button
                        onClick={() => router.push("/encounters")}
                        className="btn btn-primary"
                    >
                        Back to Encounters
                    </button>
                </div>
            </div>
        );
    }

    const isActive = !encounter.endedAt;

    return (
        <div className="min-h-screen bg-base-200 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.push("/encounters")}
                        className="btn btn-ghost gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Encounters
                    </button>

                    {isActive && (
                        <span className="badge badge-success badge-lg">
                            In Progress
                        </span>
                    )}
                    {!isActive && (
                        <span className="badge badge-ghost badge-lg">
                            Completed
                        </span>
                    )}
                </div>

                {/* Patient Information Card */}
                <div className="card bg-white shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-4">
                            Patient Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <p className="text-sm opacity-60">
                                            Patient Name
                                        </p>
                                        <p className="font-semibold text-lg">
                                            {encounter.patientDto.userDto.fullName}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm opacity-60">Phone</p>
                                    <p className="font-medium">
                                        {encounter.patientDto.userDto.phone}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm opacity-60">Gender</p>
                                    <p className="font-medium">
                                        {encounter.patientDto.userDto.gender
                                            ? "Male"
                                            : "Female"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm opacity-60">
                                        Blood Type
                                    </p>
                                    <p className="font-medium">
                                        {encounter.patientDto.bloodType || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <p className="text-sm opacity-60">
                                            Encounter Date
                                        </p>
                                        <p className="font-semibold">
                                            {formatDate(encounter.startedAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <p className="text-sm opacity-60">
                                            Start Time
                                        </p>
                                        <p className="font-semibold">
                                            {formatTime(encounter.startedAt)}
                                        </p>
                                    </div>
                                </div>

                                {encounter.patientDto.allergies && (
                                    <div className="alert alert-warning">
                                        <Stethoscope className="w-5 h-5" />
                                        <div>
                                            <p className="font-semibold">
                                                Allergies
                                            </p>
                                            <p className="text-sm">
                                                {encounter.patientDto.allergies}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {encounter.appointmentDto.description && (
                            <div className="mt-4 p-4 bg-base-200 rounded-lg">
                                <p className="text-sm opacity-60 mb-1">
                                    Appointment Description
                                </p>
                                <p>{encounter.appointmentDto.description}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Diagnosis Section */}
                <div className="card bg-white shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title text-xl mb-4">Diagnosis</h2>

                        <textarea
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            placeholder="Enter diagnosis..."
                            className="textarea textarea-bordered w-full h-32"
                            disabled={!isActive}
                        />

                        {isActive && (
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleSaveDiagnosis}
                                    disabled={saving || !diagnosis.trim()}
                                    className="btn btn-primary"
                                >
                                    {saving ? (
                                        <span className="loading loading-spinner"></span>
                                    ) : (
                                        "Save Diagnosis"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes Section */}
                <div className="card bg-white shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title text-xl mb-4">
                            Clinical Notes
                        </h2>

                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter clinical notes, observations, treatment plan..."
                            className="textarea textarea-bordered w-full h-48"
                            disabled={!isActive}
                        />

                        {isActive && (
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleSaveNotes}
                                    disabled={saving}
                                    className="btn btn-outline btn-primary"
                                >
                                    {saving ? (
                                        <span className="loading loading-spinner"></span>
                                    ) : (
                                        "Save Notes"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Close Encounter Button */}
                {isActive && (
                    <div className="card bg-white shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        Close Encounter
                                    </h3>
                                    <p className="text-sm opacity-60">
                                        Mark this encounter as completed. Make
                                        sure to save diagnosis and notes before
                                        closing.
                                    </p>
                                </div>
                                <button
                                    onClick={handleCloseEncounter}
                                    disabled={saving || !diagnosis.trim()}
                                    className="btn btn-error"
                                >
                                    {saving ? (
                                        <span className="loading loading-spinner"></span>
                                    ) : (
                                        "Close Encounter"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {!isActive && encounter.endedAt && (
                    <div className="alert alert-info">
                        <div>
                            <p className="font-semibold">
                                Encounter Closed
                            </p>
                            <p className="text-sm">
                                This encounter was completed on{" "}
                                {formatDate(encounter.endedAt)} at{" "}
                                {formatTime(encounter.endedAt)}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
