"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import WelcomeBanner from "@/components/patient/dashboard/WelcomeBanner";
import SummaryCard from "@/components/patient/dashboard/SummaryCard";
import QuickAction from "@/components/patient/dashboard/QuickAction";
import ActivityItem from "@/components/patient/dashboard/ActivityItem";

import {
    Calendar,
    Pill,
    CreditCard,
    FileText,
    MessageSquare,
    User,
} from "lucide-react";
import { formatVND } from "@/utils/currencyUtils";

type InvoiceStatus = "PAID" | "UNPAID" | "VOID" | "PARTIAL" | "OVERDUE";

interface Invoice {
    id: string;
    invoiceNumber: string;
    issuedAt: string;
    dueDate: string;
    totalAmount: number;
    paidAmount: number;
    status: InvoiceStatus;
}

type AppointmentStatus =
    | "PENDING"
    | "CONFIRMED"
    | "CANCELLED"
    | "DONE"
    | "NO_SHOW";

interface Appointment {
    id: string;
    startsAt: string;
    endsAt: string;
    status: AppointmentStatus;
    type: string;
    description: string | null;
    doctorDto: {
        id: string;
        staffDto: {
            userDto: {
                fullName: string;
            };
        };
    };
}

export default function DashboardPage() {
    const user = {
        name: "Patient",
    };

    const [pendingInvoices, setPendingInvoices] = useState<Invoice[]>([]);
    const [loadingInvoices, setLoadingInvoices] = useState(true);
    const [nextAppointment, setNextAppointment] = useState<Appointment | null>(
        null
    );
    const [loadingAppointments, setLoadingAppointments] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            const token = Cookies.get("token");
            if (!token) {
                setLoadingInvoices(false);
                return;
            }

            try {
                const response = await fetch("/api/invoices/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data: Invoice[] = await response.json();
                    const unpaid = data.filter(
                        (invoice) =>
                            invoice.status === "UNPAID" ||
                            invoice.status === "PARTIAL" ||
                            invoice.status === "OVERDUE"
                    );
                    setPendingInvoices(unpaid);
                }
            } catch (error) {
                console.error("Error fetching invoices:", error);
            } finally {
                setLoadingInvoices(false);
            }
        };

        fetchInvoices();
    }, []);

    useEffect(() => {
        const fetchAppointments = async () => {
            const token = Cookies.get("token");
            if (!token) {
                setLoadingAppointments(false);
                return;
            }

            try {
                const response = await fetch("/api/appointments/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data: Appointment[] = await response.json();
                    const confirmedAppointments = data.filter(
                        (appointment) => appointment.status === "CONFIRMED"
                    );

                    const sortedAppointments = confirmedAppointments.sort(
                        (a, b) =>
                            new Date(a.startsAt).getTime() -
                            new Date(b.startsAt).getTime()
                    );

                    const now = new Date();
                    const upcoming = sortedAppointments.find(
                        (apt) => new Date(apt.startsAt) > now
                    );

                    setNextAppointment(upcoming || null);
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoadingAppointments(false);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div className="min-h-screen mt-24">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <WelcomeBanner userName={user.name} />

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {loadingAppointments ? (
                        <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-center">
                            <span className="loading loading-spinner loading-md text-purple-600"></span>
                        </div>
                    ) : nextAppointment ? (
                        <SummaryCard
                            icon={<Calendar className="w-4 h-4 text-white" />}
                            badge="Upcoming"
                            badgeColor="purple"
                            title="Next Appointment"
                            main={
                                nextAppointment.doctorDto.staffDto.userDto
                                    .fullName
                            }
                            sub={new Date(
                                nextAppointment.startsAt
                            ).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                            })}
                            href="/appointments"
                        />
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-white" />
                                </div>
                                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                                    None
                                </span>
                            </div>
                            <h3 className="text-purple-900 mb-1 font-medium text-sm">
                                Next Appointment
                            </h3>
                            <p className="text-gray-700 mb-0.5 text-sm">
                                No upcoming appointments
                            </p>
                            <p className="text-gray-600 text-xs mb-3">
                                Book an appointment to see a doctor
                            </p>
                        </div>
                    )}

                    <SummaryCard
                        icon={<Pill className="w-4 h-4 text-white" />}
                        badge="Active"
                        badgeColor="green"
                        title="Active Prescriptions"
                        main="3 medications"
                        sub="Last updated: Dec 15, 2025"
                        href="/prescriptions"
                    />

                    {loadingInvoices ? (
                        <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-center">
                            <span className="loading loading-spinner loading-md text-purple-600"></span>
                        </div>
                    ) : pendingInvoices.length > 0 ? (
                        <SummaryCard
                            icon={<CreditCard className="w-4 h-4 text-white" />}
                            badge="Due"
                            badgeColor="orange"
                            title="Pending Payment"
                            main={formatVND(
                                pendingInvoices.reduce(
                                    (sum, inv) =>
                                        sum +
                                        (inv.totalAmount - inv.paidAmount),
                                    0
                                )
                            )}
                            sub={`${pendingInvoices.length} invoice${
                                pendingInvoices.length > 1 ? "s" : ""
                            } pending`}
                            href="/invoices"
                        />
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                                    <CreditCard className="w-4 h-4 text-white" />
                                </div>
                                <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-600">
                                    All Paid
                                </span>
                            </div>
                            <h3 className="text-purple-900 mb-1 font-medium text-sm">
                                Pending Payment
                            </h3>
                            <p className="text-gray-700 mb-0.5 text-sm">
                                No pending invoices
                            </p>
                            <p className="text-gray-600 text-xs mb-3">
                                All invoices are paid
                            </p>
                        </div>
                    )}
                </div>

                <div className="mb-8">
                    <h2 className="text-purple-900 text-lg font-semibold mb-4">
                        Quick Actions
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <QuickAction
                            href="/book-appointment"
                            icon={<Calendar className="w-4 h-4 text-white" />}
                            title="Book Appointment"
                            desc="Schedule a visit with a doctor"
                        />
                        <QuickAction
                            href="/records"
                            icon={<FileText className="w-4 h-4 text-white" />}
                            title="Medical Records"
                            desc="Access your health records"
                        />
                        <QuickAction
                            href="/chat"
                            icon={
                                <MessageSquare className="w-4 h-4 text-white" />
                            }
                            title="Chat with Staff"
                            desc="Ask questions or get support"
                        />
                        <QuickAction
                            href="/profile"
                            icon={<User className="w-4 h-4 text-white" />}
                            title="Update Profile"
                            desc="Manage your information"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-purple-900 text-lg font-semibold mb-4">
                        Recent Activity
                    </h2>

                    <div className="space-y-3">
                        <ActivityItem
                            icon={
                                <Calendar className="w-4 h-4 text-purple-600" />
                            }
                            title="Appointment scheduled"
                            desc="Dr. Emily Carter - Dec 22, 2025"
                            time="2 days ago"
                        />
                        <ActivityItem
                            icon={<Pill className="w-4 h-4 text-purple-600" />}
                            title="Prescription refilled"
                            desc="Lisinopril 10mg - 30 tablets"
                            time="4 days ago"
                        />
                        <ActivityItem
                            icon={
                                <FileText className="w-4 h-4 text-purple-600" />
                            }
                            title="Lab results available"
                            desc="Blood work - All normal"
                            time="1 week ago"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
