"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import PatientReportsChart from "@/components/staff/reports/PatientReportsChart";
import AppointmentReportsChart from "@/components/staff/reports/AppointmentReportsChart";
import { Users, Calendar } from "lucide-react";

type ReportSection = "patients" | "appointments";

export default function GeneralReportsPage() {
    const router = useRouter();
    const [activeSection, setActiveSection] =
        useState<ReportSection>("patients");

    useEffect(() => {
        const token = Cookies.get("token");

        if (!token) {
            router.push("/staff/login");
            return;
        }
    }, [router]);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">General Reports</h1>
                <p className="text-gray-600 mt-2">
                    View comprehensive reports and statistics
                </p>
            </div>

            <div className="tabs tabs-boxed mb-6 bg-base-200 p-1">
                <button
                    className={`tab gap-2 ${
                        activeSection === "patients" ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveSection("patients")}
                >
                    <Users className="w-4 h-4" />
                    Patient Reports
                </button>
                <button
                    className={`tab gap-2 ${
                        activeSection === "appointments" ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveSection("appointments")}
                >
                    <Calendar className="w-4 h-4" />
                    Appointment Reports
                </button>
            </div>

            {activeSection === "patients" && <PatientReportsChart />}
            {activeSection === "appointments" && <AppointmentReportsChart />}
        </div>
    );
}
