"use client";

import { useState, useEffect } from "react";
import {
    CalendarClock,
    ClipboardList,
    Users,
    MessageSquareText,
} from "lucide-react";
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

const StatsGrid = () => {
    const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0);

    useEffect(() => {
        const fetchTodayAppointments = async () => {
            const token = Cookies.get("token");
            if (!token) return;

            try {
                const response = await fetch("/api/appointments/confirmed", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const appointments: AppointmentDto[] = await response.json();

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);

                    const todayAppointments = appointments.filter((apt) => {
                        const appointmentDate = new Date(apt.startsAt);
                        return appointmentDate >= today && appointmentDate < tomorrow;
                    });

                    setTodayAppointmentsCount(todayAppointments.length);
                }
            } catch (error) {
                console.error("Failed to fetch today's appointments:", error);
            }
        };

        fetchTodayAppointments();
    }, []);

    const statsData = [
        {
            title: "Today's Appointments",
            value: todayAppointmentsCount,
            icon: CalendarClock,
            trend: "12%",
            trendUp: true,
        },
        {
            title: "Admission",
            value: 8,
            icon: ClipboardList,
            trend: "5%",
            trendUp: false,
        },
        {
            title: "Waitlist",
            value: 3,
            icon: Users,
            trend: "20%",
            trendUp: true,
        },
        {
            title: "Message",
            value: 24,
            icon: MessageSquareText,
            trend: "12%",
            trendUp: true,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    trend={stat.trend}
                    trendUp={stat.trendUp}
                />
            ))}
        </div>
    );
};

export default StatsGrid;
