"use client";
import { useState } from "react";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";
import AddAppointmentModal from "@/components/staff/appointments/AddAppointmentModal";

type Appointment = {
    id: string;
    name: string;
    time: string;
    phoneNumber: string;
    doctor: string;
    department: string;
    room: string;
    status: "Pending" | "Approved" | "Cancelled";
};

const mockAppointmentData: Appointment[] = [
    {
        id: "#001",
        name: "Nguyen Van Anh",
        time: "08:30",
        phoneNumber: "0979010101",
        doctor: "Nguyen Van B",
        department: "Infectious Disease",
        room: "B108",
        status: "Pending",
    },
    {
        id: "#002",
        name: "Tran Thi B",
        time: "09:00",
        phoneNumber: "0978020202",
        doctor: "Le Van C",
        department: "Cardiology",
        room: "A205",
        status: "Pending",
    },
    {
        id: "#003",
        name: "Le Van C",
        time: "09:30",
        phoneNumber: "0977030303",
        doctor: "Nguyen Van B",
        department: "Orthopedics",
        room: "B108",
        status: "Approved",
    },
    {
        id: "#004",
        name: "Pham Van D",
        time: "10:00",
        phoneNumber: "0976040404",
        doctor: "Tran Van E",
        department: "Neurology",
        room: "C101",
        status: "Approved",
    },
    {
        id: "#005",
        name: "Hoang Thi E",
        time: "10:30",
        phoneNumber: "0975050505",
        doctor: "Nguyen Van B",
        department: "Infectious Disease",
        room: "B108",
        status: "Pending",
    },
];

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState(mockAppointmentData);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleApprove = (appointment: Appointment) => {
        setAppointments((prev) =>
            prev.map((apt) =>
                apt.id === appointment.id ? { ...apt, status: "Approved" as const } : apt
            )
        );
    };

    const handleReschedule = (appointment: Appointment) => {
        console.log("Reschedule appointment:", appointment.id);
    };

    const handleAddAppointment = (newAppointment: {
        name: string;
        time: string;
        phoneNumber: string;
        doctor: string;
        department: string;
        room: string;
    }) => {
        const newId = `#${String(appointments.length + 1).padStart(3, "0")}`;
        const appointment: Appointment = {
            id: newId,
            ...newAppointment,
            status: "Pending",
        };
        setAppointments((prev) => [...prev, appointment]);
        setIsAddModalOpen(false);
    };

    const appointmentColumns: ColumnDef<Appointment>[] = [
        { header: "ID", accessorKey: "id", className: "font-bold" },
        { header: "Name", accessorKey: "name", className: "font-medium" },
        { header: "Time", accessorKey: "time" },
        { header: "Phone Number", accessorKey: "phoneNumber" },
        { header: "Doctor", accessorKey: "doctor" },
        { header: "Department", accessorKey: "department" },
        { header: "Room", accessorKey: "room" },
        {
            header: "Status",
            cell: (row) => {
                const statusStyles = {
                    Pending: "bg-yellow-100 text-yellow-700",
                    Approved: "bg-green-100 text-green-700",
                    Cancelled: "bg-red-100 text-red-700",
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
                    {row.status === "Approved" && (
                        <button
                            onClick={() => handleReschedule(row)}
                            className="btn btn-xs bg-purple-100 text-purple-700 border-none hover:bg-purple-200"
                        >
                            Reschedule
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header tabName="Manage Appointments" userName="Nguyen Huu Duy" />
            <Toolbar
                buttonName="Appointments"
                onSearch={() => {}}
                onFilter={() => {}}
                onAdd={() => setIsAddModalOpen(true)}
            />
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
