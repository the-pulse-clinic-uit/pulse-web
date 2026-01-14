"use client";

import { useState } from "react";
import {
    Clock,
    User,
    FileText,
    Calendar,
    AlertCircle,
    Building2,
    Star,
    MessageSquare,
} from "lucide-react";
import RatingModal from "./RatingModal";

interface EncounterDto {
    id: string;
    type: string;
    startedAt: string;
    endedAt: string | null;
    diagnosis: string;
    notes: string;
    createdAt: string;
    rating?: number | null;
    ratingComment?: string | null;
    ratedAt?: string | null;
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
        averageRating?: number;
        ratingCount?: number;
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
    onEncounterUpdate?: (updatedEncounter: EncounterDto) => void;
}

export default function EncounterCard({ encounter, onEncounterUpdate }: Props) {
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [currentEncounter, setCurrentEncounter] = useState(encounter);

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

    const isActive = !currentEncounter.endedAt;
    const isCompleted = !!currentEncounter.endedAt;
    const hasRating = currentEncounter.rating !== null && currentEncounter.rating !== undefined;

    const handleRatingSuccess = (updatedEncounter: unknown) => {
        const updated = updatedEncounter as EncounterDto;
        setCurrentEncounter(updated);
        onEncounterUpdate?.(updated);
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${
                            star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                        }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">
                                {encounter.doctorDto.staffDto.userDto.fullName}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Doctor</p>
                            <p className="text-sm font-medium">
                                {encounter.doctorDto.staffDto.userDto.fullName}
                            </p>
                        </div>
                    </div>

                    {encounter.doctorDto.departmentDto && (
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">
                                    Department
                                </p>
                                <p className="text-sm font-medium">
                                    {encounter.doctorDto.departmentDto.name}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Type</p>
                            <p className="text-sm font-medium">
                                {encounter.type}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Started</p>
                            <p className="text-sm font-medium">
                                {formatDate(encounter.startedAt)} at{" "}
                                {formatTime(encounter.startedAt)}
                            </p>
                        </div>
                    </div>
                </div>

                {encounter.patientDto.allergies && (
                    <div className="alert alert-warning mb-4 py-2">
                        <AlertCircle className="w-4 h-4" />
                        <div>
                            <p className="text-xs font-semibold">
                                Your Allergies
                            </p>
                            <p className="text-sm">
                                {encounter.patientDto.allergies}
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
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
                            <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <p className="text-xs text-gray-500 font-semibold">
                                    Diagnosis
                                </p>
                            </div>
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

                {isCompleted && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                                Completed on {formatDate(currentEncounter.endedAt!)} at{" "}
                                {formatTime(currentEncounter.endedAt!)}
                            </p>

                            {!hasRating && (
                                <button
                                    onClick={() => setShowRatingModal(true)}
                                    className="btn btn-sm btn-primary gap-2"
                                >
                                    <Star className="w-4 h-4" />
                                    Rate Visit
                                </button>
                            )}
                        </div>

                        {hasRating && (
                            <div className="mt-3 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-700">
                                            Your Rating:
                                        </span>
                                        {renderStars(currentEncounter.rating!)}
                                    </div>
                                    <span className="text-sm font-bold text-purple-600">
                                        {currentEncounter.rating}/5
                                    </span>
                                </div>
                                {currentEncounter.ratingComment && (
                                    <div className="flex items-start gap-2 mt-2">
                                        <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-600 italic">
                                            &quot;{currentEncounter.ratingComment}&quot;
                                        </p>
                                    </div>
                                )}
                                {currentEncounter.ratedAt && (
                                    <p className="text-xs text-gray-400 mt-2">
                                        Rated on {formatDate(currentEncounter.ratedAt)} at{" "}
                                        {formatTime(currentEncounter.ratedAt)}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <RatingModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                onSuccess={handleRatingSuccess}
                encounterId={currentEncounter.id}
                doctorName={currentEncounter.doctorDto.staffDto.userDto.fullName}
            />
        </div>
    );
}
