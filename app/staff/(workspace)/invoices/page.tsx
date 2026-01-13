"use client";
import { useCallback, useState, useEffect } from "react";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";
import AddInvoiceModal from "@/components/staff/invoices/AddInvoiceModal";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

interface UserData {
    fullName: string;
    avatarUrl: string;
}

interface PatientDTO {
    id: string;
    userDto: {
        fullName: string;
        birthDate: string;
        gender: boolean;
        phone: string;
        email: string;
        address: string;
        citizenId: string;
    };
    healthInsuranceId: string | null;
    bloodType: string;
    allergies: string;
}

type Patient = {
    id: string;
    name: string;
    birthDate: string;
    gender: "Male" | "Female";
    phoneNumber: string;
    email: string;
    healthInsurance: boolean;
};

interface InvoiceDto {
    id: string;
    status: string;
    dueDate: string;
    amountPaid: number;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    encounterDto: {
        id: string;
        type: string;
        startedAt: string;
        endedAt: string | null;
        diagnosis: string;
        notes: string;
        doctorDto: {
            id: string;
            staffDto: {
                userDto: {
                    fullName: string;
                };
            };
        };
    };
}

type Invoice = {
    id: string;
    date: string;
    service: string;
    doctorName: string;
    totalAmount: number;
    amountPaid: number;
    status: "Paid" | "Unpaid";
};

