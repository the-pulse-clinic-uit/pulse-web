"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import Cookies from "js-cookie";
import AppointmentCard from "./AppointmentCard";

interface Appointment {
    id: string;
    startsAt: string;
    endsAt: string;
    status: string;
    type: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    patientDto: {
        id: string;
        healthInsuranceId: string;
        bloodType: string;
        allergies: string;
        createdAt: string;
        userDto: {
            id: string;
            email: string;
            fullName: string;
            address: string | null;
            citizenId: string;
            phone: string;
            gender: boolean;
            birthDate: string;
            avatarUrl: string | null;
            createdAt: string;
            updatedAt: string;
            isActive: boolean;
        };
    };
    doctorDto: {
        id: string;
        licenseId: string;
        isVerified: boolean;
        createdAt: string;
        staffDto: {
            id: string;
            position: string;
            createdAt: string;
            userDto: {
                id: string;
                email: string;
                fullName: string;
                address: string;
                citizenId: string;
                phone: string;
                gender: boolean;
                birthDate: string;
                avatarUrl: string | null;
                createdAt: string;
                updatedAt: string;
                isActive: boolean;
            };
        };
        departmentDto: {
            id: string;
            name: string;
            description: string;
            createdAt: string;
        } | null;
    };
    shiftAssignmentDto: unknown;
    followUpPlanDto: unknown;
}

export default function AppointmentList() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = Cookies.get("token");
                if (!token) {
                    throw new Error("No authentication token found");
                }

                const appointmentsRes = await fetch("/api/appointments/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!appointmentsRes.ok) {
                    throw new Error("Failed to fetch appointments");
                }

                const data: Appointment[] = await appointmentsRes.json();
                setAppointments(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch appointments"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);
    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-purple-900 text-2xl sm:text-3xl font-semibold mb-1 sm:mb-2">
                        My Appointments
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base">
                        View and manage your appointments
                    </p>
                </div>

                <Link
                    href="/book-appointment"
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3
             bg-gradient-to-r from-purple-500 to-purple-600
             text-white rounded-full hover:shadow-lg transition-all
             text-sm sm:text-base whitespace-nowrap"
                >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />

                    {/* Show on Laptop/Tablet (sm and up) */}
                    <span className="hidden sm:inline">Book Appointment</span>

                    {/* Show on Phone (below sm) */}
                    <span className="inline sm:hidden">Book</span>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner loading-lg text-purple-500"></span>
                </div>
            ) : error ? (
                <div className="alert alert-error text-sm sm:text-base">
                    <span>{error}</span>
                </div>
            ) : appointments.length === 0 ? (
                <div className="text-center py-12 sm:py-20">
                    <p className="text-gray-500 text-base sm:text-lg mb-4">
                        No appointments found
                    </p>
                    <Link
                        href="/book-appointment"
                        className="text-purple-600 hover:underline text-sm sm:text-base"
                    >
                        Book your first appointment
                    </Link>
                </div>
            ) : (
                <div className="space-y-4 sm:space-y-6">
                    {appointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
