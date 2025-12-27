"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import DashboardHeader from "@/components/staff/dashboard/DashboardHeader";
import NotificationPanel from "@/components/staff/dashboard/NotificationPanel";
import PatientStatisticChart from "@/components/staff/dashboard/PatientStatisticChart";
import StatsGrid from "@/components/staff/dashboard/StatGrid";

interface UserData {
    fullName: string;
    avatarUrl: string;
    email: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get("token");

        if (!token) {
            router.push("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    Cookies.remove("token");
                    router.push("/login");
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <DashboardHeader
                userName={user?.fullName}
                avatarUrl={user?.avatarUrl}
            />

            <StatsGrid />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[450px]">
                <div className="lg:col-span-2">
                    <PatientStatisticChart />
                </div>
                <div className="lg:col-span-1">
                    <NotificationPanel />
                </div>
            </div>
        </div>
    );
}
