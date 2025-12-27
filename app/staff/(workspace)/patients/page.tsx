"use client";
import { useEffect, useState, useCallback } from "react";
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
    age?: number;
    gender: "Male" | "Female" | "Other";
    phoneNumber: string;
    email: string;
    address: string;
    healthInsurance: boolean;
    insuranceNumber?: string;
    citizenId?: string;
    bloodType?: string;
    allergies?: string;
};

interface PatientDTO {
    id: string;
    userDto: {
        fullName: string;
        birthDate: string;
        gender: boolean;
        phone: string;
        email: string;
        address: string;
        citizenId: string;
    };
    healthInsuranceId: string | null;
    bloodType: string;
    allergies: string;
}

interface UserData {
    fullName: string;
    avatarUrl: string;
}

export default function PatientsPage() {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserData | null>(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
        null
    );

    const fetchData = useCallback(async () => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const userRes = await fetch("/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (userRes.ok) setUser(await userRes.json());

            const patientRes = await fetch("/api/patients", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (patientRes.ok) {
                const data = await patientRes.json();

                const formattedPatients: Patient[] = data.map(
                    (item: PatientDTO) => ({
                        id: item.id,
                        name: item.userDto.fullName || "N/A",
                        birthDate: item.userDto.birthDate || "",
                        gender: item.userDto.gender ? "Male" : "Female",
                        phoneNumber: item.userDto.phone || "",
                        email: item.userDto.email || "",
                        address: item.userDto.address || "No address",
                        healthInsurance: !!item.healthInsuranceId,
                        insuranceNumber: item.healthInsuranceId || "",
                        citizenId: item.userDto.citizenId,
                        bloodType: item.bloodType,
                        allergies: item.allergies,
                    })
                );

                setPatients(formattedPatients);
            } else if (patientRes.status === 401 || patientRes.status === 403) {
                Cookies.remove("token");
                router.push("/login");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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

    const handleAddSuccess = () => {
        setIsAddModalOpen(false);
        fetchData();
    };

    const handleSaveEdit = (id: string, updatedData: Partial<Patient>) => {
        console.log("Saving edit for id:", id, updatedData);
        setIsEditModalOpen(false);
    };

    const patientColumns: ColumnDef<Patient>[] = [
        { header: "Name", accessorKey: "name", className: "font-medium" },
        { header: "Birth Date", accessorKey: "birthDate" },
        { header: "Gender", accessorKey: "gender" },
        { header: "Phone", accessorKey: "phoneNumber" },
        { header: "Address", accessorKey: "address" },
        {
            header: "Insurance",
            cell: (row) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                        row.healthInsurance
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                    }`}
                >
                    {row.healthInsurance ? row.insuranceNumber : "No"}
                </span>
            ),
        },
        {
            header: "Action",
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleView(row)}
                        className="btn btn-xs btn-outline"
                    >
                        View
                    </button>
                    <button
                        onClick={() => handleEdit(row)}
                        className="btn btn-xs btn-primary"
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
                totalPages={1}
                onPageChange={() => {}}
            />

            <AddPatientModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleAddSuccess}
            />

            <ViewPatientModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                patient={selectedPatient}
            />

            <EditPatientModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveEdit}
                patient={selectedPatient}
            />
        </div>
    );
}
