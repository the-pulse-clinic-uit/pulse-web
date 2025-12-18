"use client";
import { useState } from "react";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import AddDrugModal from "@/components/staff/drugs/AddDrugModal";
import ViewDrugModal from "@/components/staff/drugs/ViewDrugModal";

interface Drug {
    id: string;
    name: string;
    drugClassification: string;
    unit: string;
    stock: number;
    price: string;
    expirationDate: string;
    status: "Running Low" | "Adequate";
}

const initialDrugData: Drug[] = [
    {
        id: "#001",
        name: "Paracetamol 500mg",
        drugClassification: "Pain Relief",
        unit: "Tablet",
        stock: 1500,
        price: "2.500",
        expirationDate: "15/05/2025",
        status: "Running Low",
    },
    {
        id: "#001",
        name: "Paracetamol 500mg",
        drugClassification: "Pain Relief",
        unit: "Tablet",
        stock: 1500,
        price: "2.500",
        expirationDate: "15/05/2025",
        status: "Running Low",
    },
    {
        id: "#001",
        name: "Paracetamol 500mg",
        drugClassification: "Pain Relief",
        unit: "Tablet",
        stock: 1500,
        price: "2.500",
        expirationDate: "15/05/2025",
        status: "Running Low",
    },
    {
        id: "#001",
        name: "Paracetamol 500mg",
        drugClassification: "Pain Relief",
        unit: "Tablet",
        stock: 200,
        price: "2.500",
        expirationDate: "15/05/2025",
        status: "Running Low",
    },
    {
        id: "#001",
        name: "Paracetamol 500mg",
        drugClassification: "Pain Relief",
        unit: "Tablet",
        stock: 1500,
        price: "2.500",
        expirationDate: "15/05/2025",
        status: "Adequate",
    },
    {
        id: "#001",
        name: "Paracetamol 500mg",
        drugClassification: "Pain Relief",
        unit: "Tablet",
        stock: 1500,
        price: "2.500",
        expirationDate: "15/05/2025",
        status: "Adequate",
    },
];

export default function DrugsPage() {
    const [drugs, setDrugs] = useState<Drug[]>(initialDrugData);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);

    const handleAddDrug = (newDrug: {
        name: string;
        drugClassification: string;
        unit: string;
        stock: number;
        price: string;
        expirationDate: string;
    }) => {
        const drug: Drug = {
            id: `#${(drugs.length + 1).toString().padStart(3, "0")}`,
            ...newDrug,
            status: newDrug.stock < 500 ? "Running Low" : "Adequate",
        };
        setDrugs([...drugs, drug]);
        setIsAddModalOpen(false);
    };

    const handleViewDrug = (drug: Drug) => {
        setSelectedDrug(drug);
        setIsViewModalOpen(true);
    };

    const columns: ColumnDef<Drug>[] = [
        {
            header: "ID",
            accessorKey: "id",
        },
        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "Drug Classification",
            accessorKey: "drugClassification",
        },
        {
            header: "Unit",
            accessorKey: "unit",
        },
        {
            header: "Stock",
            accessorKey: "stock",
        },
        {
            header: "Price",
            accessorKey: "price",
        },
        {
            header: "Expiration Date",
            accessorKey: "expirationDate",
        },
        {
            header: "Status",
            cell: (row) => (
                <span
                    className={`badge ${
                        row.status === "Running Low"
                            ? "badge-warning"
                            : "badge-success"
                    } text-xs font-medium`}
                >
                    {row.status}
                </span>
            ),
        },
        {
            header: "Action",
            cell: (row) => (
                <button
                    className="btn btn-primary btn-sm text-xs"
                    onClick={() => handleViewDrug(row)}
                >
                    Detail
                </button>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header tabName="Drug Catalog" userName="Nguyen Huu Duy" />
            <Toolbar buttonName="Drug" onAdd={() => setIsAddModalOpen(true)} />
            <DataTable data={drugs} columns={columns} />
            <Pagination
                currentPage={1}
                totalPages={10}
                onPageChange={() => {}}
            />

            <AddDrugModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddDrug}
            />

            <ViewDrugModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                drug={selectedDrug}
            />
        </div>
    );
}
