"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface Department {
  id: string;
  name: string;
  description: string;
}

export default function DepartmentStep({
  selectedDepartment,
  onSelect,
  onNext,
}: {
  selectedDepartment: string | null;
  onSelect: (id: string) => void;
  onNext: () => void;
}) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = Cookies.get("token");
        const res = await fetch("/api/departments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch departments");
        }

        const data: Department[] = await res.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-purple-500"></span>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {departments.map((dept) => (
              <div
                key={dept.id}
                onClick={() => onSelect(dept.id)}
                className={`p-6 rounded-2xl shadow cursor-pointer transition-all
                ${
                  selectedDepartment === dept.id
                    ? "bg-purple-50 border-2 border-purple-500"
                    : "bg-white hover:shadow-lg"
                }`}
              >
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  {dept.name}
                </h3>
                <p className="text-gray-600 text-sm">{dept.description}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={onNext}
              disabled={!selectedDepartment}
              className={`px-6 py-2 rounded-full
              ${
                selectedDepartment
                  ? "bg-purple-500 text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
}