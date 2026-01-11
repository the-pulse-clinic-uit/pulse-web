"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

type AdmissionStatus = "ONGOING" | "DISCHARGED" | "OUTPATIENT";

interface CreateAdmissionRequest {
    status: AdmissionStatus;
    notes: string;
    encounterDto: {
        id: string;
    };
    roomDto: {
        id: string;
    };
}

interface Encounter {
    id: string;
    type: string;
    startedAt: string;
    endedAt: string;
    diagnosis: string;
    notes: string;
    createdAt: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    appointmentId: string;
    admissionStatus: "ONGOING" | "DISCHARGED" | "OUTPATIENT" | null;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddAdmissionModal({
    isOpen,
    onClose,
    onSuccess,
}: Props) {
    const [notes, setNotes] = useState("");
    const [selectedRoomId, setSelectedRoomId] = useState("");
    const [selectedEncounterId, setSelectedEncounterId] = useState("");
    const [status, setStatus] = useState<AdmissionStatus>("ONGOING");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [encounters, setEncounters] = useState<Encounter[]>([]);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [loadingEncounters, setLoadingEncounters] = useState(false);
    const [saving, setSaving] = useState(false);

    const selectedEncounter = encounters.find(
        (enc) => enc.id === selectedEncounterId
    );

    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get("token");
            if (!token) {
                console.log("No token found");
                return;
            }

            setLoadingRooms(true);
            try {
                const response = await fetch("/api/rooms", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data: Room[] = await response.json();
                    const availableRooms = data.filter(
                        (room) => room.isAvailable
                    );
                    setRooms(availableRooms);
                } else {
                    console.error("Failed to fetch rooms:", response.status);
                    toast.error("Failed to load rooms");
                }
            } catch (error) {
                console.error("Error fetching rooms:", error);
                toast.error("Error loading rooms");
            } finally {
                setLoadingRooms(false);
            }

            setLoadingEncounters(true);
            try {
                const response = await fetch(
                    "/api/encounters/eligible-for-admission",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.ok) {
                    const data: Encounter[] = await response.json();
                    const filteredEncounters = data.filter(
                        (enc) =>
                            enc.admissionStatus === null ||
                            enc.admissionStatus === "DISCHARGED" ||
                            enc.admissionStatus === "OUTPATIENT"
                    );
                    setEncounters(filteredEncounters);
                } else {
                    console.error(
                        "Failed to fetch encounters:",
                        response.status
                    );
                    toast.error("Failed to load encounters");
                }
            } catch (error) {
                console.error("Error fetching encounters:", error);
                toast.error("Error loading encounters");
            } finally {
                setLoadingEncounters(false);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const handleSave = async () => {
        if (!selectedEncounterId) {
            toast.error("Please select an encounter");
            return;
        }

        if (!notes.trim()) {
            toast.error("Notes are required");
            return;
        }

        if (!selectedRoomId) {
            toast.error("Please select a room");
            return;
        }

        if (!selectedEncounter) {
            toast.error("Invalid encounter selected");
            return;
        }

        const token = Cookies.get("token");
        if (!token) {
            toast.error("Authentication required");
            return;
        }

        setSaving(true);
        try {
            const requestBody: CreateAdmissionRequest = {
                status: status,
                notes: notes.trim(),
                encounterDto: {
                    id: selectedEncounterId,
                },
                roomDto: {
                    id: selectedRoomId,
                },
            };

            const response = await fetch("/api/admissions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message || "Failed to create admission"
                );
            }

            toast.success("Admission created successfully");
            handleClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error("Error creating admission:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to create admission"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setNotes("");
        setSelectedRoomId("");
        setSelectedEncounterId("");
        setStatus("ONGOING");
        onClose();
    };

    const getStatusLabel = (status: AdmissionStatus): string => {
        switch (status) {
            case "ONGOING":
                return "Ongoing";
            case "DISCHARGED":
                return "Discharged";
            case "OUTPATIENT":
                return "Outpatient";
            default:
                return status;
        }
    };

    const formatDateTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!isOpen) return null;

    return (
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-2xl">Add Admission</h3>
                    <button
                        onClick={handleClose}
                        className="btn btn-ghost btn-sm btn-circle"
                        disabled={saving}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">
                                Encounter <span className="text-error">*</span>
                            </span>
                            <span className="label-text-alt text-gray-500">
                                {encounters.length} completed
                            </span>
                        </label>
                        <select
                            value={selectedEncounterId}
                            onChange={(e) =>
                                setSelectedEncounterId(e.target.value)
                            }
                            className="select select-bordered w-full"
                            disabled={saving || loadingEncounters}
                        >
                            <option value="">
                                {loadingEncounters
                                    ? "Loading encounters..."
                                    : "Select an encounter"}
                            </option>
                            {encounters.map((enc) => (
                                <option key={enc.id} value={enc.id}>
                                    {enc.patientName} -{" "}
                                    {formatDateTime(enc.startedAt)} (
                                    {enc.doctorName})
                                </option>
                            ))}
                        </select>
                        {selectedEncounter && (
                            <div className="mt-2 p-3 bg-base-200 rounded-lg space-y-1 text-sm">
                                <p>
                                    <span className="font-semibold">
                                        Patient:
                                    </span>{" "}
                                    {selectedEncounter.patientName}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Doctor:
                                    </span>{" "}
                                    {selectedEncounter.doctorName}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Diagnosis:
                                    </span>{" "}
                                    {selectedEncounter.diagnosis}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Type:
                                    </span>{" "}
                                    {selectedEncounter.type}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Started:
                                    </span>{" "}
                                    {formatDateTime(selectedEncounter.startedAt)}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Ended:
                                    </span>{" "}
                                    {formatDateTime(selectedEncounter.endedAt)}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">
                                Admission Status{" "}
                                <span className="text-error">*</span>
                            </span>
                        </label>
                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value as AdmissionStatus)
                            }
                            className="select select-bordered w-full"
                            disabled={saving}
                        >
                            <option value="ONGOING">
                                {getStatusLabel("ONGOING")}
                            </option>
                            <option value="DISCHARGED">
                                {getStatusLabel("DISCHARGED")}
                            </option>
                            <option value="OUTPATIENT">
                                {getStatusLabel("OUTPATIENT")}
                            </option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">
                                Room <span className="text-error">*</span>
                            </span>
                            <span className="label-text-alt text-gray-500">
                                {rooms.length} available
                            </span>
                        </label>
                        <select
                            value={selectedRoomId}
                            onChange={(e) => setSelectedRoomId(e.target.value)}
                            className="select select-bordered w-full"
                            disabled={saving || loadingRooms}
                        >
                            <option value="">
                                {loadingRooms
                                    ? "Loading rooms..."
                                    : "Select a room"}
                            </option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    Room {room.roomNumber} -{" "}
                                    {room.departmentDto.name} ({room.bedAmount}{" "}
                                    {room.bedAmount === 1 ? "bed" : "beds"})
                                </option>
                            ))}
                        </select>
                        {selectedRoomId && (
                            <label className="label">
                                <span className="label-text-alt text-gray-500">
                                    {
                                        rooms.find(
                                            (r) => r.id === selectedRoomId
                                        )?.departmentDto.description
                                    }
                                </span>
                            </label>
                        )}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">
                                Notes <span className="text-error">*</span>
                            </span>
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter admission notes..."
                            className="textarea textarea-bordered w-full h-32"
                            disabled={saving}
                        />
                    </div>

                    {encounters.length === 0 && !loadingEncounters && (
                        <div className="alert alert-info">
                            <div>
                                <p className="font-semibold">
                                    No completed encounters
                                </p>
                                <p className="text-sm">
                                    There are currently no completed encounters
                                    available for admission. Please ensure
                                    encounters are completed first.
                                </p>
                            </div>
                        </div>
                    )}

                    {rooms.length === 0 && !loadingRooms && (
                        <div className="alert alert-warning">
                            <div>
                                <p className="font-semibold">
                                    No available rooms
                                </p>
                                <p className="text-sm">
                                    There are currently no available rooms.
                                    Please check back later or contact
                                    administration.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-action">
                    <button
                        onClick={handleClose}
                        className="btn"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={
                            !selectedEncounterId ||
                            !notes.trim() ||
                            !selectedRoomId ||
                            saving ||
                            encounters.length === 0 ||
                            rooms.length === 0
                        }
                        className="btn btn-primary"
                    >
                        {saving ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            "Create Admission"
                        )}
                    </button>
                </div>
            </div>

            <div className="modal-backdrop" onClick={handleClose}>
                <button disabled={saving}>close</button>
            </div>
        </div>
    );
}
