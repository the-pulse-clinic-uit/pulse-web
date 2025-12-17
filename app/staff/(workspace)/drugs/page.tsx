"use client";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";

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

const drugData: Drug[] = [
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
            cell: () => (
                <button className="btn btn-primary btn-sm text-xs">
                    Detail
                </button>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header tabName="Drug Catalog" userName="Nguyen Huu Duy" />
            <Toolbar buttonName="Add Drug" onFilter={() => {}} />
            <DataTable data={drugData} columns={columns} />
            <Pagination
                currentPage={1}
                totalPages={10}
                onPageChange={() => {}}
            />
        </div>
    );
}
