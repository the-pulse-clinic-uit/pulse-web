"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";
import ApproveAdmissionModal from "@/components/staff/admission/ApproveAdmissionModal";
import AddAdmissionModal from "@/components/staff/admission/AddAdmissionModal";

type AdmissionStatus = "ONGOING" | "DISCHARGED" | "OUTPATIENT";

interface ApiAdmission {
    id: string;
    status: AdmissionStatus;
    notes: string;
    admittedAt: string;
    dischargedAt: string | null;
    encounterDto: {
        id: string;
        type: string;
        startedAt: string;
        endedAt: string;
        diagnosis: string;
        notes: string;
        appointmentDto: {
            id: string;
            startsAt: string;
            endsAt: string;
            status: string;
            type: string;
            description: string | null;
        };
    } | null;
    patientDto: {
        id: string;
        healthInsuranceId: string;
        bloodType: string;
        allergies: string;
        userDto: {
            id: string;
            email: string;
            fullName: string;
            citizenId: string;
            phone: string;
            gender: boolean;
            birthDate: string;
        };
    };
    doctorDto: {
        id: string;
        licenseId: string;
        staffDto: {
            id: string;
            userDto: {
                id: string;
                fullName: string;
                email: string;
                phone: string;
            };
            departmentDto: {
                id: string;
                name: string;
                description: string;
            };
        };
    };
    roomDto: {
        id: string;
        roomNumber: string;
        bedAmount: number;
        isAvailable: boolean;
        createdAt: string;
        departmentDto: {
            id: string;
            name: string;
            description: string;
            createdAt: string;
        };
    };
}

type AdmissionPatient = {
    id: string;
    name: string;
    age: number;
    chiefComplaint: string;
    attendingPhysician: string;
    department: string;
    room: string;
    admissionDate: string;
    status: "Under Treatment" | "Pending" | "Discharged";
};

export default function AdmissionPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedAdmission, setSelectedAdmission] =
        useState<AdmissionPatient | null>(null);
    const [admissions, setAdmissions] = useState<AdmissionPatient[]>([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);

    const calculateAge = (birthDate: string): number => {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }
        return age;
    };

    const mapApiStatusToDisplayStatus = (
        status: AdmissionStatus
    ): "Under Treatment" | "Pending" | "Discharged" => {
        switch (status) {
            case "ONGOING":
                return "Under Treatment";
            case "OUTPATIENT":
                return "Pending";
            case "DISCHARGED":
                return "Discharged";
            default:
                return "Under Treatment";
        }
    };

    const formatDateTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const mapApiAdmissionToTableData = (
        apiAdmission: ApiAdmission
    ): AdmissionPatient => {
        return {
            id: apiAdmission.id,
            name: apiAdmission.patientDto.userDto.fullName,
            age: calculateAge(apiAdmission.patientDto.userDto.birthDate),
            chiefComplaint: apiAdmission.encounterDto?.diagnosis || "N/A",
            attendingPhysician:
                apiAdmission.doctorDto.staffDto.userDto.fullName,
            department: apiAdmission.doctorDto.staffDto.departmentDto.name,
            room: `Room ${apiAdmission.roomDto.roomNumber}`,
            admissionDate: formatDateTime(apiAdmission.admittedAt),
            status: mapApiStatusToDisplayStatus(apiAdmission.status),
        };
    };

    const fetchAdmissions = async () => {
        const token = Cookies.get("token");
        if (!token) {
            console.log("No token found");
            return;
        }

        setLoading(true);
        try {
            const userRes = await fetch("/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (userRes.ok) setUser(await userRes.json());

            const response = await fetch("/api/admissions", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data: ApiAdmission[] = await response.json();
                const mappedData = data.map(mapApiAdmissionToTableData);
                setAdmissions(mappedData);
            } else {
                console.error("Failed to fetch admissions:", response.status);
                toast.error("Failed to load admissions");
            }
        } catch (error) {
            console.error("Error fetching admissions:", error);
            toast.error("Error loading admissions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmissions();
    }, []);

    const handleApprove = (admission: AdmissionPatient) => {
        setSelectedAdmission(admission);
        setIsModalOpen(true);
    };

    const handleSaveRoom = (room: string) => {
        console.log(
            "Assigning room:",
            room,
            "to admission:",
            selectedAdmission?.id
        );
        setIsModalOpen(false);
        setSelectedAdmission(null);
    };

    const admissionColumns: ColumnDef<AdmissionPatient>[] = [
        { header: "ID", accessorKey: "id", className: "font-bold" },
        { header: "Name", accessorKey: "name", className: "font-medium" },
        { header: "Age", accessorKey: "age" },
        { header: "Chief Complaint", accessorKey: "chiefComplaint" },
        { header: "Attending Physician", accessorKey: "attendingPhysician" },
        { header: "Department", accessorKey: "department" },
        { header: "Room", accessorKey: "room" },
        { header: "Admission Date", accessorKey: "admissionDate" },
        {
            header: "Status",
            cell: (row) => {
                const statusStyles = {
                    "Under Treatment": "bg-blue-100 text-blue-700",
                    Pending: "bg-yellow-100 text-yellow-700",
                    Discharged: "bg-green-100 text-green-700",
                };
                return (
                    <span
                        className={`
            inline-flex items-center justify-center px-3 py-1.5 rounded-full 
            text-xs font-medium whitespace-nowrap 
            ${statusStyles[row.status] || "bg-gray-100"}
            `}
                    >
                        {row.status}
                    </span>
                );
            },
        },
        {
            header: "Action",
            cell: (row) => (
                <div className="flex gap-2">
                    {row.status === "Pending" && (
                        <button
                            onClick={() => handleApprove(row)}
                            className="btn btn-xs bg-green-100 text-green-700 border-none hover:bg-green-200"
                        >
                            Approve
                        </button>
                    )}
                    {row.status !== "Discharged" && (
                        <button className="btn btn-xs bg-purple-100 text-purple-700 border-none hover:bg-purple-200">
                            Discharge
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header
                tabName="Manage Admission"
                userName={user?.fullName}
                avatarUrl={user?.avatarUrl}
            />
            <Toolbar
                buttonName="Admission"
                onSearch={() => {}}
                onFilter={() => {}}
                onAdd={() => setIsAddModalOpen(true)}
            />
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <>
                    <DataTable columns={admissionColumns} data={admissions} />
                    <Pagination
                        currentPage={1}
                        totalPages={10}
                        onPageChange={() => {}}
                    />
                </>
            )}

            {selectedAdmission && (
                <ApproveAdmissionModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedAdmission(null);
                    }}
                    onSave={handleSaveRoom}
                    admission={{
                        id: selectedAdmission.id,
                        name: selectedAdmission.name,
                        age: selectedAdmission.age,
                        chiefComplaint: selectedAdmission.chiefComplaint,
                        attendingPhysician:
                            selectedAdmission.attendingPhysician,
                        department: selectedAdmission.department,
                        admissionDate: selectedAdmission.admissionDate,
                    }}
                />
            )}

            <AddAdmissionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    fetchAdmissions();
                }}
            />
        </div>
    );
}
