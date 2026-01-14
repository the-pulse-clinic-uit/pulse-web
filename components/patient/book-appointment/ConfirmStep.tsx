"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { Download, Printer, CheckCircle, Calendar, Clock } from "lucide-react";
import {
    downloadAppointmentPDF,
    printAppointmentPDF,
} from "./AppointmentConfirmationPDF";

interface ConfirmStepProps {
    doctorId: string | null;
    date: string;
    selectedSlot: { startsAt: string; endsAt: string; assignmentId: string } | null;
    description: string;
    onChangeDescription: (description: string) => void;
    onBack: () => void;
}

interface CreatedAppointmentData {
    appointmentId: string;
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    doctorName: string;
    departmentName: string;
    date: string;
    startTime: string;
    endTime: string;
    description?: string;
    status: string;
}

export default function ConfirmStep({
    doctorId,
    date,
    selectedSlot,
    description,
    onChangeDescription,
    onBack,
}: ConfirmStepProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdAppointment, setCreatedAppointment] = useState<CreatedAppointmentData | null>(null);

    const confirm = async () => {
        if (!doctorId || !selectedSlot) {
            setError("Please select a doctor and slot");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = Cookies.get("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const patientRes = await fetch("/api/patients/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!patientRes.ok) {
                throw new Error("Failed to fetch patient data");
            }

            const patientData = await patientRes.json();
            const patientId = patientData.id;

            const appointmentData = {
                startsAt: selectedSlot.startsAt,
                endsAt: selectedSlot.endsAt,
                status: "PENDING",
                type: "NORMAL",
                description: description || null,
                patientId,
                doctorId,
                shiftAssignmentId: selectedSlot.assignmentId,
            };

            const appointmentRes = await fetch("/api/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(appointmentData),
            });

            if (!appointmentRes.ok) {
                const errorData = await appointmentRes.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `Failed to book appointment (${appointmentRes.status})`
                );
            }

            const createdAppointmentRes = await appointmentRes.json();

            // Fetch doctor details for PDF
            const doctorRes = await fetch(`/api/doctors/${doctorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let doctorName = "Doctor";
            let departmentName = "Department";

            if (doctorRes.ok) {
                const doctorData = await doctorRes.json();
                doctorName = doctorData.staffDto?.userDto?.fullName || "Doctor";
                departmentName = doctorData.staffDto?.departmentDto?.name || "Department";
            }

            const startTime = new Date(selectedSlot.startsAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            });
            const endTime = new Date(selectedSlot.endsAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            });

            const formattedDate = new Date(date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            setCreatedAppointment({
                appointmentId: createdAppointmentRes.id,
                patientName: patientData.userDto?.fullName || "Patient",
                patientPhone: patientData.userDto?.phone || "",
                patientEmail: patientData.userDto?.email || "",
                doctorName,
                departmentName,
                date: formattedDate,
                startTime,
                endTime,
                description: description || undefined,
                status: "PENDING",
            });

            toast.success("Appointment booked successfully!");
            setShowSuccess(true);
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to book appointment";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        if (createdAppointment) {
            downloadAppointmentPDF(createdAppointment);
            toast.success("PDF downloaded successfully!");
        }
    };

    const handlePrintPDF = () => {
        if (createdAppointment) {
            printAppointmentPDF(createdAppointment);
        }
    };

    const handleGoToAppointments = () => {
        router.push("/appointments");
    };

    if (showSuccess && createdAppointment) {
        return (
            <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-green-100 p-3">
                            <CheckCircle className="w-16 h-16 text-green-600" />
                        </div>
                    </div>

                    <h3 className="font-bold text-2xl mb-2 text-green-600">
                        Appointment Booked Successfully!
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Your appointment has been scheduled. You can download or print the confirmation.
                    </p>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
                        <div className="space-y-4 text-left">
                            <div className="flex items-center gap-3 pb-3 border-b border-purple-200">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Appointment ID</p>
                                    <p className="font-mono font-semibold text-purple-700">
                                        #{createdAppointment.appointmentId.substring(0, 8).toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Doctor</p>
                                    <p className="font-semibold">{createdAppointment.doctorName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Department</p>
                                    <p className="font-semibold">{createdAppointment.departmentName}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-semibold">{createdAppointment.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Time</p>
                                        <p className="font-semibold">
                                            {createdAppointment.startTime} - {createdAppointment.endTime}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {createdAppointment.description && (
                                <div>
                                    <p className="text-sm text-gray-500">Notes</p>
                                    <p className="text-sm bg-white p-2 rounded mt-1">
                                        {createdAppointment.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                            <strong>Reminder:</strong> Please arrive 15 minutes before your scheduled time and bring a valid ID.
                        </p>
                    </div>

                    <div className="flex gap-3 justify-center mb-4">
                        <button
                            onClick={handleDownloadPDF}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Download PDF
                        </button>
                        <button
                            onClick={handlePrintPDF}
                            className="btn btn-outline flex items-center gap-2"
                        >
                            <Printer className="w-5 h-5" />
                            Print
                        </button>
                    </div>

                    <button
                        onClick={handleGoToAppointments}
                        className="btn btn-ghost mt-2"
                    >
                        View My Appointments
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
            <h3 className="text-purple-900 font-semibold mb-4">
                Confirm Appointment
            </h3>

            {error && (
                <div className="alert alert-error mb-4">
                    <span>{error}</span>
                </div>
            )}

            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Doctor ID</span>
                    <span className="font-medium">
                        #{doctorId?.substring(0, 8)}...
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{date}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Time Slot</span>
                    <span className="font-medium">
                        {selectedSlot
                            ? new Date(selectedSlot.startsAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">30 minutes</span>
                </div>
                {description && (
                    <div>
                        <span className="text-gray-600">Description</span>
                        <p className="mt-1 text-sm bg-gray-50 p-3 rounded-lg">
                            {description}
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <h4 className="text-purple-900 mb-3">Description (Optional)</h4>
                <textarea
                    value={description}
                    onChange={(e) => onChangeDescription(e.target.value)}
                    placeholder="Add any notes or special requests for your appointment..."
                    className="w-full border rounded-xl px-4 py-3 min-h-[100px] resize-none"
                    maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-2">
                    {description.length}/500 characters
                </p>
            </div>

            <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={onBack}
                    className="px-6 py-2 border rounded-full"
                    disabled={loading}
                >
                    Back
                </button>
                <button
                    onClick={confirm}
                    disabled={loading}
                    className="px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <span className="loading loading-spinner loading-sm mr-2"></span>
                            Booking...
                        </>
                    ) : (
                        "Confirm Booking"
                    )}
                </button>
            </div>
        </div>
    );
}
