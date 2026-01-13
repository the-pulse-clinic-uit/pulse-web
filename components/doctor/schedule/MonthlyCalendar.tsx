"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

interface ShiftAssignment {
    id: string;
    dutyDate: string;
    roleInShift: string;
    status: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    doctorDto: {
        id: string;
        licenseId: string;
        isVerified: boolean;
        staffDto: {
            id: string;
            position: string;
            userDto: {
                id: string;
                email: string;
                fullName: string;
            };
            departmentDto: {
                id: string;
                name: string;
                description: string;
            };
        };
    };
    shiftDto: {
        id: string;
        name: string;
        kind: string;
        startTime: string;
        endTime: string;
        slotMinutes: number;
        capacityPerSlot: number;
        departmentDto: {
            id: string;
            name: string;
        };
        defaultRoomDto: {
            id: string;
            roomNumber: string;
        } | null;
    };
    roomDto: {
        id: string;
        roomNumber: string;
        departmentDto: {
            id: string;
            name: string;
        };
    } | null;
}

interface ScheduleItem {
    id: string;
    date: string;
    time: string;
    endTime: string;
    title: string;
    room: string;
    role: string;
}

interface MonthScheduleData {
    [key: string]: ScheduleItem[];
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthlyCalendar() {
    const [currentMonth, setCurrentMonth] = useState<Date>(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1);
    });
    const [scheduleData, setScheduleData] = useState<MonthScheduleData>({});
    const [loading, setLoading] = useState(true);
    const [doctorId, setDoctorId] = useState<string | null>(null);

    const formatDateForAPI = (date: Date): string => {
        return date.toISOString().split("T")[0];
    };

    const getMonthStartDate = (date: Date): Date => {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    };

    const getMonthEndDate = (date: Date): Date => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    };

    const formatTime = (dateTimeString: string): string => {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatDateKey = (date: Date): string => {
        return date.toISOString().split("T")[0];
    };

    const fetchDoctorInfo = useCallback(async () => {
        const token = Cookies.get("token");
        if (!token) return null;

        try {
            const response = await fetch("/api/doctors/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                return data.id;
            }
        } catch (error) {
            console.error("Error fetching doctor info:", error);
        }
        return null;
    }, []);

    const fetchSchedule = useCallback(
        async (docId: string) => {
            const token = Cookies.get("token");
            if (!token) return;

            setLoading(true);
            try {
                const startDate = formatDateForAPI(getMonthStartDate(currentMonth));
                const endDate = formatDateForAPI(getMonthEndDate(currentMonth));

                const response = await fetch(
                    `/api/shifts/assignments/by_doctor/${docId}?startDate=${startDate}&endDate=${endDate}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.ok) {
                    const assignments: ShiftAssignment[] = await response.json();

                    const formattedSchedule: MonthScheduleData = {};

                    assignments.forEach((assignment) => {
                        if (assignment.status === "ACTIVE") {
                            const dateKey = assignment.dutyDate;
                            if (!formattedSchedule[dateKey]) {
                                formattedSchedule[dateKey] = [];
                            }
                            const scheduleItem: ScheduleItem = {
                                id: assignment.id,
                                date: assignment.dutyDate,
                                time: formatTime(assignment.shiftDto.startTime),
                                endTime: formatTime(assignment.shiftDto.endTime),
                                title: assignment.shiftDto.name,
                                room: assignment.roomDto
                                    ? `Room ${assignment.roomDto.roomNumber}`
                                    : assignment.shiftDto.defaultRoomDto
                                    ? `Room ${assignment.shiftDto.defaultRoomDto.roomNumber}`
                                    : "No Room",
                                role: assignment.roleInShift,
                            };
                            formattedSchedule[dateKey].push(scheduleItem);
                        }
                    });

                    setScheduleData(formattedSchedule);
                } else {
                    toast.error("Failed to fetch schedule");
                }
            } catch (error) {
                console.error("Error fetching schedule:", error);
                toast.error("Failed to fetch schedule");
            } finally {
                setLoading(false);
            }
        },
        [currentMonth]
    );

    useEffect(() => {
        const initFetch = async () => {
            const docId = await fetchDoctorInfo();
            if (docId) {
                setDoctorId(docId);
            } else {
                setLoading(false);
            }
        };
        initFetch();
    }, [fetchDoctorInfo]);

    useEffect(() => {
        if (doctorId) {
            fetchSchedule(doctorId);
        }
    }, [doctorId, fetchSchedule]);

    const goToPreviousMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        );
    };

    const goToNextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        );
    };

    const goToCurrentMonth = () => {
        const today = new Date();
        setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    };

    const getMonthName = (): string => {
        return currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    };

    const getDaysInMonth = (): (Date | null)[] => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (Date | null)[] = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const getScheduleForDate = (date: Date): ScheduleItem[] => {
        const dateKey = formatDateKey(date);
        return scheduleData[dateKey] || [];
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                </div>
            </div>
        );
    }

    const days = getDaysInMonth();

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    Monthly Calendar
                </h2>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goToPreviousMonth}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="text-sm font-medium text-gray-700 min-w-[150px] text-center">
                            {getMonthName()}
                        </span>
                        <button
                            onClick={goToNextMonth}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                    <button
                        onClick={goToCurrentMonth}
                        className="btn btn-primary btn-sm"
                    >
                        Today
                    </button>
                </div>
            </div>

            <div className="w-full">
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {weekDays.map((day) => (
                        <div
                            key={day}
                            className="p-2 text-center font-semibold text-gray-700 bg-gray-50 rounded-lg"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {days.map((date, index) => (
                        <div
                            key={index}
                            className={`min-h-[100px] p-2 rounded-lg border ${
                                date
                                    ? isToday(date)
                                        ? "border-primary bg-primary/5"
                                        : "border-gray-200 bg-white hover:bg-gray-50"
                                    : "border-transparent bg-gray-50"
                            }`}
                        >
                            {date && (
                                <>
                                    <div
                                        className={`text-sm font-medium mb-1 ${
                                            isToday(date)
                                                ? "text-primary"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {date.getDate()}
                                    </div>
                                    <div className="space-y-1">
                                        {getScheduleForDate(date)
                                            .slice(0, 2)
                                            .map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="bg-primary/10 border border-primary/20 rounded p-1 cursor-pointer hover:bg-primary/20 transition-colors"
                                                    title={`${item.title} - ${item.time} to ${item.endTime}`}
                                                >
                                                    <div className="text-xs font-medium text-primary truncate">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-xs text-primary/70 truncate">
                                                        {item.time}
                                                    </div>
                                                </div>
                                            ))}
                                        {getScheduleForDate(date).length > 2 && (
                                            <div className="text-xs text-gray-500 text-center">
                                                +{getScheduleForDate(date).length - 2} more
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
