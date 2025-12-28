"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

interface ConfirmStepProps {
    doctorId: string | null;
    date: string;
    time: string;
    description: string;
    onBack: () => void;
}

export default function ConfirmStep({
    doctorId,
    date,
    time,
    description,
    onBack,
}: ConfirmStepProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const parseTimeToDateTime = (date: string, time: string): string => {
        const [timePart, period] = time.split(" ");
        const [hoursStr, minutesStr] = timePart.split(":");
        let hours = Number(hoursStr);
        const minutes = Number(minutesStr);

        if (period === "PM" && hours !== 12) {
            hours += 12;
        } else if (period === "AM" && hours === 12) {
            hours = 0;
        }

        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:00`;
        return `${date}T${formattedTime}`;
    };

    const addMinutes = (dateTime: string, minutes: number): string => {
        const dt = new Date(dateTime);
        dt.setMinutes(dt.getMinutes() + minutes);
        return dt.toISOString().slice(0, 19);
    };

    const confirm = async () => {
        if (!doctorId) {
            setError("Please select a doctor");
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

            const startsAt = parseTimeToDateTime(date, time);
            const endsAt = addMinutes(startsAt, 30);

            const appointmentData = {
                startsAt,
                endsAt,
                status: "PENDING",
                type: "NORMAL",
                description: description || null,
                patientId,
                doctorId,
                shiftAssignmentId: null,
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

            toast.success("Appointment booked successfully!");
            router.push("/appointments");
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
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{time}</span>
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
