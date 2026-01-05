"use client";
import { useEffect, useState } from "react";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";
import AddAppointmentModal from "@/components/staff/appointments/AddAppointmentModal";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface UserData {
    fullName: string;
}

interface AppointmentDto {
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

type Appointment = {
    id: string;
    name: string;
    time: string;
    phoneNumber: string;
    doctor: string;
    department: string;
    status: string;
    description: string | null;
};

type TabStatus = "PENDING" | "CONFIRMED" | "CHECKED_IN" | "DONE" | "CANCELLED";

export default function AppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [allAppointments, setAllAppointments] = useState<AppointmentDto[]>(
        []
    );
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabStatus>("PENDING");

    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        const formettedDateTime = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
        // return formettedDateTime.split("T")[1]
        return formettedDateTime;
    };

    const transformAppointment = (dto: AppointmentDto): Appointment => {
        return {
            id: dto.id.substring(0, 8),
            name: dto.patientDto.userDto.fullName,
            time: formatTime(dto.startsAt),
            phoneNumber: dto.patientDto.userDto.phone,
            doctor: dto.doctorDto.staffDto.userDto.fullName,
            department: dto.doctorDto.departmentDto?.name || "General",
            status: dto.status,
            description: dto.description,
        };
    };

    const fetchAllAppointments = async () => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            const [pendingRes, confirmedRes, checkedInRes] = await Promise.all([
                fetch("/api/appointments/pending", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("/api/appointments/confirmed", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("/api/appointments/checked-in", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            const allData: AppointmentDto[] = [];

            if (pendingRes.ok) {
                const pendingData = await pendingRes.json();
                allData.push(...pendingData);
            }

            if (confirmedRes.ok) {
                const confirmedData = await confirmedRes.json();
                allData.push(...confirmedData);
            }

            if (checkedInRes.ok) {
                const checkedInData = await checkedInRes.json();
                allData.push(...checkedInData);
            }

            setAllAppointments(allData);
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        }
    };

    useEffect(() => {
        const token = Cookies.get("token");

        if (!token) {
            router.push("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const userResponse = await fetch("/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser(userData);
                } else {
                    Cookies.remove("token");
                    router.push("/login");
                    return;
                }

                await fetchAllAppointments();
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    useEffect(() => {
        const filtered = allAppointments.filter(
            (apt) => apt.status === activeTab
        );
        const transformed = filtered.map(transformAppointment);
        setAppointments(transformed);
    }, [allAppointments, activeTab]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const handleApprove = async (appointment: Appointment) => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            const fullAppointment = allAppointments.find((apt) =>
                apt.id.startsWith(appointment.id)
            );
            if (!fullAppointment) return;

            const response = await fetch(
                `/api/appointments/${fullAppointment.id}/confirm`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                await fetchAllAppointments();
            }
        } catch (error) {
            console.error("Failed to approve appointment:", error);
        }
    };

    const handleEncounter = async (appointment: Appointment) => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            const fullAppointment = allAppointments.find((apt) =>
                apt.id.startsWith(appointment.id)
            );
            if (!fullAppointment) return;

            const response = await fetch(
                `/api/appointments/${fullAppointment.id}/encounter`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                await fetchAllAppointments();
            }
        } catch (error) {
            console.error("Failed to create encounter:", error);
        }
    };

    const handleAddAppointment = async (appointmentData: {
        patientId: string;
        doctorId: string;
        assignmentId: string;
        startsAt: string;
        endsAt: string;
        status: string;
        type: string;
        description?: string;
    }) => {
        const token = Cookies.get("token");
        if (!token) {
            alert("Please login to continue");
            return;
        }

        try {
            const requestBody = {
                startsAt: appointmentData.startsAt,
                endsAt: appointmentData.endsAt,
                status: appointmentData.status,
                type: appointmentData.type,
                description: appointmentData.description || null,
                patientId: appointmentData.patientId,
                doctorId: appointmentData.doctorId,
                shiftAssignmentId: appointmentData.assignmentId,
            };

            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (res.ok) {
                alert("Appointment created successfully!");
                setIsAddModalOpen(false);
                // TODO: Refresh appointments list here
            } else {
                try {
                    const text = await res.text();
                    const errorData = text ? JSON.parse(text) : {};
                    alert(`Failed to create appointment: ${errorData.message || "Unknown error"}`);
                } catch {
                    alert(`Failed to create appointment: ${res.statusText}`);
                }
            }
        } catch (error) {
            console.error("Create appointment error:", error);
            alert("An error occurred while creating appointment");
        }
    };

    const appointmentColumns: ColumnDef<Appointment>[] = [
        { header: "ID", accessorKey: "id", className: "font-bold" },
        { header: "Name", accessorKey: "name", className: "font-medium" },
        { header: "Time", accessorKey: "time" },
        { header: "Phone Number", accessorKey: "phoneNumber" },
        { header: "Doctor", accessorKey: "doctor" },
        { header: "Department", accessorKey: "department" },
        {
            header: "Status",
            cell: (row) => {
                const statusStyles: Record<string, string> = {
                    PENDING: "bg-yellow-100 text-yellow-700",
                    CONFIRMED: "bg-blue-100 text-blue-700",
                    CHECKED_IN: "bg-purple-100 text-purple-700",
                    DONE: "bg-green-100 text-green-700",
                    CANCELLED: "bg-red-100 text-red-700",
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
                    {row.status === "PENDING" && (
                        <button
                            onClick={() => handleApprove(row)}
                            className="btn btn-xs bg-green-100 text-green-700 border-none hover:bg-green-200"
                        >
                            Approve
                        </button>
                    )}
                    {row.status === "CONFIRMED" && (
                        <button
                            onClick={() => handleEncounter(row)}
                            className="btn btn-xs bg-blue-100 text-blue-700 border-none hover:bg-blue-200"
                        >
                            Encounter
                        </button>
                    )}
                </div>
            ),
        },
    ];

    const tabs: { label: string; value: TabStatus; count: number }[] = [
        {
            label: "Pending",
            value: "PENDING",
            count: allAppointments.filter((a) => a.status === "PENDING").length,
        },
        {
            label: "Confirmed",
            value: "CONFIRMED",
            count: allAppointments.filter((a) => a.status === "CONFIRMED")
                .length,
        },
        {
            label: "Checked In",
            value: "CHECKED_IN",
            count: allAppointments.filter((a) => a.status === "CHECKED_IN")
                .length,
        },
        {
            label: "Done",
            value: "DONE",
            count: 0, // Not implemented yet
        },
        {
            label: "Cancelled",
            value: "CANCELLED",
            count: 0, // Not implemented yet
        },
    ];

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header tabName="Manage Appointments" userName={user?.fullName} />
            <Toolbar
                buttonName="Appointments"
                onSearch={() => {}}
                onFilter={() => {}}
                onAdd={() => setIsAddModalOpen(true)}
            />

            <div className="flex gap-2 border-b">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`px-4 py-2 font-medium transition-colors relative ${
                            activeTab === tab.value
                                ? "text-purple-600 border-b-2 border-purple-600"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        {tab.label}
                        <span
                            className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                activeTab === tab.value
                                    ? "bg-purple-100 text-purple-600"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            <DataTable columns={appointmentColumns} data={appointments} />
            <Pagination
                currentPage={1}
                totalPages={10}
                onPageChange={() => {}}
            />

            <AddAppointmentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddAppointment}
            />
        </div>
    );
}
