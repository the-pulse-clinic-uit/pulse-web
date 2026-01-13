"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
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

interface PatientReport {
    reportDate: string;
    newRegistrations: number;
    followUpVisits: number;
    totalPatients: number;
}

interface ChartDataPoint {
    day: string;
    date: string;
    patients: number;
}

const PatientStatisticChart = () => {
    const [filterType, setFilterType] = useState("week");
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ start: "", end: "" });

    useEffect(() => {
        fetchPatientData();
    }, [filterType]);

    const getDateRange = (type: string) => {
        const today = new Date();
        let startDate: Date;
        let endDate: Date = today;

        if (type === "week") {
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 6);
        } else {
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        }

        return {
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
        };
    };

    const fetchPatientData = async () => {
        setLoading(true);
        try {
            const token = Cookies.get("token");
            if (!token) {
                console.error("No token found");
                setLoading(false);
                return;
            }

            const { startDate, endDate } = getDateRange(filterType);
            console.log("Fetching patient data for range:", { startDate, endDate, filterType });
            setDateRange({ start: startDate, end: endDate });

            const response = await fetch(
                `/api/reports/patients/range?startDate=${startDate}&endDate=${endDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error:", response.status, errorText);
                throw new Error(`Failed to fetch patient data: ${response.status}`);
            }

            const data: PatientReport[] = await response.json();
            console.log("Received patient data:", data);

            if (!Array.isArray(data)) {
                console.error("Invalid data format - expected array:", data);
                setChartData([]);
                return;
            }

            const formattedData = formatChartData(data, filterType);
            console.log("Formatted chart data:", formattedData);
            setChartData(formattedData);
        } catch (error) {
            console.error("Error fetching patient statistics:", error);
            setChartData([]);
        } finally {
            setLoading(false);
        }
    };

    const formatChartData = (
        data: PatientReport[],
        type: string
    ): ChartDataPoint[] => {
        console.log("Formatting chart data:", data);

        if (!data || data.length === 0) {
            return [];
        }

        const validData = data.filter((item) => {
            if (!item || !item.reportDate) {
                console.warn("Invalid item found:", item);
                return false;
            }
            return true;
        });

        if (validData.length === 0) {
            console.warn("No valid data after filtering");
            return [];
        }

        if (type === "week") {
            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            return validData.map((item) => {
                try {
                    const dateStr = item.reportDate.includes('T') ? item.reportDate : `${item.reportDate}T00:00:00`;
                    const date = new Date(dateStr);

                    if (isNaN(date.getTime())) {
                        console.error("Invalid date:", item.reportDate);
                        return {
                            day: "Unknown",
                            date: "N/A",
                            patients: item.totalPatients || 0,
                        };
                    }

                    const dayName = dayNames[date.getDay()];
                    const shortDate = `${date.getMonth() + 1}/${date.getDate()}`;

                    console.log("Week item:", { item, date, dayName, shortDate, totalPatients: item.totalPatients });

                    return {
                        day: dayName,
                        date: shortDate,
                        patients: item.totalPatients || 0,
                    };
                } catch (error) {
                    console.error("Error formatting item:", item, error);
                    return {
                        day: "Unknown",
                        date: "N/A",
                        patients: item.totalPatients || 0,
                    };
                }
            });
        } else {
            const weeklyData: { [key: string]: number } = {};
            validData.forEach((item) => {
                try {
                    const dateStr = item.reportDate.includes('T') ? item.reportDate : `${item.reportDate}T00:00:00`;
                    const date = new Date(dateStr);

                    if (isNaN(date.getTime())) {
                        console.error("Invalid date in month view:", item.reportDate);
                        return;
                    }

                    const weekNum = Math.ceil(date.getDate() / 7);
                    const weekKey = `Week ${weekNum}`;
                    weeklyData[weekKey] = (weeklyData[weekKey] || 0) + (item.totalPatients || 0);
                } catch (error) {
                    console.error("Error formatting month item:", item, error);
                }
            });

            return Object.entries(weeklyData).map(([week, count]) => ({
                day: week,
                date: week.replace("Week ", ""),
                patients: count || 0,
            }));
        }
    };

    const currentData = chartData;

    const formatDateRange = () => {
        if (!dateRange.start || !dateRange.end) return "";

        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);

        if (filterType === "week") {
            return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
        } else {
            return end.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        }
    };

    const dateRangeText = formatDateRange();

    return (
        <div className="card bg-base-100 shadow-sm p-6 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="card-title text-xl font-semibold">
                        Patient Statistic
                    </h2>
                    {loading ? (
                        <div className="h-5 w-40 bg-gray-200 animate-pulse rounded mt-1"></div>
                    ) : (
                        <p className="text-xs text-base-content/60 mt-1 font-medium">
                            {dateRangeText}
                        </p>
                    )}
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
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : currentData.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>No patient data available for this period</p>
                    </div>
                ) : (
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
                                allowDecimals={false}
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
                )}
            </div>
        </div>
    );
};

export default PatientStatisticChart;
