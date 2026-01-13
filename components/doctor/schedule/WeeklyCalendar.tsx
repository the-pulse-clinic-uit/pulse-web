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
    time: string;
    endTime: string;
    title: string;
    room: string;
    type: string;
    department: string;
    role: string;
}

interface ScheduleData {
    [key: string]: ScheduleItem[];
}

const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export default function WeeklyCalendar() {
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(today);
        monday.setDate(today.getDate() + diff);
        monday.setHours(0, 0, 0, 0);
        return monday;
    });
    const [scheduleData, setScheduleData] = useState<ScheduleData>({});
    const [loading, setLoading] = useState(true);
    const [doctorId, setDoctorId] = useState<string | null>(null);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);

    const formatDateForAPI = (date: Date): string => {
        return date.toISOString().split("T")[0];
    };

    const getWeekEndDate = (startDate: Date): Date => {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return endDate;
    };

    const formatTime = (dateTimeString: string): string => {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const getDayName = (dateString: string): string => {
        const date = new Date(dateString);
        const dayIndex = date.getDay();
        return dayIndex === 0 ? "Sunday" : weekDays[dayIndex - 1];
    };

    const generateTimeSlots = (assignments: ShiftAssignment[]): string[] => {
        const times = new Set<string>();

        assignments.forEach((assignment) => {
            const startTime = formatTime(assignment.shiftDto.startTime);
            times.add(startTime);
        });

        if (times.size === 0) {
            return [
                "8:00 AM",
                "9:00 AM",
                "10:00 AM",
                "11:00 AM",
                "12:00 PM",
                "1:00 PM",
                "2:00 PM",
                "3:00 PM",
                "4:00 PM",
                "5:00 PM",
            ];
        }

        return Array.from(times).sort((a, b) => {
            const dateA = new Date(`1970/01/01 ${a}`);
            const dateB = new Date(`1970/01/01 ${b}`);
            return dateA.getTime() - dateB.getTime();
        });
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
                const startDate = formatDateForAPI(currentWeekStart);
                const endDate = formatDateForAPI(getWeekEndDate(currentWeekStart));

                const response = await fetch(
                    `/api/shifts/assignments/by_doctor/${docId}?startDate=${startDate}&endDate=${endDate}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.ok) {
                    const assignments: ShiftAssignment[] = await response.json();

                    const slots = generateTimeSlots(assignments);
                    setTimeSlots(slots);

                    const formattedSchedule: ScheduleData = {};
                    weekDays.forEach((day) => {
                        formattedSchedule[day] = [];
                    });

                    assignments.forEach((assignment) => {
                        if (assignment.status === "ACTIVE") {
                            const dayName = getDayName(assignment.dutyDate);
                            const scheduleItem: ScheduleItem = {
                                id: assignment.id,
                                time: formatTime(assignment.shiftDto.startTime),
                                endTime: formatTime(assignment.shiftDto.endTime),
                                title: assignment.shiftDto.name,
                                room: assignment.roomDto
                                    ? `Room ${assignment.roomDto.roomNumber}`
                                    : assignment.shiftDto.defaultRoomDto
                                    ? `Room ${assignment.shiftDto.defaultRoomDto.roomNumber}`
                                    : "No Room",
                                type: assignment.shiftDto.kind.toLowerCase(),
                                department:
                                    assignment.shiftDto.departmentDto?.name || "N/A",
                                role: assignment.roleInShift,
                            };
                            formattedSchedule[dayName].push(scheduleItem);
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
        [currentWeekStart]
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

    const goToPreviousWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(currentWeekStart.getDate() - 7);
        setCurrentWeekStart(newDate);
    };

    const goToNextWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(currentWeekStart.getDate() + 7);
        setCurrentWeekStart(newDate);
    };

    const goToCurrentWeek = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(today);
        monday.setDate(today.getDate() + diff);
        monday.setHours(0, 0, 0, 0);
        setCurrentWeekStart(monday);
    };

    const getWeekDateRange = (): string => {
        const endDate = getWeekEndDate(currentWeekStart);
        const startStr = currentWeekStart.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
        const endStr = endDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
        return `${startStr} - ${endStr}`;
    };

    const getDayDate = (dayIndex: number): string => {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + dayIndex);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
        });
    };

    const getScheduleForTimeAndDay = (
        time: string,
        day: string
    ): ScheduleItem | undefined => {
        const daySchedule = scheduleData[day] || [];
        return daySchedule.find((item) => item.time === time);
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

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    Weekly Calendar
                </h2>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goToPreviousWeek}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="text-sm font-medium text-gray-700 min-w-[180px] text-center">
                            {getWeekDateRange()}
                        </span>
                        <button
                            onClick={goToNextWeek}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                    <button
                        onClick={goToCurrentWeek}
                        className="btn btn-primary btn-sm"
                    >
                        Today
                    </button>
                </div>
            </div>

            <div className="w-full">
                <div className="grid grid-cols-8 gap-2 mb-4">
                    <div className="p-3 text-center font-medium text-gray-500 text-sm">
                        Time
                    </div>
                    {weekDays.map((day, index) => (
                        <div
                            key={day}
                            className="p-3 text-center font-semibold text-gray-700 bg-gray-50 rounded-lg"
                        >
                            <div>{day}</div>
                            <div className="text-xs text-gray-500 mt-1">
                                {getDayDate(index)}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    {timeSlots.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No shifts scheduled for this week
                        </div>
                    ) : (
                        timeSlots.map((time) => (
                            <div key={time} className="grid grid-cols-8 gap-2">
                                <div className="p-3 text-sm text-gray-600 font-medium bg-gray-50 rounded-lg text-center">
                                    {time}
                                </div>
                                {weekDays.map((day) => {
                                    const schedule = getScheduleForTimeAndDay(time, day);
                                    return (
                                        <div
                                            key={`${day}-${time}`}
                                            className="min-h-[80px]"
                                        >
                                            {schedule ? (
                                                <div className="bg-primary/10 border-2 border-primary/20 rounded-lg p-3 h-full hover:bg-primary/20 transition-colors cursor-pointer">
                                                    <div className="font-medium text-primary text-sm">
                                                        {schedule.title}
                                                    </div>
                                                    <div className="text-primary/80 text-xs mt-1">
                                                        {schedule.room}
                                                    </div>
                                                    <div className="text-primary/80 text-xs mt-1">
                                                        {schedule.time} - {schedule.endTime}
                                                    </div>
                                                    <div className="text-primary/80 text-xs mt-1 capitalize">
                                                        {schedule.role.toLowerCase()}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center">
                                                    <span className="text-gray-400 text-xs">
                                                        -
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}