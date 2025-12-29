"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import EncounterCard from "./EncounterCard";

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

export default function EncounterList() {
    const router = useRouter();
    const [encounters, setEncounters] = useState<EncounterDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

    useEffect(() => {
        const fetchEncounters = async () => {
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");

            if (!token) {
                router.push("/login");
                return;
            }

            try {
                // Get doctor ID from user data
                let doctorId: string | null = null;
                if (userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        doctorId = user.id;
                    } catch (e) {
                        console.error("Error parsing user data:", e);
                    }
                }

                // If no doctorId in localStorage, fetch from /api/users/me
                if (!doctorId) {
                    const meResponse = await fetch(
                        "http://localhost:8080/api/users/me",
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                    if (meResponse.ok) {
                        const meData = await meResponse.json();
                        doctorId = meData.id;
                        localStorage.setItem("user", JSON.stringify(meData));
                    }
                }

                if (!doctorId) {
                    toast.error("Unable to identify doctor");
                    return;
                }

                // Fetch doctor's encounters using the doctor ID
                const response = await fetch(
                    `http://localhost:8080/api/encounters/doctor/${doctorId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.ok) {
                    const data: EncounterDto[] = await response.json();
                    // Sort by startedAt descending (newest first)
                    const sortedData = data.sort(
                        (a, b) =>
                            new Date(b.startedAt).getTime() -
                            new Date(a.startedAt).getTime()
                    );
                    setEncounters(sortedData);
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

    const activeEncounters = encounters.filter((e) => !e.endedAt);
    const completedEncounters = encounters.filter((e) => e.endedAt);

    const displayedEncounters =
        activeTab === "active" ? activeEncounters : completedEncounters;

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("active")}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === "active"
                            ? "text-primary border-b-2 border-primary"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Active Encounters
                    {activeEncounters.length > 0 && (
                        <span className="ml-2 px-2 py-1 text-xs bg-primary text-white rounded-full">
                            {activeEncounters.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("completed")}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === "completed"
                            ? "text-amber-500 border-b-2 border-amber-500"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Completed
                    {completedEncounters.length > 0 && (
                        <span className="ml-2 px-2 py-1 text-xs bg-amber-500 text-white rounded-full">
                            {completedEncounters.length}
                        </span>
                    )}
                </button>
            </div>

            <div className="space-y-4">
                {displayedEncounters.length > 0 ? (
                    displayedEncounters.map((encounter) => (
                        <EncounterCard key={encounter.id} encounter={encounter} />
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border">
                        <p className="text-gray-500">
                            {activeTab === "active"
                                ? "No active encounters"
                                : "No completed encounters"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}