"use client";

import AppointmentCard from "./AppointmentCard";

const appointments = [
  {
    id: "1",
    time: "09:00 AM",
    patientName: "John Doe",
    date: "2025-11-18",
    room: "Room 101",
    type: "Consultation",
    status: "confirmed" as const
  },
  {
    id: "2",
    time: "10:30 AM",
    patientName: "Sarah Smith",
    date: "2025-11-18",
    room: "Room 101",
    type: "Follow-up",
    status: "confirmed" as const
  },
  {
    id: "3",
    time: "02:00 PM",
    patientName: "Mike Johnson",
    date: "2025-11-18",
    room: "Room 102",
    type: "Check-up",
    status: "pending" as const
  },
  {
    id: "4",
    time: "03:30 PM",
    patientName: "Emily Davis",
    date: "2025-11-18",
    room: "Room 101",
    type: "Consultation",
    status: "confirmed" as const
  },
  {
    id: "5",
    time: "05:00 PM",
    patientName: "Robert Wilson",
    date: "2025-11-18",
    room: "Room 102",
    type: "Follow-up",
    status: "pending" as const
  }
];

export default function AppointmentManagement() {
  const handleDetails = (id: string) => {
    alert(`View details for appointment ${id}`);
  };

  const handleReschedule = (id: string) => {
    alert(`Reschedule appointment ${id}`);
  };

  const handleCancel = (id: string) => {
    alert(`Cancel appointment ${id}`);
  };

  const handleAccept = (id: string) => {
    alert(`Accept appointment ${id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Appointment Management
      </h2>
      
      <div className="space-y-4">
        {appointments.map(appointment => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onDetails={handleDetails}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
            onAccept={appointment.status === "pending" ? handleAccept : undefined}
          />
        ))}
      </div>
    </div>
  );
}