export default function InvoicesPage() {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingInvoices, setLoadingInvoices] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = useCallback(async () => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/staff/login");
            return;
        }

        try {
            const [userRes, patientRes] = await Promise.all([
                fetch("/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("/api/patients", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            if (userRes.ok) {
                const userData = await userRes.json();
                setUser(userData);
            }

            if (patientRes.ok) {
                const data = await patientRes.json();
                const formattedPatients: Patient[] = data.map(
                    (item: PatientDTO) => ({
                        id: item.id,
                        name: item.userDto.fullName || "N/A",
                        birthDate: item.userDto.birthDate || "",
                        gender: item.userDto.gender ? "Male" : "Female",
                        phoneNumber: item.userDto.phone || "",
                        email: item.userDto.email || "",
                        healthInsurance: !!item.healthInsuranceId,
                    })
                );
                setPatients(formattedPatients);
                setFilteredPatients(formattedPatients);
            } else if (patientRes.status === 401 || patientRes.status === 403) {
                Cookies.remove("token");
                router.push("/staff/login");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load patients");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredPatients(patients);
            return;
        }

        const search = searchTerm.toLowerCase();
        const result = patients.filter(
            (patient) =>
                patient.name.toLowerCase().includes(search) ||
                patient.email.toLowerCase().includes(search) ||
                patient.phoneNumber.toLowerCase().includes(search)
        );
        setFilteredPatients(result);
    }, [searchTerm, patients]);

    const fetchPatientInvoices = async (patientId: string) => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/staff/login");
            return;
        }

        setLoadingInvoices(true);
        try {
            const response = await fetch(`/api/invoices/patient/${patientId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data: InvoiceDto[] = await response.json();
                const formattedInvoices: Invoice[] = data.map((invoice) => ({
                    id: invoice.id,
                    date: formatDate(invoice.createdAt),
                    service: invoice.encounterDto.type,
                    doctorName:
                        invoice.encounterDto.doctorDto.staffDto.userDto
                            .fullName,
                    totalAmount: invoice.totalAmount,
                    amountPaid: invoice.amountPaid,
                    status: invoice.status === "PAID" ? "Paid" : "Unpaid",
                }));
                setInvoices(formattedInvoices);
            } else {
                toast.error("Failed to load invoices");
                setInvoices([]);
            }
        } catch (error) {
            console.error("Error fetching invoices:", error);
            toast.error("Failed to load invoices");
            setInvoices([]);
        } finally {
            setLoadingInvoices(false);
        }
    };

    const handlePatientClick = (patient: Patient) => {
        setSelectedPatient(patient);
        fetchPatientInvoices(patient.id);
    };

    const handleBackToPatients = () => {
        setSelectedPatient(null);
        setInvoices([]);
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString("vi-VN");
    };

    const handleAddInvoice = (newInvoice: {
        name: string;
        date: string;
        service: string;
        medication: number;
        totalAmount: number;
        paid: number;
        status: "Paid" | "Unpaid";
    }) => {
        setIsAddModalOpen(false);
    };

    const patientColumns: ColumnDef<Patient>[] = [
        { header: "ID", accessorKey: "id", className: "font-bold" },
        { header: "Name", accessorKey: "name", className: "font-medium" },
        { header: "Birth Date", accessorKey: "birthDate" },
        { header: "Gender", accessorKey: "gender" },
        { header: "Phone", accessorKey: "phoneNumber" },
        { header: "Email", accessorKey: "email" },
        {
            header: "Insurance",
            cell: (row) => (
                <span
                    className={`
                        inline-flex items-center justify-center px-3 py-1.5 rounded-full 
                        text-xs font-medium whitespace-nowrap 
                        ${
                            row.healthInsurance
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                        }
                    `}
                >
                    {row.healthInsurance ? "Yes" : "No"}
                </span>
            ),
        },
        {
            header: "Action",
            cell: (row) => (
                <button
                    onClick={() => handlePatientClick(row)}
                    className="btn btn-xs bg-purple-100 text-purple-700 border-none hover:bg-purple-200"
                >
                    View Invoices
                </button>
            ),
        },
    ];

    const invoiceColumns: ColumnDef<Invoice>[] = [
        { header: "Invoice ID", accessorKey: "id", className: "font-bold" },
        { header: "Date", accessorKey: "date" },
        { header: "Service", accessorKey: "service" },
        {
            header: "Doctor",
            accessorKey: "doctorName",
            className: "font-medium",
        },
        {
            header: "Total Amount",
            cell: (row) => `${formatCurrency(row.totalAmount)} VND`,
        },
        {
            header: "Amount Paid",
            cell: (row) => `${formatCurrency(row.amountPaid)} VND`,
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
    ];

    if (loading) {
        return (
            <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
                <Header
                    tabName="Manage Invoices"
                    userName={user?.fullName}
                    avatarUrl={user?.avatarUrl}
                />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header
                tabName="Manage Invoices"
                userName={user?.fullName}
                avatarUrl={user?.avatarUrl}
            />

            {selectedPatient ? (
                <>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBackToPatients}
                            className="flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium"
                        >
                            <ArrowLeft size={20} />
                            Back to Patients List
                        </button>
                        <div className="text-lg font-semibold text-gray-800">
                            Invoices for:{" "}
                            <span className="text-purple-700">
                                {selectedPatient.name}
                            </span>
                        </div>
                    </div>

                    {loadingInvoices ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                        </div>
                    ) : invoices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <p className="text-lg">
                                No invoices found for this patient
                            </p>
                        </div>
                    ) : (
                        <>
                            <DataTable
                                columns={invoiceColumns}
                                data={invoices}
                            />
                            <Pagination
                                currentPage={1}
                                totalPages={Math.ceil(invoices.length / 10)}
                                onPageChange={() => {}}
                            />
                        </>
                    )}
                </>
            ) : (
                <>
                    <Toolbar
                        buttonName="Invoice"
                        onSearch={handleSearch}
                        onFilter={() => {}}
                        onAdd={() => setIsAddModalOpen(true)}
                    />
                    <DataTable
                        columns={patientColumns}
                        data={filteredPatients}
                    />
                    <Pagination
                        currentPage={1}
                        totalPages={Math.ceil(filteredPatients.length / 10)}
                        onPageChange={() => {}}
                    />
                </>
            )}

            <AddInvoiceModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddInvoice}
            />
        </div>
    );
}
