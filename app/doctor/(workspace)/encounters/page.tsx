"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import EncounterCard from "@/components/doctor/manage-encounter/EncounterCard";

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

export default function ManageEncounterPage() {
    const router = useRouter();
    const [encounters, setEncounters] = useState<EncounterDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEncounters = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const doctorResponse = await fetch("/api/doctors/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!doctorResponse.ok) {
                    if (
                        doctorResponse.status === 401 ||
                        doctorResponse.status === 403
                    ) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        router.push("/login");
                    } else {
                        toast.error("Failed to fetch doctor information");
                    }
                    return;
                }

                const doctorData = await doctorResponse.json();
                const doctorId = doctorData.id;

                if (!doctorId) {
                    toast.error("Unable to identify doctor");
                    return;
                }

                const response = await fetch(
                    `/api/encounters/doctor/${doctorId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.ok) {
                    const data: EncounterDto[] = await response.json();
                    const activeEncounters = data
                        .filter((e) => !e.endedAt)
                        .sort(
                            (a, b) =>
                                new Date(b.startedAt).getTime() -
                                new Date(a.startedAt).getTime()
                        );
                    setEncounters(activeEncounters);
                } else if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    router.push("/login");
                } else {
                    toast.error("Failed to load encounters");
                }
            } catch (error) {
                console.error("Error fetching encounters:", error);
                toast.error("Error loading encounters");
            } finally {
                setLoading(false);
            }
        };

        fetchEncounters();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Active Encounters
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Current patient encounters in progress
                        </p>
                    </div>
                    <div className="badge badge-primary badge-lg">
                        {encounters.length} Active
                    </div>
                </div>

                <div className="space-y-4">
                    {encounters.length > 0 ? (
                        encounters.map((encounter) => (
                            <EncounterCard
                                key={encounter.id}
                                encounter={encounter}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border">
                            <div className="max-w-md mx-auto">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No Active Encounters
                                </h3>
                                <p className="text-gray-500">
                                    You do not have any active encounters at the
                                    moment. Active encounters will appear here.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
