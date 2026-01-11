"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Calendar } from "lucide-react";

interface AppointmentReportData {
    reportDate: string;
    totalAppointments: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    noShow: number;
    byDepartment: Record<string, number>;
    byDoctor: Record<string, number>;
}

const COLORS = ["#8b5cf6", "#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

export default function AppointmentReportsChart() {
    const [reportData, setReportData] = useState<AppointmentReportData[]>([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toISOString().split("T")[0];
    });
    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });

    const fetchReportData = async () => {
        const token = Cookies.get("token");
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch(
                `/api/reports/appointments/range?startDate=${startDate}&endDate=${endDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data: AppointmentReportData[] = await response.json();
                setReportData(data);
            } else {
                console.error("Failed to fetch report data");
            }
        } catch (error) {
            console.error("Error fetching report data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, []);

    const handleSearch = () => {
        fetchReportData();
    };

    const totalAppointments = reportData.reduce(
        (sum, item) => sum + item.totalAppointments,
        0
    );
    const totalConfirmed = reportData.reduce(
        (sum, item) => sum + item.confirmed,
        0
    );
    const totalCompleted = reportData.reduce(
        (sum, item) => sum + item.completed,
        0
    );
    const totalCancelled = reportData.reduce(
        (sum, item) => sum + item.cancelled,
        0
    );
    const totalNoShow = reportData.reduce((sum, item) => sum + item.noShow, 0);

    const chartData = reportData.map((item) => ({
        date: new Date(item.reportDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
        Total: item.totalAppointments,
        Confirmed: item.confirmed,
        Completed: item.completed,
        Cancelled: item.cancelled,
        "No Show": item.noShow,
    }));

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">
                        <Calendar className="w-5 h-5" />
                        Date Range
                    </h2>
                    <div className="flex gap-4 items-end">
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text">Start Date</span>
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text">End Date</span>
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="btn btn-primary"
                        >
                            Apply Filter
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="card bg-base-300 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-sm">
                            Total Appointments
                        </h2>
                        <p className="text-3xl font-bold">
                            {totalAppointments}
                        </p>
                    </div>
                </div>

                <div className="card bg-info text-info-content shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-sm">Confirmed</h2>
                        <p className="text-3xl font-bold">{totalConfirmed}</p>
                    </div>
                </div>

                <div className="card bg-success text-success-content shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-sm">Completed</h2>
                        <p className="text-3xl font-bold">{totalCompleted}</p>
                    </div>
                </div>

                <div className="card bg-warning text-warning-content shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-sm">Cancelled</h2>
                        <p className="text-3xl font-bold">{totalCancelled}</p>
                    </div>
                </div>

                <div className="card bg-error text-error-content shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-sm">No Show</h2>
                        <p className="text-3xl font-bold">{totalNoShow}</p>
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Appointment Trends Over Time</h2>
                    <div className="w-full h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="Total"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Completed"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Cancelled"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="No Show"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Detailed Data</h2>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Confirmed</th>
                                    <th>Completed</th>
                                    <th>Cancelled</th>
                                    <th>No Show</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            {new Date(
                                                item.reportDate
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </td>
                                        <td className="font-semibold">
                                            {item.totalAppointments}
                                        </td>
                                        <td className="text-info font-semibold">
                                            {item.confirmed}
                                        </td>
                                        <td className="text-success font-semibold">
                                            {item.completed}
                                        </td>
                                        <td className="text-warning font-semibold">
                                            {item.cancelled}
                                        </td>
                                        <td className="text-error font-semibold">
                                            {item.noShow}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
