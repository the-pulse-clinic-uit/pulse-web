"use client";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";

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
        cell: (row) =>
            row.status !== "Discharged" && (
                <button className="btn btn-xs bg-purple-100 text-purple-700 border-none hover:bg-purple-200">
                    Discharge
                </button>
            ),
    },
];

const mockAdmissionData: AdmissionPatient[] = [
    {
        id: "#001",
        name: "Nguyen Van Anh",
        age: 45,
        chiefComplaint: "High fever, sore throat",
        attendingPhysician: "Nguyen Van B",
        department: "Infectious Disease",
        room: "B108",
        admissionDate: "27/05/2025",
        status: "Under Treatment",
    },
    {
        id: "#002",
        name: "Tran Thi B",
        age: 32,
        chiefComplaint: "Severe headache, nausea",
        attendingPhysician: "Le Van C",
        department: "Neurology",
        room: "A205",
        admissionDate: "26/05/2025",
        status: "Under Treatment",
    },
    {
        id: "#003",
        name: "Le Van C",
        age: 28,
        chiefComplaint: "Fractured arm",
        attendingPhysician: "Nguyen Van B",
        department: "Orthopedics",
        room: "B108",
        admissionDate: "27/05/2025",
        status: "Pending",
    },
    {
        id: "#004",
        name: "Pham Van D",
        age: 55,
        chiefComplaint: "Chest pain",
        attendingPhysician: "Tran Van E",
        department: "Cardiology",
        room: "C101",
        admissionDate: "20/05/2025",
        status: "Discharged",
    },
    {
        id: "#005",
        name: "Hoang Thi E",
        age: 45,
        chiefComplaint: "High fever, sore throat",
        attendingPhysician: "Nguyen Van B",
        department: "Infectious Disease",
        room: "B108",
        admissionDate: "27/05/2025",
        status: "Discharged",
    },
];

export default function AdmissionPage() {
    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header tabName="Manage Admission" userName="Nguyen Huu Duy" />
            <Toolbar
                buttonName="Admission"
                onSearch={() => {}}
                onFilter={() => {}}
                onAdd={() => {}}
            />
            <DataTable columns={admissionColumns} data={mockAdmissionData} />
            <Pagination
                currentPage={1}
                totalPages={10}
                onPageChange={() => {}}
            />
        </div>
    );
}
