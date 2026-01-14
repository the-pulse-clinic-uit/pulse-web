"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import StepIndicator from "@/components/patient/book-appointment/StepIndicator";
import DepartmentStep from "@/components/patient/book-appointment/DepartmentStep";
import DateStep from "@/components/patient/book-appointment/DateStep";
import DoctorStep from "@/components/patient/book-appointment/DoctorStep";
import SlotStep from "@/components/patient/book-appointment/SlotStep";
import ConfirmStep from "@/components/patient/book-appointment/ConfirmStep";

interface Appointment {
  id: string;
  startsAt: string;
  endsAt: string;
  status: string;
  type: string;
  description: string | null;
  doctorDto: {
    id: string;
    departmentDto: {
      id: string;
    } | null;
  };
}

export default function RescheduleAppointmentPage() {
  const { appointmentId } = useParams();
  const [step, setStep] = useState(1);
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    startsAt: string;
    endsAt: string;
    assignmentId: string;
  } | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = Cookies.get("token");
        const res = await fetch(`/api/appointments/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const appointment: Appointment = await res.json();
          setDepartmentId(appointment.doctorDto.departmentDto?.id || null);
          setDate(new Date(appointment.startsAt).toISOString().split("T")[0]);
          setDoctorId(appointment.doctorDto.id);
          setDescription(appointment.description || "");
        }
      } catch (error) {
        console.error("Error fetching appointment:", error);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-purple-500"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6 pb-12">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-semibold text-purple-900">
          Reschedule Appointment
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Update your appointment details
        </p>
      </div>

      <StepIndicator step={step} />

      {step === 1 && (
        <DepartmentStep
          selectedDepartment={departmentId}
          onSelect={setDepartmentId}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <DateStep
          date={date}
          onChangeDate={setDate}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <DoctorStep
          selectedDoctor={doctorId}
          departmentId={departmentId}
          onSelect={setDoctorId}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <SlotStep
          doctorId={doctorId}
          date={date}
          selectedSlot={selectedSlot}
          onSelectSlot={setSelectedSlot}
          onBack={() => setStep(3)}
          onNext={() => setStep(5)}
        />
      )}

      {step === 5 && (
        <RescheduleConfirmStep
          appointmentId={appointmentId as string}
          doctorId={doctorId}
          date={date}
          selectedSlot={selectedSlot}
          description={description}
          onChangeDescription={setDescription}
          onBack={() => setStep(4)}
        />
      )}
    </div>
  );
}

function RescheduleConfirmStep({
  appointmentId,
  doctorId,
  date,
  selectedSlot,
  description,
  onChangeDescription,
  onBack,
}: {
  appointmentId: string;
  doctorId: string | null;
  date: string;
  selectedSlot: { startsAt: string; endsAt: string; assignmentId: string } | null;
  description: string;
  onChangeDescription: (description: string) => void;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReschedule = async () => {
    if (!selectedSlot) {
      setError("Please select a new slot");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = Cookies.get("token");
      const newEndTime = new Date(new Date(selectedSlot.startsAt).getTime() + 30 * 60 * 1000).toISOString();
      const res = await fetch(`/api/appointments/${appointmentId}/reschedule?newStartTime=${encodeURIComponent(selectedSlot.startsAt)}&newEndTime=${encodeURIComponent(newEndTime)}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Appointment rescheduled successfully!");
        window.location.href = "/appointments";
      } else {
        setError("Failed to reschedule appointment");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h3 className="text-purple-900 font-semibold mb-4">
        Confirm Reschedule
      </h3>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">New Date</span>
          <span className="font-medium">{date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">New Time Slot</span>
          <span className="font-medium">
            {selectedSlot
              ? `${new Date(selectedSlot.startsAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })} - ${new Date(new Date(selectedSlot.startsAt).getTime() + 30 * 60 * 1000).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : ""}
          </span>
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
          placeholder="Add any notes..."
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
          onClick={handleReschedule}
          disabled={loading || !selectedSlot}
          className="px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed"
        >
          {loading ? "Rescheduling..." : "Reschedule"}
        </button>
      </div>
    </div>
  );
}