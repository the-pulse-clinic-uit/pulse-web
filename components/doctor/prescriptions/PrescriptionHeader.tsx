"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Cookies from "js-cookie";
import Image from "next/image";
interface UserData {
    fullName: string;
    avatarUrl?: string;
}

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PrescriptionHeader() {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [user, setUser] = useState<UserData | null>(null);
    const calendarRef = useRef<HTMLDivElement>(null);

    const fetchUserData = useCallback(async () => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            const response = await fetch("/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const initialize = async () => {
            await fetchUserData();
        };

        initialize();

        return () => {
            isMounted = false;
        };
    }, [fetchUserData]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                calendarRef.current &&
                !calendarRef.current.contains(event.target as Node)
            ) {
                setIsCalendarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const handleDateSelect = (day: number) => {
        const newDate = new Date(currentYear, currentMonth, day);
        setSelectedDate(newDate);
        setIsCalendarOpen(false);
    };

    const navigateMonth = (direction: "prev" | "next") => {
        if (direction === "prev") {
            if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
            } else {
                setCurrentMonth(currentMonth - 1);
            }
        } else {
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
            } else {
                setCurrentMonth(currentMonth + 1);
            }
        }
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        );
    };

    const isSelected = (day: number) => {
        return (
            day === selectedDate.getDate() &&
            currentMonth === selectedDate.getMonth() &&
            currentYear === selectedDate.getFullYear()
        );
    };

    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <p className="text-gray-500 text-sm">
                    Hi, Dr. {user?.fullName}!
                </p>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Manage Prescriptions
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="btn btn-ghost text-sm border-gray-200"
                >
                    {selectedDate.toLocaleDateString()}
                </button>
                <div className="relative" ref={calendarRef}>
                    {isCalendarOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border shadow-lg z-50 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={() => navigateMonth("prev")}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                                </button>

                                <h3 className="font-semibold text-gray-900">
                                    {months[currentMonth]} {currentYear}
                                </h3>

                                <button
                                    onClick={() => navigateMonth("next")}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {daysOfWeek.map((day) => (
                                    <div
                                        key={day}
                                        className="text-center text-xs font-medium text-gray-500 py-2"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {generateCalendarDays().map((day, index) => (
                                    <div key={index} className="aspect-square">
                                        {day && (
                                            <button
                                                onClick={() =>
                                                    handleDateSelect(day)
                                                }
                                                className={`w-full h-full flex items-center justify-center text-sm rounded transition-colors ${
                                                    isSelected(day)
                                                        ? "bg-blue-600 text-white"
                                                        : isToday(day)
                                                        ? "bg-blue-100 text-blue-600 font-medium"
                                                        : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                            >
                                                {day}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                            Dr. {user?.fullName}
                        </p>
                    </div>
                    <div className="avatar">
                        <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <Image
                                src={user?.avatarUrl || "/default-avatar.png"}
                                alt="User Avatar"
                                width={40}
                                height={40}
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
