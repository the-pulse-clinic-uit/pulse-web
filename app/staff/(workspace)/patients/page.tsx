"use client";
import { useEffect, useState, useCallback } from "react";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";
import AddPatientModal from "@/components/staff/patients/AddPatientModal";
import ViewPatientModal from "@/components/staff/patients/ViewPatientModal";
import EditPatientModal from "@/components/staff/patients/EditPatientModal";
import FilterPatientModal from "@/components/staff/patients/FilterPatientModal";
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
    hasViolations?: boolean | null;
    violationLevel?: string | null;
    noShowCount?: number | null;
    outstandingDebt?: number | null;
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
    hasViolations: boolean | null;
    violationLevel: string | null;
    noShowCount: number | null;
    outstandingDebt: number | null;
}

interface UserData {
    fullName: string;
    avatarUrl: string;
}

export default function PatientsPage() {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserData | null>(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
        null
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        gender: "",
        bloodType: "",
        hasInsurance: "",
        hasViolations: "",
    });

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

            const patientRes = await fetch(
                "/api/patients?withViolations=true",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

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
                        hasViolations: item.hasViolations,
                        violationLevel: item.violationLevel,
                        noShowCount: item.noShowCount,
                        outstandingDebt: item.outstandingDebt,
                    })
                );

                setPatients(formattedPatients);
                setFilteredPatients(formattedPatients);
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

    useEffect(() => {
        let result = [...patients];

        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            result = result.filter(
                (patient) =>
                    patient.name.toLowerCase().includes(search) ||
                    patient.email.toLowerCase().includes(search) ||
                    patient.phoneNumber.toLowerCase().includes(search) ||
                    patient.citizenId?.toLowerCase().includes(search) ||
                    patient.insuranceNumber?.toLowerCase().includes(search)
            );
        }

        if (filters.gender) {
            result = result.filter(
                (patient) => patient.gender === filters.gender
            );
        }

        if (filters.bloodType) {
            result = result.filter(
                (patient) => patient.bloodType === filters.bloodType
            );
        }

        if (filters.hasInsurance) {
            const hasInsurance = filters.hasInsurance === "yes";
            result = result.filter(
                (patient) => patient.healthInsurance === hasInsurance
            );
        }

        if (filters.hasViolations) {
            const hasViolations = filters.hasViolations === "yes";
            result = result.filter(
                (patient) => !!patient.hasViolations === hasViolations
            );
        }

        setFilteredPatients(result);
    }, [searchTerm, filters, patients]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleFilterApply = () => {
        setIsFilterModalOpen(false);
    };

    const handleFilterReset = () => {
        setFilters({
            gender: "",
            bloodType: "",
            hasInsurance: "",
            hasViolations: "",
        });
        setSearchTerm("");
    };

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
        {
            header: "Blood Type",
            cell: (row) => (
                <span className="font-medium">{row.bloodType || "N/A"}</span>
            ),
        },
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
                    {row.healthInsurance ? "Yes" : "No"}
                </span>
            ),
        },
        {
            header: "Violations",
            cell: (row) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                        row.hasViolations
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                    }`}
                >
                    {row.hasViolations ? row.violationLevel || "Yes" : "No"}
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
                onSearch={handleSearch}
                onFilter={() => setIsFilterModalOpen(true)}
                onAdd={() => setIsAddModalOpen(true)}
            />

            {(searchTerm ||
                filters.gender ||
                filters.bloodType ||
                filters.hasInsurance ||
                filters.hasViolations) && (
                <div className="flex items-center justify-between bg-base-200 px-4 py-2 rounded-lg">
                    <p className="text-sm text-base-content/70">
                        Showing{" "}
                        <span className="font-semibold">
                            {filteredPatients.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold">{patients.length}</span>{" "}
                        patients
                    </p>
                    <button
                        onClick={handleFilterReset}
                        className="btn btn-ghost btn-sm text-primary"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            <DataTable columns={patientColumns} data={filteredPatients} />

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

            <FilterPatientModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                filters={filters}
                onFilterChange={handleFilterChange}
                onApply={handleFilterApply}
                onReset={handleFilterReset}
            />
        </div>
    );
}
