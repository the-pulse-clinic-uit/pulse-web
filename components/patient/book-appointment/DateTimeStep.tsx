"use client";
import { useState, useEffect } from "react";
import { Calendar, Clock, Building2 } from "lucide-react";
import Cookies from "js-cookie";

const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
];

interface DateTimeStepProps {
    date: string;
    time: string;
    description: string;
    departmentId: string | null;
    onChangeDate: (date: string) => void;
    onChangeTime: (time: string) => void;
    onChangeDescription: (description: string) => void;
    onChangeDepartment: (id: string) => void;
    onNext: () => void;
}

export default function DateTimeStep({
    date,
    time,
    description,
    departmentId,
    onChangeDate,
    onChangeTime,
    onChangeDescription,
    onChangeDepartment,
    onNext,
}: DateTimeStepProps) {
    const [departments, setDepartments] = useState<
        { id: string; name: string }[]
    >([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const token = Cookies.get("token");
                if (!token) throw new Error("No token found");

                const res = await fetch("/api/departments", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch departments");
                }

                const data = await res.json();
                setDepartments(data);
            } catch (error) {
                console.error("Error fetching departments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    return (
        <>
            <div className="bg-white p-6 rounded-2xl shadow mb-6">
                <h3 className="flex items-center gap-2 text-purple-900 mb-3">
                    <Building2 size={18} /> Select Department
                </h3>
                {loading ? (
                    <div className="flex justify-center py-4">
                        <span className="loading loading-spinner loading-md text-purple-500"></span>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {departments.map((dept) => (
                            <button
                                key={dept.id}
                                onClick={() => onChangeDepartment(dept.id)}
                                className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors
                                    ${
                                        departmentId === dept.id
                                            ? "bg-purple-500 text-white"
                                            : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                                    }`}
                            >
                                {dept.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="flex items-center gap-2 text-purple-900 mb-3">
                        <Calendar size={18} /> Select Date
                    </h3>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => onChangeDate(e.target.value)}
                        className="w-full border rounded-full px-4 py-2"
                    />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="flex items-center gap-2 text-purple-900 mb-3">
                        <Clock size={18} /> Select Time
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((t) => (
                            <button
                                key={t}
                                onClick={() => onChangeTime(t)}
                                className={`py-2 rounded-full text-sm
                ${
                    time === t
                        ? "bg-purple-500 text-white"
                        : "bg-purple-50 text-purple-600"
                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow mb-8">
                <h3 className="text-purple-900 mb-3">Description (Optional)</h3>
                <textarea
                    value={description}
                    onChange={(e) => onChangeDescription(e.target.value)}
                    placeholder="Add any notes or special requests for your appointment..."
                    className="w-full border rounded-xl px-4 py-3 min-h-[100px] resize-none"
                    maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-2">
                    {description.length}/500 characters
                </p>
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={onNext}
                    disabled={!date || !time || !departmentId}
                    className={`px-6 py-2 rounded-full
          ${
              date && time && departmentId
                  ? "bg-purple-500 text-white"
                  : "bg-gray-300 text-gray-500"
          }`}
                >
                    Continue
                </button>
            </div>
        </>
    );
}
