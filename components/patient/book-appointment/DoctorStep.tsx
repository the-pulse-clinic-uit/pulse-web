"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import DoctorCard from "./DoctorCard";

interface Doctor {
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
  };
}

export default function DoctorStep({
  selectedDoctor,
  onSelect,
  onNext,
}: {
  selectedDoctor: string | null;
  onSelect: (id: string) => void;
  onNext: () => void;
}) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = Cookies.get("token");
        const res = await fetch("/api/doctors", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data: Doctor[] = await res.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);
  const calculateExperience = (createdAt: string): string => {
    const created = new Date(createdAt);
    const now = new Date();
    const years = now.getFullYear() - created.getFullYear();
    return years > 0 ? `${years} years` : "Less than 1 year";
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-purple-500"></span>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {doctors.map((d) => (
              <DoctorCard
                key={d.id}
                name={d.staffDto.userDto.fullName}
                specialty={d.departmentDto.name}
                experience={calculateExperience(d.staffDto.userDto.createdAt)}
                selected={selectedDoctor === d.id}
                onClick={() => onSelect(d.id)}
              />
            ))}
          </div>

          <div className="text-center">
            <button
              disabled={!selectedDoctor}
              onClick={onNext}
              className={`px-8 py-3 rounded-full
              ${
                selectedDoctor
                  ? "bg-purple-500 text-white hover:bg-purple-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </>
      )}
    </>
  );
}
