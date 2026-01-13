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
    avatarUrl: string | null;
}

type Appointment = {
    id: string;
    name: string;
    date: string;
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
        const formattedDateTime = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
        return formattedDateTime;
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        return formattedDate;
    };

    const transformAppointment = (dto: AppointmentDto): Appointment => {
        return {
            id: dto.id.substring(0, 8),
            name: dto.patientDto.userDto.fullName,
            date: formatDate(dto.startsAt),
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
            const [
                pendingRes,
                confirmedRes,
                checkedInRes,
                doneRes,
                cancelledRes,
            ] = await Promise.all([
                fetch("/api/appointments/status/PENDING", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("/api/appointments/status/CONFIRMED", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("/api/appointments/status/CHECKED_IN", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("/api/appointments/status/DONE", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("/api/appointments/status/CANCELLED", {
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

            if (doneRes.ok) {
                const doneData = await doneRes.json();
                allData.push(...doneData);
            }

            if (cancelledRes.ok) {
                const cancelledData = await cancelledRes.json();
                allData.push(...cancelledData);
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

    const handleDone = async (appointment: Appointment) => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            const fullAppointment = allAppointments.find((apt) =>
                apt.id.startsWith(appointment.id)
            );
            if (!fullAppointment) return;

            const response = await fetch(
                `/api/appointments/${fullAppointment.id}/done`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                alert("Appointment marked as done!");
                await fetchAllAppointments();
            } else {
                alert("Failed to mark appointment as done");
            }
        } catch (error) {
            console.error("Failed to mark as done:", error);
            alert("An error occurred");
        }
    };

    const handleCancel = async (appointment: Appointment) => {
        const reason = prompt("Enter cancellation reason (optional):");

        const token = Cookies.get("token");
        if (!token) return;

        try {
            const fullAppointment = allAppointments.find((apt) =>
                apt.id.startsWith(appointment.id)
            );
            if (!fullAppointment) return;

            const url = reason
                ? `/api/appointments/${
                      fullAppointment.id
                  }/cancel?reason=${encodeURIComponent(reason)}`
                : `/api/appointments/${fullAppointment.id}/cancel`;

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Appointment cancelled successfully!");
                await fetchAllAppointments();
            } else {
                alert("Failed to cancel appointment");
            }
        } catch (error) {
            console.error("Failed to cancel appointment:", error);
            alert("An error occurred");
        }
    };

    const handleNoShow = async (appointment: Appointment) => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            const fullAppointment = allAppointments.find((apt) =>
                apt.id.startsWith(appointment.id)
            );
            if (!fullAppointment) return;

            const response = await fetch(
                `/api/appointments/${fullAppointment.id}/noshow`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                alert("Appointment marked as no-show!");
                await fetchAllAppointments();
            } else {
                alert("Failed to mark appointment as no-show");
            }
        } catch (error) {
            console.error("Failed to mark as no-show:", error);
            alert("An error occurred");
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
                await fetchAllAppointments();
            } else {
                try {
                    const text = await res.text();
                    const errorData = text ? JSON.parse(text) : {};
                    alert(
                        `Failed to create appointment: ${
                            errorData.message || "Unknown error"
                        }`
                    );
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
        { header: "Date", accessorKey: "date" },
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
                        <>
                            <button
                                onClick={() => handleApprove(row)}
                                className="btn btn-xs bg-green-100 text-green-700 border-none hover:bg-green-200"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleCancel(row)}
                                className="btn btn-xs bg-red-100 text-red-700 border-none hover:bg-red-200"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                    {row.status === "CONFIRMED" && (
                        <>
                            <button
                                onClick={() => handleEncounter(row)}
                                className="btn btn-xs bg-blue-100 text-blue-700 border-none hover:bg-blue-200"
                            >
                                Encounter
                            </button>
                            <button
                                onClick={() => handleNoShow(row)}
                                className="btn btn-xs bg-orange-100 text-orange-700 border-none hover:bg-orange-200"
                            >
                                No Show
                            </button>
                            <button
                                onClick={() => handleCancel(row)}
                                className="btn btn-xs bg-red-100 text-red-700 border-none hover:bg-red-200"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                    {row.status === "CHECKED_IN" && (
                        <button
                            onClick={() => handleDone(row)}
                            className="btn btn-xs bg-purple-100 text-purple-700 border-none hover:bg-purple-200"
                        >
                            Done
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
            count: allAppointments.filter((a) => a.status === "DONE").length,
        },
        {
            label: "Cancelled",
            value: "CANCELLED",
            count: allAppointments.filter((a) => a.status === "CANCELLED")
                .length,
        },
    ];

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header
                tabName="Manage Appointments"
                userName={user?.fullName}
                avatarUrl={user?.avatarUrl || undefined}
            />
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
