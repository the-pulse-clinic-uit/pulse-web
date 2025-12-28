"use client";

import { useState } from "react";
import { User, Clock, Phone, Activity, AlertCircle, Stethoscope } from "lucide-react";
import EncounterModal from "./EncounterModal";

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

interface Props {
    encounter: EncounterDto;
    onUpdate?: () => void;
}

export default function EncounterCard({ encounter, onUpdate }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const isActive = !encounter.endedAt;

    return (
        <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">
                                {encounter.patientDto.userDto.fullName}
                            </h3>
                            <p className="text-sm text-gray-500">
                                ID: #{encounter.id.substring(0, 8)}
                            </p>
                        </div>
                    </div>
                    {isActive && (
                        <span className="badge badge-success">In Progress</span>
                    )}
                    {!isActive && (
                        <span className="badge badge-ghost">Completed</span>
                    )}
                </div>

                {/* Patient Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm font-medium">
                                {encounter.patientDto.userDto.phone}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Blood Type</p>
                            <p className="text-sm font-medium">
                                {encounter.patientDto.bloodType || "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Gender</p>
                            <p className="text-sm font-medium">
                                {encounter.patientDto.userDto.gender
                                    ? "Male"
                                    : "Female"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Allergies Warning */}
                {encounter.patientDto.allergies && (
                    <div className="alert alert-warning mb-4 py-2">
                        <AlertCircle className="w-4 h-4" />
                        <div>
                            <p className="text-xs font-semibold">Allergies</p>
                            <p className="text-sm">
                                {encounter.patientDto.allergies}
                            </p>
                        </div>
                    </div>
                )}

                {/* Encounter Details */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                            {formatDate(encounter.startedAt)} at{" "}
                            {formatTime(encounter.startedAt)}
                        </span>
                    </div>

                    {encounter.appointmentDto.description && (
                        <div className="bg-base-200 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">
                                Appointment Description
                            </p>
                            <p className="text-sm">
                                {encounter.appointmentDto.description}
                            </p>
                        </div>
                    )}

                    {encounter.diagnosis && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">
                                Diagnosis
                            </p>
                            <p className="text-sm">{encounter.diagnosis}</p>
                        </div>
                    )}

                    {encounter.notes && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">
                                Clinical Notes
                            </p>
                            <p className="text-sm">{encounter.notes}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {encounter.endedAt && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                            Completed on {formatDate(encounter.endedAt)} at{" "}
                            {formatTime(encounter.endedAt)}
                        </p>
                    </div>
                )}

                {/* Start Encounter Button */}
                {isActive && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn btn-primary w-full gap-2"
                        >
                            <Stethoscope className="w-5 h-5" />
                            Start Encounter
                        </button>
                    </div>
                )}
            </div>

            {/* Encounter Modal */}
            <EncounterModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                encounter={encounter}
                onSuccess={() => {
                    setIsModalOpen(false);
                    onUpdate?.();
                }}
            />
        </div>
    );
}
