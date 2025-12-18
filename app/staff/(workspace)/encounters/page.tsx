"use client";
import { useState } from "react";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";

type Encounter = {
    id: string;
    patientName: string;
    doctor: string;
    date: string;
    diagnosis: string;
};

const mockEncounterData: Encounter[] = [
    {
        id: "#001",
        patientName: "Nguyen Van Anh",
        doctor: "Dr.Johnson",
        date: "15/05/2025",
        diagnosis: "Dengue Fever",
    },
    {
        id: "#002",
        patientName: "Tran Thi B",
        doctor: "Dr.Smith",
        date: "16/05/2025",
        diagnosis: "Hypertension",
    },
    {
        id: "#003",
        patientName: "Le Van C",
        doctor: "Dr.Brown",
        date: "17/05/2025",
        diagnosis: "Common Cold",
    },
    {
        id: "#004",
        patientName: "Pham Van D",
        doctor: "Dr.Wilson",
        date: "18/05/2025",
        diagnosis: "Diabetes Type 2",
    },
    {
        id: "#005",
        patientName: "Hoang Thi E",
        doctor: "Dr.Johnson",
        date: "19/05/2025",
        diagnosis: "Migraine",
    },
];

export default function EncountersPage() {
    const [encounters] = useState(mockEncounterData);

    const handleDetail = (encounter: Encounter) => {
        console.log("View details for encounter:", encounter.id);
    };

    const encounterColumns: ColumnDef<Encounter>[] = [
        { header: "ID", accessorKey: "id", className: "font-bold" },
        { header: "Patient's Name", accessorKey: "patientName", className: "font-medium" },
        { header: "Doctor", accessorKey: "doctor" },
        { header: "Date", accessorKey: "date" },
        { header: "Diagnosis", accessorKey: "diagnosis" },
        {
            header: "Action",
            cell: (row) => (
                <button
                    onClick={() => handleDetail(row)}
                    className="btn btn-xs bg-purple-100 text-purple-700 border-none hover:bg-purple-200"
                >
                    Detail
                </button>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header tabName="Manage Encounters" userName="Nguyen Huu Duy" />
            <Toolbar
                buttonName="Encounter"
                onSearch={() => {}}
                onFilter={() => {}}
                onAdd={() => {}}
            />
            <DataTable columns={encounterColumns} data={encounters} />
            <Pagination
                currentPage={1}
                totalPages={10}
                onPageChange={() => {}}
            />
        </div>
    );
}
