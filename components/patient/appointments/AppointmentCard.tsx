"use client";

import {
  Calendar,
  Clock,
  MapPin,
  Video,
  X,
} from "lucide-react";

interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  location: string;
  status: string;
}

export default function AppointmentCard({
  appointment,
}: {
  appointment: Appointment;
}) {
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      alert("Appointment cancelled successfully");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-purple-900 font-semibold">
                {appointment.doctor}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  appointment.status === "Confirmed"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {appointment.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4">
              {appointment.specialty}
            </p>

            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                {appointment.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                {appointment.time}
              </div>
              <div className="flex items-center gap-2">
                {appointment.type === "Video Call" ? (
                  <Video className="w-4 h-4 text-purple-600" />
                ) : (
                  <MapPin className="w-4 h-4 text-purple-600" />
                )}
                {appointment.location}
              </div>
            </div>
          </div>
        </div>

        {appointment.status === "Confirmed" && (
          <div className="flex gap-3">
            {appointment.type === "Video Call" && (
              <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full">
                Join Call
              </button>
            )}

            <button className="px-6 py-2 border-2 border-purple-300 text-purple-600 rounded-full">
              Reschedule
            </button>

            <button
              onClick={handleCancel}
              className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
