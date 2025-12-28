"use client";

import EncounterCard from "./EncounterCard";
import { Stethoscope } from "lucide-react";

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

interface EncountersListProps {
    encounters: EncounterDto[];
}

export default function EncountersList({ encounters }: EncountersListProps) {
    const activeEncounters = encounters.filter((e) => !e.endedAt);
    const completedEncounters = encounters.filter((e) => e.endedAt);

    if (encounters.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="avatar placeholder mb-4">
                    <div className="bg-base-200 rounded-full w-20">
                        <Stethoscope className="w-10 h-10" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                    No Encounters Found
                </h3>
                <p className="opacity-60">
                    There are no encounters to display at the moment.
                </p>
            </div>
        );
    }

    return (
        <>
            {activeEncounters.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-bold">
                            Active Encounters
                        </h2>
                        <span className="badge badge-primary">
                            {activeEncounters.length}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {activeEncounters.map((encounter) => (
                            <EncounterCard
                                key={encounter.id}
                                encounter={encounter}
                                isActive={true}
                            />
                        ))}
                    </div>
                </div>
            )}

            {completedEncounters.length > 0 && (
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-bold">
                            Completed Encounters
                        </h2>
                        <span className="badge badge-ghost">
                            {completedEncounters.length}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {completedEncounters.map((encounter) => (
                            <EncounterCard
                                key={encounter.id}
                                encounter={encounter}
                                isActive={false}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
