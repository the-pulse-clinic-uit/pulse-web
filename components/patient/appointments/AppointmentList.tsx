"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import Cookies from "js-cookie";
import AppointmentCard from "./AppointmentCard";

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
    userDto: {
      id: string;
      email: string;
      fullName: string;
      address: string | null;
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

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // First, get patient ID
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

        // Then fetch appointments
        const appointmentsRes = await fetch(
          `/api/appointments/patient/${patientId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!appointmentsRes.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data: Appointment[] = await appointmentsRes.json();
        setAppointments(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch appointments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);
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

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-purple-500"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">No appointments found</p>
          <Link
            href="/book-appointment"
            className="text-purple-600 hover:underline"
          >
            Book your first appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
            />
          ))}
        </div>
      )}
    </>
  );
}
