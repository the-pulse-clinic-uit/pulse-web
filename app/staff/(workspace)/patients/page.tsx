"use client";
import { useEffect, useState } from "react";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";
import AddPatientModal from "@/components/staff/patients/AddPatientModal";
import ViewPatientModal from "@/components/staff/patients/ViewPatientModal";
import EditPatientModal from "@/components/staff/patients/EditPatientModal";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type Patient = {
    id: string;
    name: string;
    birthDate: string;
    gender: "Male" | "Female" | "Other";
    phoneNumber: string;
    email: string;
    address: string;
    healthInsurance: boolean;
    insuranceNumber?: string;
};

export default function PatientsPage() {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
        null
    );
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get("token");

        if (!token) {
            router.push("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    Cookies.remove("token");
                    router.push("/login");
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const handleView = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsViewModalOpen(true);
    };

    const handleEdit = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsEditModalOpen(true);
    };

    const handleAddPatient = (newPatient: {
        name: string;
        birthDate: string;
        gender: "Male" | "Female" | "Other";
        phoneNumber: string;
        email: string;
        address: string;
        healthInsurance: boolean;
        insuranceNumber?: string;
    }) => {
        const newId = `#${String(patients.length + 1).padStart(3, "0")}`;
        const patient: Patient = {
            id: newId,
            ...newPatient,
        };
        setPatients((prev) => [...prev, patient]);
        setIsAddModalOpen(false);
    };

    const handleSaveEdit = (
        id: string,
        updatedPatient: {
            name: string;
            age: number;
            gender: "Male" | "Female" | "Other";
            phoneNumber: string;
            email: string;
            address: string;
            healthInsurance: boolean;
            insuranceNumber?: string;
        }
    ) => {
        setPatients((prev) =>
            prev.map((patient) =>
                patient.id === id ? { ...patient, ...updatedPatient } : patient
            )
        );
        setIsEditModalOpen(false);
        setSelectedPatient(null);
    };

    const patientColumns: ColumnDef<Patient>[] = [
        { header: "ID", accessorKey: "id", className: "font-bold" },
        { header: "Name", accessorKey: "name", className: "font-medium" },
        { header: "Birth Date", accessorKey: "birthDate" },
        { header: "Gender", accessorKey: "gender" },
        { header: "Phone Number", accessorKey: "phoneNumber" },
        { header: "Email", accessorKey: "email" },
        { header: "Address", accessorKey: "address" },
        {
            header: "Health Insurance",
            cell: (row) => (
                <span
                    className={`
            inline-flex items-center justify-center px-3 py-1.5 rounded-full 
            text-xs font-medium whitespace-nowrap 
            ${
                row.healthInsurance
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
            }
          `}
                >
                    {row.healthInsurance ? "Is Insured" : "No"}
                </span>
            ),
        },
        {
            header: "Action",
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleView(row)}
                        className="btn btn-xs bg-blue-100 text-blue-700 border-none hover:bg-blue-200"
                    >
                        View
                    </button>
                    <button
                        onClick={() => handleEdit(row)}
                        className="btn btn-xs bg-purple-100 text-purple-700 border-none hover:bg-purple-200"
                    >
                        Edit
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header
                tabName="Manage Patients"
                userName={user?.fullName}
                avatarUrl={user?.avatarUrl}
            />
            <Toolbar
                buttonName="Patient"
                onSearch={() => {}}
                onFilter={() => {}}
                onAdd={() => setIsAddModalOpen(true)}
            />
            <DataTable columns={patientColumns} data={patients} />
            <Pagination
                currentPage={1}
                totalPages={10}
                onPageChange={() => {}}
            />

            <AddPatientModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddPatient}
            />

            <ViewPatientModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedPatient(null);
                }}
                patient={selectedPatient}
            />

            <EditPatientModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedPatient(null);
                }}
                onSave={handleSaveEdit}
                patient={selectedPatient}
            />
        </div>
    );
}
