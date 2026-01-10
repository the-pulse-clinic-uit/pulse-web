"use client";
import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import AddDrugModal from "@/components/staff/drugs/AddDrugModal";
import ViewDrugModal from "@/components/staff/drugs/ViewDrugModal";
import UpdateDrugModal from "@/components/staff/drugs/UpdateDrugModal";
import { DOSAGE_FORMS, DRUG_UNITS } from "@/constants/drug-constants";

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

interface UserData {
    fullName?: string;
    avatarUrl?: string;
}

export default function DrugsPage() {
    const [drugs, setDrugs] = useState<Drug[]>([]);
    const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
    const [user, setUser] = useState<UserData | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        dosageForm: "",
        unit: "",
        lowStock: false,
        expired: false,
    });

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
            setFilteredDrugs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrugs();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, filters, drugs]);

    const applyFilters = useCallback(() => {
        let result = [...drugs];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (drug) =>
                    drug.name.toLowerCase().includes(query) ||
                    drug.strength?.toLowerCase().includes(query) ||
                    drug.batchNumber?.toLowerCase().includes(query)
            );
        }

        if (filters.dosageForm) {
            result = result.filter(
                (drug) => drug.dosageForm === filters.dosageForm
            );
        }

        if (filters.unit) {
            result = result.filter((drug) => drug.unit === filters.unit);
        }

        if (filters.lowStock) {
            result = result.filter(
                (drug) =>
                    drug.quantity !== null &&
                    drug.minStockLevel !== null &&
                    drug.quantity < drug.minStockLevel
            );
        }

        if (filters.expired) {
            const today = new Date();
            result = result.filter((drug) => {
                if (!drug.expiryDate) return false;
                return new Date(drug.expiryDate) < today;
            });
        }

        setFilteredDrugs(result);
    }, [searchQuery, filters, drugs]);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
    };

    const handleFilterChange = (key: string, value: string | boolean) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            dosageForm: "",
            unit: "",
            lowStock: false,
            expired: false,
        });
        setSearchQuery("");
    };

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
            <Toolbar
                buttonName="Drug"
                onAdd={() => setIsAddModalOpen(true)}
                onSearch={handleSearch}
                onFilter={() => setIsFilterOpen(true)}
            />

            {(filters.dosageForm ||
                filters.unit ||
                filters.lowStock ||
                filters.expired ||
                searchQuery) && (
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-base-content/60">
                        Active filters:
                    </span>
                    {searchQuery && (
                        <div className="badge badge-primary gap-2">
                            Search: {searchQuery}
                        </div>
                    )}
                    {filters.dosageForm && (
                        <div className="badge badge-primary gap-2">
                            Form: {filters.dosageForm}
                        </div>
                    )}
                    {filters.unit && (
                        <div className="badge badge-primary gap-2">
                            Unit: {filters.unit}
                        </div>
                    )}
                    {filters.lowStock && (
                        <div className="badge badge-warning gap-2">
                            Low Stock
                        </div>
                    )}
                    {filters.expired && (
                        <div className="badge badge-error gap-2">Expired</div>
                    )}
                    <button
                        onClick={clearFilters}
                        className="btn btn-ghost btn-xs text-error"
                    >
                        Clear All
                    </button>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : filteredDrugs.length > 0 ? (
                <>
                    <div className="text-sm text-base-content/60">
                        Showing {filteredDrugs.length} of {drugs.length} drugs
                    </div>
                    <DataTable data={filteredDrugs} columns={columns} />
                </>
            ) : (
                <div className="text-center text-gray-500 py-10">
                    {drugs.length > 0
                        ? "No drugs match your filters."
                        : "No drugs found."}
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

            <div className={`modal ${isFilterOpen ? "modal-open" : ""}`}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Filter Drugs</h3>

                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Dosage Form</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={filters.dosageForm}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "dosageForm",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">All</option>
                                {DOSAGE_FORMS.map((form) => (
                                    <option key={form.value} value={form.value}>
                                        {form.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Unit</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={filters.unit}
                                onChange={(e) =>
                                    handleFilterChange("unit", e.target.value)
                                }
                            >
                                <option value="">All</option>
                                {DRUG_UNITS.map((unit) => (
                                    <option key={unit.value} value={unit.value}>
                                        {unit.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-2">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-warning"
                                    checked={filters.lowStock}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "lowStock",
                                            e.target.checked
                                        )
                                    }
                                />
                                <span className="label-text">
                                    Low Stock Only
                                </span>
                            </label>
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-2">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-error"
                                    checked={filters.expired}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "expired",
                                            e.target.checked
                                        )
                                    }
                                />
                                <span className="label-text">Expired Only</span>
                            </label>
                        </div>
                    </div>

                    <div className="modal-action">
                        <button
                            className="btn btn-ghost"
                            onClick={clearFilters}
                        >
                            Clear All
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsFilterOpen(false)}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
