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
    quantity: number | null;
    expiryDate: string | null;
    minStockLevel: number | null;
    batchNumber: string | null;
}

interface Drug {
    id: string;
    name: string;
    dosageForm: string;
    unit: string;
    strength: string;
    unitPrice: number;
    createdAt: string;
    quantity: number | null;
    expiryDate: string | null;
    minStockLevel: number | null;
    batchNumber: string | null;
}

export default function DrugsPage() {
    const [drugs, setDrugs] = useState<Drug[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
    const [user, setUser] = useState<UserData | null>(null);

    const fetchDrugs = async () => {
        setLoading(true);
        try {
            const token = Cookies.get("token");

            const userRes = await fetch("/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (userRes.ok) setUser(await userRes.json());

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
            header: "Quantity",
            accessorKey: "quantity",
            cell: (row) => row.quantity ?? "N/A",
        },
        {
            header: "Price ($)",
            accessorKey: "unitPrice",
            cell: (row) => row.unitPrice.toFixed(2),
        },
        {
            header: "Batch No.",
            accessorKey: "batchNumber",
            cell: (row) => row.batchNumber ?? "N/A",
        },
        {
            header: "Expiry",
            accessorKey: "expiryDate",
            cell: (row) =>
                row.expiryDate
                    ? new Date(row.expiryDate).toLocaleDateString()
                    : "N/A",
        },
        {
            header: "Created",
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
            <Header
                tabName="Drug Catalog"
                userName={user?.fullName}
                avatarUrl={user?.avatarUrl}
            />
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
