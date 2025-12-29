"use client";

import { Clock, User, Stethoscope, FileText } from "lucide-react";

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

interface EncounterCardProps {
    encounter: EncounterDto;
    isActive?: boolean;
}

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

export default function EncounterCard({
    encounter,
    isActive = false,
}: EncounterCardProps) {
    const statusBadge = encounter.endedAt
        ? "badge badge-primary"
        : "badge badge-success";
    const statusLabel = encounter.endedAt ? "Completed" : "In Progress";

    if (isActive) {
        return (
            <div className="card bg-white shadow hover:shadow-lg transition-shadow">
                <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                                <div className="bg-primary text-primary-content rounded-full w-12">
                                    <Stethoscope className="w-6 h-6" />
                                </div>
                            </div>
                            <div>
                                <p className="font-mono text-lg font-bold">
                                    #{encounter.id.substring(0, 8)}
                                </p>
                                <p className="text-xs opacity-60">
                                    Encounter ID
                                </p>
                            </div>
                        </div>
                        <span className={statusBadge}>{statusLabel}</span>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs opacity-60">Patient</p>
                                <p className="font-semibold truncate">
                                    {encounter.patientDto.userDto.fullName}
                                </p>
                                <p className="text-xs opacity-60">
                                    {encounter.patientDto.userDto.phone} •{" "}
                                    {encounter.patientDto.userDto.gender
                                        ? "Male"
                                        : "Female"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Stethoscope className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs opacity-60">Doctor</p>
                                <p className="font-semibold truncate">
                                    {
                                        encounter.doctorDto.staffDto.userDto
                                            .fullName
                                    }
                                </p>
                                <p className="text-xs opacity-60">
                                    {encounter.doctorDto.departmentDto?.name ||
                                        "General"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs opacity-60">Started At</p>
                                <p className="font-semibold text-sm">
                                    {formatDate(encounter.startedAt)} at{" "}
                                    {formatTime(encounter.startedAt)}
                                </p>
                            </div>
                        </div>

                        {encounter.notes && (
                            <div className="bg-base-200 p-3 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <FileText className="w-4 h-4 opacity-60 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs opacity-60 mb-1">
                                            Notes
                                        </p>
                                        <p className="text-sm">
                                            {encounter.notes}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-white shadow hover:shadow-md transition-shadow">
            <div className="card-body p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                            <div className="bg-base-200 rounded-full w-10">
                                <Stethoscope className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <p className="font-mono text-xs font-semibold">
                                #{encounter.id.substring(0, 8)}
                            </p>
                        </div>
                    </div>
                    <span className={statusBadge}>{statusLabel}</span>
                </div>

                <div className="space-y-2 text-sm">
                    <div>
                        <p className="text-xs opacity-60">Patient</p>
                        <p className="font-semibold truncate">
                            {encounter.patientDto.userDto.fullName}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs opacity-60">Doctor</p>
                        <p className="font-medium truncate">
                            {encounter.doctorDto.staffDto.userDto.fullName}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs opacity-60">
                        <Clock className="w-4 h-4" />
                        {formatDate(encounter.startedAt)}
                    </div>

                    {encounter.diagnosis && (
                        <div className="bg-base-200 p-2 rounded-lg mt-2">
                            <p className="text-xs opacity-60">Diagnosis</p>
                            <p className="text-sm font-medium line-clamp-2">
                                {encounter.diagnosis || "N/A"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
