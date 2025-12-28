"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import AddDrugModal from "@/components/staff/drugs/AddDrugModal";
import ViewDrugModal from "@/components/staff/drugs/ViewDrugModal";
import UpdateDrugModal from "@/components/staff/drugs/UpdateDrugModal";

interface ApiDrugResponse {
    id: string;
    name: string;
    dosageForm: string;
    unit: string;
    strength: string;
    unitPrice: number;
    createdAt: string;
}

interface Drug {
    id: string;
    name: string;
    dosageForm: string;
    unit: string;
    strength: string;
    unitPrice: number;
    createdAt: string;
}

export default function DrugsPage() {
    const [drugs, setDrugs] = useState<Drug[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);

    const fetchDrugs = async () => {
        setLoading(true);
        try {
            const token = Cookies.get("token");

            const res = await fetch(`/api/drugs`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch drugs");
            }

            const data: ApiDrugResponse[] = await res.json();
            setDrugs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrugs();
    }, []);

    const handleDrugAddedSuccess = () => {
        fetchDrugs();
    };

    const handleDrugUpdatedSuccess = () => {
        fetchDrugs();
    };

    const handleViewDrug = (drug: Drug) => {
        setSelectedDrug(drug);
        setIsViewModalOpen(true);
    };

    const handleEditDrug = (drug: Drug) => {
        setSelectedDrug(drug);
        setIsUpdateModalOpen(true);
    };

    const columns: ColumnDef<Drug>[] = [
        {
            header: "ID",
            accessorKey: "id",
            cell: (row) => (
                <span title={row.id}>{row.id.substring(0, 8)}...</span>
            ),
        },
        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "Strength",
            accessorKey: "strength",
        },
        {
            header: "Dosage Form",
            accessorKey: "dosageForm",
        },
        {
            header: "Unit",
            accessorKey: "unit",
        },
        {
            header: "Unit Price ($)",
            accessorKey: "unitPrice",
            cell: (row) => row.unitPrice.toFixed(2),
        },
        {
            header: "Created At",
            accessorKey: "createdAt",
            cell: (row) => new Date(row.createdAt).toLocaleDateString(),
        },
        {
            header: "Action",
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        className="btn btn-primary btn-sm text-xs"
                        onClick={() => handleViewDrug(row)}
                    >
                        Detail
                    </button>
                    <button
                        className="btn btn-secondary btn-sm text-xs"
                        onClick={() => handleEditDrug(row)}
                    >
                        Edit
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header tabName="Drug Catalog" userName="Nguyen Huu Duy" />
            <Toolbar buttonName="Drug" onAdd={() => setIsAddModalOpen(true)} />

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : drugs.length > 0 ? (
                <DataTable data={drugs} columns={columns} />
            ) : (
                <div className="text-center text-gray-500 py-10">
                    No drugs found.
                </div>
            )}

            <Pagination
                currentPage={1}
                totalPages={1}
                onPageChange={() => {}}
            />

            <AddDrugModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleDrugAddedSuccess}
            />

            <ViewDrugModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                onEdit={() => {
                    setIsViewModalOpen(false);
                    setIsUpdateModalOpen(true);
                }}
                drug={selectedDrug}
            />

            <UpdateDrugModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onUpdate={handleDrugUpdatedSuccess}
                drug={selectedDrug}
            />
        </div>
    );
}
