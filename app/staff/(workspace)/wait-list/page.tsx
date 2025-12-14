"use client";
import Header from "@/components/staff/Header";
import DataTable from "@/components/staff/wait-list/WaitListTable";
import WaitListToolbar from "@/components/staff/wait-list/WaitListToolBar";
import Pagination from "@/components/ui/Pagination";
import { Patient } from "@/types";

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
            <WaitListToolbar
                onSearch={() => {}}
                onFilter={() => {}}
                onAdd={() => {}}
            />
            <DataTable patients={mockPatients} />
            <Pagination
                currentPage={1}
                totalPages={10}
                onPageChange={() => {}}
            />
        </div>
    );
}
