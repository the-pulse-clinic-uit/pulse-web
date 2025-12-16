"use client";
import { useState } from "react";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";

type Patient = {
    id: string;
    name: string;
    age: number;
    gender: "Male" | "Female" | "Other";
    phoneNumber: string;
    email: string;
    address: string;
    healthInsurance: boolean;
};

const mockPatientData: Patient[] = [
    {
        id: "#001",
        name: "Nguyen Van Anh",
        age: 45,
        gender: "Female",
        phoneNumber: "0979010101",
        email: "nvana@gmail.com",
        address: "Thu Duc, Ho Chi Minh city",
        healthInsurance: false,
    },
    {
        id: "#002",
        name: "Tran Thi B",
        age: 32,
        gender: "Female",
        phoneNumber: "0978020202",
        email: "ttb@gmail.com",
        address: "District 1, Ho Chi Minh city",
        healthInsurance: false,
    },
    {
        id: "#003",
        name: "Le Van C",
        age: 28,
        gender: "Male",
        phoneNumber: "0977030303",
        email: "lvc@gmail.com",
        address: "District 3, Ho Chi Minh city",
        healthInsurance: false,
    },
    {
        id: "#004",
        name: "Pham Van D",
        age: 55,
        gender: "Male",
        phoneNumber: "0976040404",
        email: "pvd@gmail.com",
        address: "Binh Thanh, Ho Chi Minh city",
        healthInsurance: true,
    },
    {
        id: "#005",
        name: "Hoang Thi E",
        age: 45,
        gender: "Female",
        phoneNumber: "0975050505",
        email: "hte@gmail.com",
        address: "District 7, Ho Chi Minh city",
        healthInsurance: true,
    },
];

export default function PatientsPage() {
    const [patients, setPatients] = useState(mockPatientData);

    const handleView = (patient: Patient) => {};

    const handleEdit = (patient: Patient) => {};

    const patientColumns: ColumnDef<Patient>[] = [
        { header: "ID", accessorKey: "id", className: "font-bold" },
        { header: "Name", accessorKey: "name", className: "font-medium" },
        { header: "Age", accessorKey: "age" },
        { header: "Gender", accessorKey: "gender" },
        { header: "Phone Number", accessorKey: "phoneNumber" },
        { header: "Email", accessorKey: "email" },
        { header: "Address", accessorKey: "address" },
        {
            header: "Health Insurance",
            cell: (row) => (
                <span
                    className={`
            inline-flex items-center justify-center px-3 py-1.5 rounded-full 
            text-xs font-medium whitespace-nowrap 
            ${
                row.healthInsurance
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
            }
          `}
                >
                    {row.healthInsurance ? "Is Insured" : "No"}
                </span>
            ),
        },
        {
            header: "Action",
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleView(row)}
                        className="btn btn-xs bg-blue-100 text-blue-700 border-none hover:bg-blue-200"
                    >
                        View
                    </button>
                    <button
                        onClick={() => handleEdit(row)}
                        className="btn btn-xs bg-purple-100 text-purple-700 border-none hover:bg-purple-200"
                    >
                        Edit
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header tabName="Manage Patients" userName="Nguyen Huu Duy" />
            <Toolbar
                buttonName="Patient"
                onSearch={() => {}}
                onFilter={() => {}}
                onAdd={() => {}}
            />
            <DataTable columns={patientColumns} data={patients} />
            <Pagination
                currentPage={1}
                totalPages={10}
                onPageChange={() => {}}
            />
        </div>
    );
}
