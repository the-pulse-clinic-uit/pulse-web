"use client";

import { Calendar, Grid3X3 } from "lucide-react";

interface Props {
    currentView: "week" | "month";
    onViewChange: (view: "week" | "month") => void;
}

export default function ScheduleHeader({ currentView, onViewChange }: Props) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Schedule
                </h1>
                <p className="text-gray-600">Manage your calendar</p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onViewChange("week")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        currentView === "week"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <Calendar className="w-4 h-4" />
                    Week View
                </button>

                <button
                    onClick={() => onViewChange("month")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        currentView === "month"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <Grid3X3 className="w-4 h-4" />
                    Month View
                </button>
            </div>
        </div>
    );
}
