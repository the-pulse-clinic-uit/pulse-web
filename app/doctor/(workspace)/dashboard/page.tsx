"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import StatCard from "@/components/doctor/dashboard/StatCard";
import TodaySchedule from "@/components/doctor/dashboard/TodaySchedule";
import NotificationList from "@/components/doctor/dashboard/NotificationList";

interface User {
    id?: string;
    username?: string;
    email?: string;
    fullName?: string;
    avatar?: string | null;
    avatarUrl?: string | null;
    role?: string;
}

export default function DoctorDashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = Cookies.get("token");
            console.log("Token exists:", !!token);
            console.log("Token value:", token ? `${token.substring(0, 20)}...` : "NO TOKEN");
            
            if (!token) {
                console.error("No token found in cookies");
                setLoading(false);
                return;
            }

            const response = await fetch("/api/users/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                setLoading(false);
                return;
            }

            const data = await response.json();
            setUser(data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name: string) => {
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };
    const displayName = user?.fullName || "Doctor";
    const avatarUrl = user?.avatarUrl || user?.avatar;

    console.log("Display name:", displayName);
    console.log("Avatar URL:", avatarUrl);
    console.log("User object:", user);

    return (
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {loading ? (
                            <span className="loading loading-spinner loading-md"></span>
                        ) : (
                            `Welcome back, Dr. ${displayName}`
                        )}
                    </h1>
                    <p className="text-gray-600">
                        Here is what is happening with your patients today
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                            {loading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                `Dr. ${displayName}`
                            )}
                        </p>
                    </div>
                    {loading ? (
                        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    ) : avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={displayName}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {getInitials(displayName)}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Today's Appointments"
                    value="12"
                    trend="+12%"
                />
                <StatCard title="Pending Follow-ups" value="8" trend="+12%" />
                <StatCard title="Pending Admissions" value="3" trend="+12%" />
                <StatCard
                    title="Active Prescriptions"
                    value="24"
                    trend="+12%"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <TodaySchedule />
                </div>
                <div className="space-y-6">
                    <NotificationList />
                </div>
            </div>
        </div>
    );
}
