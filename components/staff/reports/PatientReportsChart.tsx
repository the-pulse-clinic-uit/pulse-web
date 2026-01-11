"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Calendar } from "lucide-react";

interface PatientReportData {
    reportDate: string;
    newRegistrations: number;
    followUpVisits: number;
    totalPatients: number;
}

export default function PatientReportsChart() {
    const [reportData, setReportData] = useState<PatientReportData[]>([]);
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
                `/api/reports/patients/range?startDate=${startDate}&endDate=${endDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data: PatientReportData[] = await response.json();
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

    const totalNewRegistrations = reportData.reduce(
        (sum, item) => sum + item.newRegistrations,
        0
    );
    const totalFollowUpVisits = reportData.reduce(
        (sum, item) => sum + item.followUpVisits,
        0
    );
    const totalPatientVisits = reportData.reduce(
        (sum, item) => sum + item.totalPatients,
        0
    );

    const chartData = reportData.map((item) => ({
        date: new Date(item.reportDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
        "New Registrations": item.newRegistrations,
        "Follow-up Visits": item.followUpVisits,
        "Total Patients": item.totalPatients,
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-primary text-primary-content shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-lg">
                            Total New Registrations
                        </h2>
                        <p className="text-4xl font-bold">
                            {totalNewRegistrations}
                        </p>
                        <p className="text-sm opacity-80">
                            In selected date range
                        </p>
                    </div>
                </div>

                <div className="card bg-secondary text-secondary-content shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-lg">
                            Total Follow-up Visits
                        </h2>
                        <p className="text-4xl font-bold">
                            {totalFollowUpVisits}
                        </p>
                        <p className="text-sm opacity-80">
                            In selected date range
                        </p>
                    </div>
                </div>

                <div className="card bg-accent text-accent-content shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-lg">
                            Total Patient Visits
                        </h2>
                        <p className="text-4xl font-bold">
                            {totalPatientVisits}
                        </p>
                        <p className="text-sm opacity-80">
                            In selected date range
                        </p>
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Patient Trends Over Time</h2>
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
                                    dataKey="New Registrations"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Follow-up Visits"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Total Patients"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">
                        Daily Patient Activity Comparison
                    </h2>
                    <div className="w-full h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
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
                                <Bar
                                    dataKey="New Registrations"
                                    fill="#8b5cf6"
                                />
                                <Bar
                                    dataKey="Follow-up Visits"
                                    fill="#10b981"
                                />
                                <Bar dataKey="Total Patients" fill="#3b82f6" />
                            </BarChart>
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
                                    <th>New Registrations</th>
                                    <th>Follow-up Visits</th>
                                    <th>Total Patients</th>
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
                                            {item.newRegistrations}
                                        </td>
                                        <td className="font-semibold">
                                            {item.followUpVisits}
                                        </td>
                                        <td className="font-semibold">
                                            {item.totalPatients}
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
