"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import PatientReportsChart from "@/components/staff/reports/PatientReportsChart";

export default function GeneralReportsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get("token");

        if (!token) {
            router.push("/staff/login");
            return;
        }
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">General Reports</h1>
                <p className="text-gray-600 mt-2">
                    View patient registration and visit statistics
                </p>
            </div>

            <PatientReportsChart />
        </div>
    );
}
