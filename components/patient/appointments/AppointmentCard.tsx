"use client";

import { Calendar, Clock, MapPin, Video, X, FileText } from "lucide-react";

interface Appointment {
  id: string;
  startsAt: string;
  endsAt: string;
  status: string;
  type: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  patientDto: {
    id: string;
    healthInsuranceId: string;
    bloodType: string;
    allergies: string;
    createdAt: string;
  };
  doctorDto: {
    id: string;
    licenseId: string;
    isVerified: boolean;
    createdAt: string;
    staffDto: {
      id: string;
      position: string;
      createdAt: string;
      userDto: {
        id: string;
        email: string;
        fullName: string;
        address: string;
        citizenId: string;
        phone: string;
        gender: boolean;
        birthDate: string;
        avatarUrl: string | null;
        createdAt: string;
        updatedAt: string;
        isActive: boolean;
      };
    };
    departmentDto: {
      id: string;
      name: string;
      description: string;
      createdAt: string;
    } | null;
  };
  shiftAssignmentDto: unknown;
  followUpPlanDto: unknown;
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-600";
      case "CONFIRMED":
        return "bg-green-100 text-green-600";
      case "COMPLETED":
        return "bg-gray-100 text-gray-600";
      case "CANCELLED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  const doctorName = appointment.doctorDto.staffDto.userDto.fullName;
  const specialty = appointment.doctorDto.departmentDto?.name || "General";
  const appointmentType = appointment.type === "NORMAL" ? "In-Person" : appointment.type;
  const location = appointmentType === "In-Person" ? "Hospital" : "Virtual";

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-purple-900 font-semibold">{doctorName}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{specialty}</p>

            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                {formatDate(appointment.startsAt)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                {formatTime(appointment.startsAt)}
              </div>
              <div className="flex items-center gap-2">
                {appointmentType === "Video Call" ? (
                  <Video className="w-4 h-4 text-purple-600" />
                ) : (
                  <MapPin className="w-4 h-4 text-purple-600" />
                )}
                {location}
              </div>
            </div>

            {appointment.description && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Note:</p>
                    <p className="text-sm text-gray-700">
                      {appointment.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {appointment.status.toUpperCase() === "PENDING" && (
          <div className="flex gap-3">
            <button className="px-6 py-2 border-2 border-purple-300 text-purple-600 rounded-full hover:bg-purple-50">
              Reschedule
            </button>

            <button
              onClick={handleCancel}
              className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-full hover:bg-red-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
