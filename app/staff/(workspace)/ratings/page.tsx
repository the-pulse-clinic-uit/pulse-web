"use client";

import { useState } from "react";
import StatCard from "@/components/staff/ratings/StatCard";
import RatingTrendChart from "@/components/staff/ratings/RatingTrendChart";
import StarDistributionChart from "@/components/staff/ratings/StarDistributionChart";
import RatingsTable from "@/components/staff/ratings/RatingsTable";
import Pagination from "@/components/ui/Pagination";
import Header from "@/components/staff/Header";

const mockRatingsData = [
    {
        patientName: "Nguyen Van Anh",
        service: "General Check-up",
        doctor: "Dr.Johnson",
        date: "15/05/2025",
        rating: 5,
        comment:
            "The doctor is very dedicated and highly professional. Excellent service!",
    },
    {
        patientName: "Nguyen Van Anh",
        service: "General Check-up",
        doctor: "Dr.Johnson",
        date: "15/05/2025",
        rating: 5,
        comment:
            "The doctor is very dedicated and highly professional. Excellent service!",
    },
    {
        patientName: "Nguyen Van Anh",
        service: "General Check-up",
        doctor: "Dr.Johnson",
        date: "15/05/2025",
        rating: 5,
        comment:
            "The doctor is very dedicated and highly professional. Excellent service!",
    },
    {
        patientName: "Nguyen Van Anh",
        service: "General Check-up",
        doctor: "Dr.Johnson",
        date: "15/05/2025",
        rating: 5,
        comment:
            "The doctor is very dedicated and highly professional. Excellent service!",
    },
    {
        patientName: "Nguyen Van Anh",
        service: "General Check-up",
        doctor: "Dr.Johnson",
        date: "15/05/2025",
        rating: 5,
        comment:
            "The doctor is very dedicated and highly professional. Excellent service!",
    },
    {
        patientName: "Nguyen Van Anh",
        service: "General Check-up",
        doctor: "Dr.Johnson",
        date: "15/05/2025",
        rating: 5,
        comment:
            "The doctor is very dedicated and highly professional. Excellent service!",
    },
];

export default function RatingsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header tabName="Ratings" userName="Nguyen Huu Duy" />
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="grid grid-cols-4 gap-6 mb-6">
                    <StatCard
                        title="Average Rating"
                        value={12}
                        change="12% from last week"
                        changeType="increase"
                    />
                    <StatCard
                        title="Total Number of Ratings"
                        value={8}
                        change="12% from last week"
                        changeType="increase"
                    />
                    <StatCard
                        title="Total Positive Ratings"
                        value={3}
                        change="12% from last week"
                        changeType="increase"
                    />
                    <StatCard
                        title="Trend"
                        value=""
                        change="12% from last week"
                        changeType="increase"
                        showIcon={true}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <RatingTrendChart />
                    <StarDistributionChart />
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                        >
                            <path
                                d="M8 4h8M4 4h1M8 10h8M4 10h1M8 16h8M4 16h1"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <circle
                                cx="5.5"
                                cy="4"
                                r="1.5"
                                fill="currentColor"
                            />
                            <circle
                                cx="5.5"
                                cy="10"
                                r="1.5"
                                fill="currentColor"
                            />
                            <circle
                                cx="5.5"
                                cy="16"
                                r="1.5"
                                fill="currentColor"
                            />
                        </svg>
                        Filter
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                        >
                            <path
                                d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>

                <RatingsTable data={mockRatingsData} />

                <div className="mt-6">
                    <Pagination
                        currentPage={1}
                        totalPages={7}
                        onPageChange={() => {}}
                    />
                </div>
            </div>
        </div>
    );
}
