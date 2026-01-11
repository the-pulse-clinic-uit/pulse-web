"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { DollarSign } from "lucide-react";

interface RevenueReportData {
    startDate: string;
    endDate: string;
    totalRevenue: number;
    paidAmount: number;
    outstandingDebt: number;
    revenueByDepartment: Record<string, number>;
    revenueByDoctor: Record<string, number>;
}

export default function RevenueReportsChart() {
    const [reportData, setReportData] = useState<RevenueReportData | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(() => new Date().getFullYear());
    const [month, setMonth] = useState(() => new Date().getMonth() + 1);

    const fetchReportData = async () => {
        const token = Cookies.get("token");
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch(
                `/api/reports/revenue/monthly?year=${year}&month=${month}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data: RevenueReportData = await response.json();
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

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const departmentChartData = reportData
        ? Object.entries(reportData.revenueByDepartment).map(
              ([name, value]) => ({
                  name,
                  revenue: value,
              })
          )
        : [];

    const doctorChartData = reportData
        ? Object.entries(reportData.revenueByDoctor).map(([name, value]) => ({
              name,
              revenue: value,
          }))
        : [];

    const collectionRate = reportData
        ? reportData.totalRevenue > 0
            ? (reportData.paidAmount / reportData.totalRevenue) * 100
            : 0
        : 0;

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
                        <DollarSign className="w-5 h-5" />
                        Period Selection
                    </h2>
                    <div className="flex gap-4 items-end">
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text">Year</span>
                            </label>
                            <input
                                type="number"
                                value={year}
                                onChange={(e) =>
                                    setYear(parseInt(e.target.value))
                                }
                                className="input input-bordered w-full"
                                min="2000"
                                max="2100"
                            />
                        </div>
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text">Month</span>
                            </label>
                            <select
                                value={month}
                                onChange={(e) =>
                                    setMonth(parseInt(e.target.value))
                                }
                                className="select select-bordered w-full"
                            >
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
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

            {reportData && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="card bg-primary text-primary-content shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-sm">
                                    Total Revenue
                                </h2>
                                <p className="text-3xl font-bold">
                                    {formatCurrency(reportData.totalRevenue)}
                                </p>
                            </div>
                        </div>

                        <div className="card bg-success text-success-content shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-sm">
                                    Paid Amount
                                </h2>
                                <p className="text-3xl font-bold">
                                    {formatCurrency(reportData.paidAmount)}
                                </p>
                            </div>
                        </div>

                        <div className="card bg-error text-error-content shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-sm">
                                    Outstanding Debt
                                </h2>
                                <p className="text-3xl font-bold">
                                    {formatCurrency(reportData.outstandingDebt)}
                                </p>
                            </div>
                        </div>

                        <div className="card bg-info text-info-content shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-sm">
                                    Collection Rate
                                </h2>
                                <p className="text-3xl font-bold">
                                    {collectionRate.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {departmentChartData.length > 0 && (
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">
                                    Revenue by Department
                                </h2>
                                <div className="w-full h-96">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={departmentChartData}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 80,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="name"
                                                angle={-45}
                                                textAnchor="end"
                                                height={100}
                                            />
                                            <YAxis
                                                tickFormatter={(value) =>
                                                    `${(value / 1000000).toFixed(
                                                        0
                                                    )}M`
                                                }
                                            />
                                            <Tooltip
                                                formatter={(value: number) =>
                                                    formatCurrency(value)
                                                }
                                            />
                                            <Legend />
                                            <Bar
                                                dataKey="revenue"
                                                fill="#8b5cf6"
                                                name="Revenue"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {doctorChartData.length > 0 && (
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">
                                    Revenue by Doctor
                                </h2>
                                <div className="w-full h-96">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={doctorChartData}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 80,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="name"
                                                angle={-45}
                                                textAnchor="end"
                                                height={100}
                                            />
                                            <YAxis
                                                tickFormatter={(value) =>
                                                    `${(value / 1000000).toFixed(
                                                        0
                                                    )}M`
                                                }
                                            />
                                            <Tooltip
                                                formatter={(value: number) =>
                                                    formatCurrency(value)
                                                }
                                            />
                                            <Legend />
                                            <Bar
                                                dataKey="revenue"
                                                fill="#10b981"
                                                name="Revenue"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Summary Details</h2>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <tbody>
                                        <tr>
                                            <td className="font-semibold">
                                                Period
                                            </td>
                                            <td>
                                                {new Date(
                                                    reportData.startDate
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}{" "}
                                                -{" "}
                                                {new Date(
                                                    reportData.endDate
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">
                                                Total Revenue
                                            </td>
                                            <td className="text-primary font-bold">
                                                {formatCurrency(
                                                    reportData.totalRevenue
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">
                                                Paid Amount
                                            </td>
                                            <td className="text-success font-bold">
                                                {formatCurrency(
                                                    reportData.paidAmount
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">
                                                Outstanding Debt
                                            </td>
                                            <td className="text-error font-bold">
                                                {formatCurrency(
                                                    reportData.outstandingDebt
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">
                                                Collection Rate
                                            </td>
                                            <td className="text-info font-bold">
                                                {collectionRate.toFixed(2)}%
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
