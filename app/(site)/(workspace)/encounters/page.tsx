"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import EncounterCard from "@/components/patient/encounter/EncounterCard";

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

interface PatientDto {
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
}

export default function EncountersPage() {
    const [encounters, setEncounters] = useState<EncounterDto[]>([]);
    const [patient, setPatient] = useState<PatientDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatientAndEncounters = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login to view encounters");
                setLoading(false);
                return;
            }

            try {
                // First, fetch patient information
                const patientResponse = await fetch("/api/patients/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!patientResponse.ok) {
                    throw new Error("Failed to fetch patient information");
                }

                const patientData: PatientDto = await patientResponse.json();
                setPatient(patientData);

                // Then, fetch encounters for this patient
                const encountersResponse = await fetch(
                    `/api/encounters/patient/${patientData.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!encountersResponse.ok) {
                    throw new Error("Failed to fetch encounters");
                }

                const encountersData: EncounterDto[] = await encountersResponse.json();
                setEncounters(encountersData);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to load encounters"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPatientAndEncounters();
    }, []);

    return (
        <div className="min-h-screen mt-8">
            <div className="max-w-7xl mx-auto px-4 py-4 pt-20">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold text-purple-900 mb-2">
                        My Encounters
                    </h1>
                    <p className="text-gray-600">
                        View your medical encounter history and records
                    </p>
                    {patient && (
                        <p className="text-sm text-gray-500 mt-2">
                            Patient: {patient.userDto.fullName}
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : encounters.length === 0 ? (
                    <div className="text-center py-12 bg-base-200 rounded-lg">
                        <p className="text-gray-500">No encounters found</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {encounters.map((encounter) => (
                            <EncounterCard key={encounter.id} encounter={encounter} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
