"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import AppointmentCard from "./AppointmentCard";

const appointments = [
  {
    id: 1,
    doctor: "Dr. Emily Carter",
    specialty: "Cardiologist",
    date: "Dec 22, 2025",
    time: "10:00 AM",
    type: "In-Person",
    location: "Building A, Room 302",
    status: "Confirmed",
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialty: "General Practitioner",
    date: "Jan 5, 2026",
    time: "2:30 PM",
    type: "Video Call",
    location: "Virtual",
    status: "Confirmed",
  },
  {
    id: 3,
    doctor: "Dr. Sarah Williams",
    specialty: "Dermatologist",
    date: "Dec 10, 2025",
    time: "11:00 AM",
    type: "In-Person",
    location: "Building B, Room 105",
    status: "Completed",
  },
];

export default function AppointmentList() {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-purple-900 text-3xl font-semibold mb-2">
            My Appointments
          </h1>
          <p className="text-gray-600">
            View and manage your appointments
          </p>
        </div>

        <Link
          href="/book-appointment"
          className="flex items-center gap-2 px-6 py-3 
                     bg-gradient-to-r from-purple-500 to-purple-600 
                     text-white rounded-full hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Book Appointment
        </Link>
      </div>

      <div className="space-y-6">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
          />
        ))}
      </div>
    </>
  );
}
