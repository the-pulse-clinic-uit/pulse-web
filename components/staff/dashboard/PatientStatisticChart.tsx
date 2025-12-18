"use client";
import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Calendar } from "lucide-react";

const weeklyData = [
    { day: "Mon", date: "11/12", patients: 160 },
    { day: "Tue", date: "12/12", patients: 120 },
    { day: "Wed", date: "13/12", patients: 230 },
    { day: "Thu", date: "14/12", patients: 100 },
    { day: "Fri", date: "15/12", patients: 280 },
    { day: "Sat", date: "16/12", patients: 200 },
    { day: "Sun", date: "17/12", patients: 135 },
];

const monthlyData = [
    { day: "Week 1", date: "1-7", patients: 540 },
    { day: "Week 2", date: "8-14", patients: 620 },
    { day: "Week 3", date: "15-21", patients: 780 },
    { day: "Week 4", date: "22-30", patients: 450 },
];

const PatientStatisticChart = () => {
    const [filterType, setFilterType] = useState("week");

    const currentData = filterType === "week" ? weeklyData : monthlyData;

    const dateRangeText =
        filterType === "week" ? "Dec 11 - Dec 17, 2025" : "December 2025";

    return (
        <div className="card bg-base-100 shadow-sm p-6 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="card-title text-xl font-semibold">
                        Patient Statistic
                    </h2>
                    <p className="text-xs text-base-content/60 mt-1 font-medium">
                        {dateRangeText}
                    </p>
                </div>

                <div className="relative">
                    <select
                        className="select select-bordered select-sm w-full max-w-xs pl-9"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-base-content/70">
                        <Calendar size={16} />
                    </div>
                </div>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={currentData}
                        margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E5E7EB"
                        />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                            dx={-10}
                        />
                        <Tooltip
                            cursor={{ fill: "transparent" }}
                            contentStyle={{
                                backgroundColor: "oklch(var(--b1))",
                                border: "1px solid #E5E7EB",
                                borderRadius: "8px",
                            }}
                            labelFormatter={(label, payload) => {
                                if (payload && payload.length > 0) {
                                    return `${label} (${payload[0].payload.date})`;
                                }
                                return label;
                            }}
                        />
                        <Bar
                            dataKey="patients"
                            fill="var(--color-primary)"
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                            isAnimationActive={true}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PatientStatisticChart;
