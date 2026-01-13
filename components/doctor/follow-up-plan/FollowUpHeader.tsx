"use client";

import { useState, useRef, useEffect } from "react";
import {
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Search,
    Plus,
} from "lucide-react";

interface Props {
    onSearch?: (query: string) => void;
    onDateChange?: (date: Date) => void;
    onCreateClick?: () => void;
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

export default function FollowUpHeader({
    onSearch,
    onDateChange,
    onCreateClick,
}: Props) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [searchQuery, setSearchQuery] = useState("");
    const calendarRef = useRef<HTMLDivElement>(null);

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
        onDateChange?.(newDate);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        onSearch?.(value);
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

    const formatDisplayDate = () => {
        return selectedDate.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
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
                <h1 className="text-2xl font-semibold text-gray-900">
                    Follow Up Plan
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onCreateClick}
                    className="btn btn-primary gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Create Plan
                </button>

                <div className="relative" ref={calendarRef}>
                    <button
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border hover:border-blue-300 transition-colors"
                    >
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                            {formatDisplayDate()}
                        </span>
                        <ChevronDown
                            className={`w-4 h-4 text-gray-500 transition-transform ${
                                isCalendarOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

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
            </div>
        </div>
    );
}
