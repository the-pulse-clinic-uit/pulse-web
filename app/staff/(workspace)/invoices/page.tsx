"use client";
import { useCallback, useState } from "react";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";
import AddInvoiceModal from "@/components/staff/invoices/AddInvoiceModal";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import router from "next/router";

type Invoice = {
    id: string;
    name: string;
    date: string;
    service: string;
    medication: number;
    totalAmount: number;
    paid: number;
    status: "Paid" | "Unpaid";
};

const mockInvoiceData: Invoice[] = [
    {
        id: "#001",
        name: "Nguyen Van Anh",
        date: "15/05/2025",
        service: "General Check-up",
        medication: 3,
        totalAmount: 128000,
        paid: 0,
        status: "Unpaid",
    },
    {
        id: "#002",
        name: "Tran Thi B",
        date: "16/05/2025",
        service: "Blood Test",
        medication: 2,
        totalAmount: 250000,
        paid: 0,
        status: "Unpaid",
    },
    {
        id: "#003",
        name: "Le Van C",
        date: "17/05/2025",
        service: "X-Ray",
        medication: 1,
        totalAmount: 350000,
        paid: 350000,
        status: "Paid",
    },
    {
        id: "#004",
        name: "Pham Van D",
        date: "18/05/2025",
        service: "Consultation",
        medication: 5,
        totalAmount: 180000,
        paid: 180000,
        status: "Paid",
    },
    {
        id: "#005",
        name: "Hoang Thi E",
        date: "19/05/2025",
        service: "General Check-up",
        medication: 3,
        totalAmount: 128000,
        paid: 0,
        status: "Unpaid",
    },
];

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState(mockInvoiceData);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const handleDetail = (invoice: Invoice) => {
        console.log("View details for invoice:", invoice.id);
    };

    const fetchUserData = useCallback(async () => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/staff/login");
            return;
        }

        try {
            const userRes = await fetch("/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (userRes.ok) {
                const userData = await userRes.json();
                setUser(userData);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }, [router]);
    fetchUserData();

    const handleAddInvoice = (newInvoice: {
        name: string;
        date: string;
        service: string;
        medication: number;
        totalAmount: number;
        paid: number;
        status: "Paid" | "Unpaid";
    }) => {
        const newId = `#${String(invoices.length + 1).padStart(3, "0")}`;
        const invoice: Invoice = {
            id: newId,
            ...newInvoice,
        };
        setInvoices((prev) => [...prev, invoice]);
        setIsAddModalOpen(false);
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString("vi-VN");
    };

    const invoiceColumns: ColumnDef<Invoice>[] = [
        { header: "ID", accessorKey: "id", className: "font-bold" },
        { header: "Name", accessorKey: "name", className: "font-medium" },
        { header: "Date", accessorKey: "date" },
        { header: "Service", accessorKey: "service" },
        { header: "Medication", accessorKey: "medication" },
        {
            header: "Total Amount",
            cell: (row) => formatCurrency(row.totalAmount),
        },
        {
            header: "Paid",
            cell: (row) => formatCurrency(row.paid),
        },
        {
            header: "Status",
            cell: (row) => (
                <span
                    className={`
                        inline-flex items-center justify-center px-3 py-1.5 rounded-full 
                        text-xs font-medium whitespace-nowrap 
                        ${
                            row.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                        }
                    `}
                >
                    {row.status}
                </span>
            ),
        },
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
            <Header
                tabName="Manage Invoices"
                userName={user?.fullName}
                avatarUrl={user?.avatarUrl}
            />
            <Toolbar
                buttonName="Invoice"
                onSearch={() => {}}
                onFilter={() => {}}
                onAdd={() => setIsAddModalOpen(true)}
            />
            <DataTable columns={invoiceColumns} data={invoices} />
            <Pagination
                currentPage={1}
                totalPages={10}
                onPageChange={() => {}}
            />

            <AddInvoiceModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddInvoice}
            />
        </div>
    );
}
