"use client";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";
import { Patient } from "@/types";

type WaitlistPatient = {
    id: string;
    name: string;
    age: number;
    gender: string;
    chiefComplaint: string;
    department: string;
    arrivalTime: string;
    status: "Waiting" | "Approved";
};

const waitlistColumns: ColumnDef<WaitlistPatient>[] = [
    { header: "ID", accessorKey: "id", className: "font-bold" },
    { header: "Name", accessorKey: "name", className: "font-medium" },
    { header: "Age", accessorKey: "age" },
    { header: "Gender", accessorKey: "gender" },
    {
        header: "Chief Complaint",
        accessorKey: "chiefComplaint",
        className: "max-w-xs truncate",
    },
    { header: "Department", accessorKey: "department" },
    { header: "Arrival Time", accessorKey: "arrivalTime" },
    {
        header: "Status",
        cell: (row) => (
            <span
                className={`badge border-none ${
                    row.status === "Waiting"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                }`}
            >
                {row.status}
            </span>
        ),
    },
    {
        header: "Action",
        cell: (row) => (
            <div className="flex flex-col gap-2">
                {row.status === "Waiting" ? (
                    <>
                        <button className="btn btn-xs bg-green-100 text-green-700 border-none hover:bg-green-200">
                            Approve
                        </button>
                        <button className="btn btn-xs bg-red-100 text-red-700 border-none hover:bg-red-200">
                            Reject
                        </button>
                    </>
                ) : (
                    <button className="btn btn-xs bg-purple-100 text-purple-700 border-none hover:bg-purple-200">
                        Move to Admission
                    </button>
                )}
            </div>
        ),
    },
];

const mockPatients: Patient[] = [
    {
        id: "#001",
        name: "Nguyen Van A",
        age: 45,
        gender: "Male",
        chiefComplaint: "High fever, sore throat",
        department: "Infectious Disease",
        arrivalTime: "08:25",
        status: "Waiting",
    },
    {
        id: "#002",
        name: "Nguyen Van A",
        age: 45,
        gender: "Male",
        chiefComplaint: "High fever, sore throat",
        department: "Infectious Disease",
        arrivalTime: "08:25",
        status: "Approved",
    },
    {
        id: "#003",
        name: "Nguyen Van A",
        age: 45,
        gender: "Male",
        chiefComplaint: "High fever, sore throat",
        department: "Infectious Disease",
        arrivalTime: "08:25",
        status: "Approved",
    },
    {
        id: "#004",
        name: "Nguyen Van A",
        age: 45,
        gender: "Male",
        chiefComplaint: "High fever, sore throat",
        department: "Infectious Disease",
        arrivalTime: "08:25",
        status: "Waiting",
    },
    {
        id: "#005",
        name: "Nguyen Van A",
        age: 45,
        gender: "Male",
        chiefComplaint: "High fever, sore throat",
        department: "Infectious Disease",
        arrivalTime: "08:25",
        status: "Waiting",
    },
    {
        id: "#006",
        name: "Nguyen Van A",
        age: 45,
        gender: "Male",
        chiefComplaint: "High fever, sore throat",
        department: "Infectious Disease",
        arrivalTime: "08:25",
        status: "Waiting",
    },
    {
        id: "#007",
        name: "Nguyen Van A",
        age: 45,
        gender: "Male",
        chiefComplaint: "High fever, sore throat",
        department: "Infectious Disease",
        arrivalTime: "08:25",
        status: "Waiting",
    },
];

export default function WaitListPage() {
    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header tabName="Manage Wait List" userName="Nguyen Huu Duy" />
            <Toolbar
                buttonName="Wait List"
                onSearch={() => {}}
                onFilter={() => {}}
                onAdd={() => {}}
            />
            <DataTable columns={waitlistColumns} data={mockPatients} />
            <Pagination
                currentPage={1}
                totalPages={10}
                onPageChange={() => {}}
            />
        </div>
    );
}
