"use client";

import { useState, useEffect } from "react";
import { CalendarClock, ClipboardList, Users } from "lucide-react";
import Cookies from "js-cookie";
import StatCard from "./StatCard";

interface AppointmentDto {
    id: string;
    startsAt: string;
    endsAt: string;
    status: string;
    type: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

interface AdmissionDto {
    id: string;
    admissionDate: string;
    dischargeDate: string | null;
    status: string;
    notes: string | null;
}

interface WaitlistEntryDto {
    id: string;
    dutyDate: string;
    status: string;
    priority: string;
    notes: string | null;
}

const StatsGrid = () => {
    const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0);
    const [currentPatientsCount, setCurrentPatientsCount] = useState(0);
    const [waitlistCount, setWaitlistCount] = useState(0);

    useEffect(() => {
        const fetchTodayAppointments = async () => {
            const token = Cookies.get("token");
            if (!token) return;

            try {
                const response = await fetch("/api/appointments/confirmed", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const appointments: AppointmentDto[] =
                        await response.json();

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);

                    const todayAppointments = appointments.filter((apt) => {
                        const appointmentDate = new Date(apt.startsAt);
                        return (
                            appointmentDate >= today &&
                            appointmentDate < tomorrow
                        );
                    });

                    setTodayAppointmentsCount(todayAppointments.length);
                }
            } catch (error) {
                console.error("Failed to fetch today's appointments:", error);
            }
        };

        const fetchCurrentPatients = async () => {
            const token = Cookies.get("token");
            if (!token) return;

            try {
                const response = await fetch("/api/admissions", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const admissions: AdmissionDto[] = await response.json();

                    const currentPatients = admissions.filter(
                        (admission) => admission.status === "ONGOING"
                    );

                    setCurrentPatientsCount(currentPatients.length);
                }
            } catch (error) {
                console.error("Failed to fetch admissions:", error);
            }
        };

        const fetchWaitlist = async () => {
            const token = Cookies.get("token");
            if (!token) return;

            try {
                const response = await fetch("/api/waitlist", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const waitlistEntries: WaitlistEntryDto[] =
                        await response.json();

                    const today = new Date().toISOString().split("T")[0];
                    const waitingPatients = waitlistEntries.filter(
                        (entry) =>
                            entry.status === "WAITING" &&
                            entry.dutyDate >= today
                    );

                    setWaitlistCount(waitingPatients.length);
                }
            } catch (error) {
                console.error("Failed to fetch waitlist:", error);
            }
        };

        fetchTodayAppointments();
        fetchCurrentPatients();
        fetchWaitlist();
    }, []);

    const statsData = [
        {
            title: "Today's Appointments",
            value: todayAppointmentsCount,
            icon: CalendarClock,
        },
        {
            title: "Current Patients",
            value: currentPatientsCount,
            icon: ClipboardList,
        },
        {
            title: "Waitlist",
            value: waitlistCount,
            icon: Users,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsData.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                />
            ))}
        </div>
    );
};

export default StatsGrid;
