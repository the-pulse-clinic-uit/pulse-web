"use client";

import RecordList from "@/components/patient/record/RecordList";

export default function RecordsPage() {
    const records = [
        {
            id: 1,
            title: "Blood Work Results",
            date: "Dec 15, 2025",
            doctor: "Dr. Emily Carter",
            type: "Lab Results",
            status: "Normal",
        },
        {
            id: 2,
            title: "Annual Physical Exam",
            date: "Nov 28, 2025",
            doctor: "Dr. Michael Johnson",
            type: "Physical Exam",
            status: "Complete",
        },
        {
            id: 3,
            title: "X-Ray - Chest",
            date: "Oct 10, 2025",
            doctor: "Dr. Sarah Wilson",
            type: "Imaging",
            status: "Normal",
        },
        {
            id: 4,
            title: "Prescription History",
            date: "Sep 22, 2025",
            doctor: "Dr. Emily Carter",
            type: "Prescription",
            status: "Active",
        },
    ];

    return (
        <div className="min-h-screen mt-8">
            <div className="max-w-7xl mx-auto px-4 py-4 pt-20">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold text-purple-900 mb-2">
                        Medical Records
                    </h1>
                    <p className="text-gray-600">
                        Access and manage your medical records and test results
                    </p>
                </div>

                <RecordList records={records} />
            </div>
        </div>
    );
}
