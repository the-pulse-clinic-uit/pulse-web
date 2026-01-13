"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import PrescriptionCard from "./PrescriptionCard";

interface DrugDto {
    id: string;
    name: string;
    dosageForm: string;
    unit: string;
    strength: string;
    unitPrice: number;
}

interface PrescriptionDetail {
    id: string;
    dose: string;
    frequency: string;
    timing: string;
    instructions: string;
    quantity: number;
    unitPrice: number;
    itemTotalPrice: number;
    drugDto: DrugDto;
}

interface PatientDto {
    id: string;
    userDto: {
        id: string;
        fullName: string;
        email: string;
        phone: string;
    };
}

interface EncounterDto {
    id: string;
    type: string;
    diagnosis: string;
    notes: string;
    patientDto: PatientDto;
}

interface PrescriptionDto {
    id: string;
    totalPrice: number;
    notes: string;
    createdAt: string;
    status: "DRAFT" | "DISPENSED" | "CANCELLED";
    encounterDto: EncounterDto;
    prescriptionDetails: PrescriptionDetail[];
}

export default function PrescriptionList() {
    const [prescriptions, setPrescriptions] = useState<PrescriptionDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [doctorId, setDoctorId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<
        "DRAFT" | "DISPENSED" | "CANCELLED"
    >("DRAFT");

    const fetchDoctorInfo = useCallback(async () => {
        const token = Cookies.get("token");
        if (!token) return null;

        try {
            const response = await fetch("/api/doctors/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                return data.id;
            }
        } catch (error) {
            console.error("Error fetching doctor info:", error);
        }
        return null;
    }, []);

    const fetchPrescriptions = useCallback(async (docId: string) => {
        const token = Cookies.get("token");
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/prescriptions/doctor/${docId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data: PrescriptionDto[] = await response.json();
                setPrescriptions(data);
            } else {
                toast.error("Failed to fetch prescriptions");
            }
        } catch (error) {
            console.error("Error fetching prescriptions:", error);
            toast.error("Failed to fetch prescriptions");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const initFetch = async () => {
            const docId = await fetchDoctorInfo();
            if (docId) {
                setDoctorId(docId);
            } else {
                setLoading(false);
            }
        };
        initFetch();
    }, [fetchDoctorInfo]);

    useEffect(() => {
        if (doctorId) {
            fetchPrescriptions(doctorId);
        }
    }, [doctorId, fetchPrescriptions]);

    const draftPrescriptions = prescriptions.filter(
        (p) => p.status === "DRAFT"
    );
    const dispensedPrescriptions = prescriptions.filter(
        (p) => p.status === "DISPENSED"
    );
    const cancelledPrescriptions = prescriptions.filter(
        (p) => p.status === "CANCELLED"
    );

    const getFilteredPrescriptions = () => {
        switch (activeTab) {
            case "DRAFT":
                return draftPrescriptions;
            case "DISPENSED":
                return dispensedPrescriptions;
            case "CANCELLED":
                return cancelledPrescriptions;
            default:
                return [];
        }
    };

    const filteredPrescriptions = getFilteredPrescriptions();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab("DRAFT")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        activeTab === "DRAFT"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    Draft
                    <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                            activeTab === "DRAFT"
                                ? "bg-white/20 text-white"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                        {draftPrescriptions.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab("DISPENSED")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        activeTab === "DISPENSED"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    Dispensed
                    <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                            activeTab === "DISPENSED"
                                ? "bg-white/20 text-white"
                                : "bg-blue-100 text-blue-700"
                        }`}
                    >
                        {dispensedPrescriptions.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab("CANCELLED")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        activeTab === "CANCELLED"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    Cancelled
                    <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                            activeTab === "CANCELLED"
                                ? "bg-white/20 text-white"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {cancelledPrescriptions.length}
                    </span>
                </button>
            </div>

            <div className="space-y-4">
                {filteredPrescriptions.length > 0 ? (
                    filteredPrescriptions.map((prescription) => (
                        <PrescriptionCard
                            key={prescription.id}
                            id={prescription.id}
                            patientName={
                                prescription.encounterDto?.patientDto?.userDto
                                    ?.fullName || "Unknown Patient"
                            }
                            diagnosis={
                                prescription.encounterDto?.diagnosis || "N/A"
                            }
                            totalPrice={prescription.totalPrice}
                            date={prescription.createdAt}
                            status={prescription.status}
                            prescriptionDetails={
                                prescription.prescriptionDetails
                            }
                        />
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border">
                        <p className="text-gray-500">
                            No {activeTab.toLowerCase()} prescriptions found
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
