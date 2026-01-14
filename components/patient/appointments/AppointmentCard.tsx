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

  const handleReschedule = () => {
    // Navigate to reschedule page with appointmentId
    window.location.href = `/reschedule/${appointment.id}`;
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
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-start gap-3 sm:gap-4 flex-1">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h3 className="text-purple-900 font-semibold text-base sm:text-lg truncate">{doctorName}</h3>
              <span
                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${getStatusColor(
                  appointment.status
                )} w-fit`}
              >
                {appointment.status}
              </span>
            </div>

            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{specialty}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="truncate">{formatDate(appointment.startsAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="truncate">{formatTime(appointment.startsAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                {appointmentType === "Video Call" ? (
                  <Video className="w-4 h-4 text-purple-600 flex-shrink-0" />
                ) : (
                  <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0" />
                )}
                <span className="truncate">{location}</span>
              </div>
            </div>

            {appointment.description && (
              <div className="mt-3 sm:mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-1">Note:</p>
                    <p className="text-xs sm:text-sm text-gray-700 break-words">
                      {appointment.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {appointment.status.toUpperCase() === "PENDING" && (
          <div className="flex gap-2 sm:gap-3 mt-2 lg:mt-0">
            <button className="flex-1 lg:flex-none px-4 sm:px-6 py-2 border-2 border-purple-300 text-purple-600 rounded-full hover:bg-purple-50 text-sm sm:text-base transition-colors" onClick={handleReschedule}>
              Reschedule
            </button>

            <button
              onClick={handleCancel}
              className="px-3 sm:px-4 py-2 border-2 border-red-300 text-red-600 rounded-full hover:bg-red-50 transition-colors flex-shrink-0"
              aria-label="Cancel appointment"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
