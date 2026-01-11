"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Header from "@/components/staff/Header";
import { FileDown, RefreshCw, AlertTriangle } from "lucide-react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

interface UserData {
    fullName?: string;
    avatarUrl?: string;
}

interface Drug {
    id: string;
    name: string;
    dosageForm: string;
    unit: string;
    strength: string;
    quantity: number | null;
    minStockLevel: number | null;
    expiryDate: string | null;
    batchNumber: string | null;
}

interface ExcelRow {
    "Drug Name": string;
    Strength: string;
    "Batch No.": string;
    Quantity: number;
    "Min Stock": number | string;
    "Expiry Date"?: string;
    Urgency: string;
}

type TabType = "lowStock" | "expiring" | "outOfStock";

export default function PharmacyReportsPage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>("lowStock");
    const [loading, setLoading] = useState(true);
    const [drugs, setDrugs] = useState<Drug[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = Cookies.get("token");

            const userRes = await fetch("/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (userRes.ok) setUser(await userRes.json());

            const drugsRes = await fetch("/api/drugs", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (drugsRes.ok) {
                const data = await drugsRes.json();
                setDrugs(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getLowStockDrugs = () => {
        return drugs.filter(
            (drug) =>
                drug.quantity !== null &&
                drug.minStockLevel !== null &&
                drug.quantity < drug.minStockLevel &&
                drug.quantity > 0
        );
    };

    const getExpiringDrugs = () => {
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

        return drugs
            .filter((drug) => {
                if (!drug.expiryDate) return false;
                const expiryDate = new Date(drug.expiryDate);
                const today = new Date();
                return expiryDate > today && expiryDate <= threeMonthsFromNow;
            })
            .sort((a, b) => {
                if (!a.expiryDate || !b.expiryDate) return 0;
                return (
                    new Date(a.expiryDate).getTime() -
                    new Date(b.expiryDate).getTime()
                );
            });
    };

    const getOutOfStockDrugs = () => {
        return drugs.filter(
            (drug) => drug.quantity === 0 || drug.quantity === null
        );
    };

    const getCurrentTabData = () => {
        switch (activeTab) {
            case "lowStock":
                return getLowStockDrugs();
            case "expiring":
                return getExpiringDrugs();
            case "outOfStock":
                return getOutOfStockDrugs();
            default:
                return [];
        }
    };

    const handleExport = (format: "excel" | "pdf") => {
        const currentData = getCurrentTabData();
        const tabTitle =
            activeTab === "lowStock"
                ? "Low Stock Drugs"
                : activeTab === "expiring"
                ? "Expiring Drugs"
                : "Out of Stock Drugs";

        if (format === "pdf") {
            exportToPDF(currentData, tabTitle);
        } else {
            exportToExcel(currentData, tabTitle);
        }
    };

    const exportToPDF = (data: Drug[], title: string) => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Pharmacy Report", 14, 20);

        doc.setFontSize(14);
        doc.text(title, 14, 30);

        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 38);

        const headers: string[] = [
            "Drug Name",
            "Strength",
            "Batch No.",
            "Quantity",
            "Min Stock",
        ];

        if (activeTab === "expiring") {
            headers.push("Expiry Date");
        }
        headers.push("Urgency");

        const tableData = data.map((drug) => {
            const row = [
                drug.name,
                drug.strength || "N/A",
                drug.batchNumber || "N/A",
                (drug.quantity ?? 0).toString(),
                (drug.minStockLevel ?? "N/A").toString(),
            ];

            if (activeTab === "expiring" && drug.expiryDate) {
                row.push(new Date(drug.expiryDate).toLocaleDateString());
            } else if (activeTab === "expiring") {
                row.push("N/A");
            }

            let urgency = "";
            if (activeTab === "outOfStock") {
                urgency = "Urgent";
            } else if (activeTab === "lowStock") {
                if (drug.quantity !== null && drug.minStockLevel !== null) {
                    const percentage =
                        (drug.quantity / drug.minStockLevel) * 100;
                    if (percentage < 25) urgency = "Critical";
                    else if (percentage < 50) urgency = "Low";
                    else urgency = "Monitor";
                }
            } else if (activeTab === "expiring" && drug.expiryDate) {
                const daysUntilExpiry = Math.floor(
                    (new Date(drug.expiryDate).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                );
                if (daysUntilExpiry < 30) urgency = "Critical";
                else if (daysUntilExpiry < 60) urgency = "Warning";
                else urgency = "Soon";
            }
            row.push(urgency);

            return row;
        });

        let yPos = 48;
        const lineHeight = 7;
        const pageHeight = doc.internal.pageSize.height;

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        let xPos = 14;
        const columnWidths =
            activeTab === "expiring"
                ? [35, 25, 25, 20, 20, 25, 25]
                : [40, 30, 25, 20, 20, 30];

        headers.forEach((header, i) => {
            doc.text(header, xPos, yPos);
            xPos += columnWidths[i];
        });

        yPos += lineHeight;
        doc.setFont("helvetica", "normal");

        tableData.forEach((row) => {
            if (yPos > pageHeight - 20) {
                doc.addPage();
                yPos = 20;
            }

            xPos = 14;
            row.forEach((cell, i) => {
                const cellText =
                    cell.length > 15 ? cell.substring(0, 12) + "..." : cell;
                doc.text(cellText, xPos, yPos);
                xPos += columnWidths[i];
            });
            yPos += lineHeight;
        });

        if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = 20;
        } else {
            yPos += 10;
        }

        doc.setFont("helvetica", "bold");
        doc.text(`Total ${title}: ${data.length}`, 14, yPos);

        const fileName = `pharmacy_report_${activeTab}_${
            new Date().toISOString().split("T")[0]
        }.pdf`;
        doc.save(fileName);
    };

    const exportToExcel = (data: Drug[], title: string) => {
        const worksheetData = data.map((drug) => {
            const row: ExcelRow = {
                "Drug Name": drug.name,
                Strength: drug.strength || "N/A",
                "Batch No.": drug.batchNumber || "N/A",
                Quantity: drug.quantity ?? 0,
                "Min Stock": drug.minStockLevel ?? "N/A",
                Urgency: "",
            };

            if (activeTab === "expiring") {
                row["Expiry Date"] = drug.expiryDate
                    ? new Date(drug.expiryDate).toLocaleDateString()
                    : "N/A";
            }

            let urgency = "";
            if (activeTab === "outOfStock") {
                urgency = "Urgent";
            } else if (activeTab === "lowStock") {
                if (drug.quantity !== null && drug.minStockLevel !== null) {
                    const percentage =
                        (drug.quantity / drug.minStockLevel) * 100;
                    if (percentage < 25) urgency = "Critical";
                    else if (percentage < 50) urgency = "Low";
                    else urgency = "Monitor";
                }
            } else if (activeTab === "expiring" && drug.expiryDate) {
                const daysUntilExpiry = Math.floor(
                    (new Date(drug.expiryDate).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                );
                if (daysUntilExpiry < 30) urgency = "Critical";
                else if (daysUntilExpiry < 60) urgency = "Warning";
                else urgency = "Soon";
            }
            row["Urgency"] = urgency;

            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, title);

        const columnWidths = [
            { wch: 30 },
            { wch: 15 },
            { wch: 15 },
            { wch: 10 },
            { wch: 12 },
        ];

        if (activeTab === "expiring") {
            columnWidths.push({ wch: 15 });
        }
        columnWidths.push({ wch: 12 });

        worksheet["!cols"] = columnWidths;

        const fileName = `pharmacy_report_${activeTab}_${
            new Date().toISOString().split("T")[0]
        }.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    const handleRestock = (drugId: string) => {
        alert(`Restocking drug ${drugId}...`);
    };

    const getUrgencyBadge = (drug: Drug) => {
        if (activeTab === "outOfStock") {
            return <span className="badge badge-error">Urgent</span>;
        }

        if (activeTab === "lowStock") {
            if (drug.quantity === null || drug.minStockLevel === null)
                return null;
            const percentage = (drug.quantity / drug.minStockLevel) * 100;
            if (percentage < 25)
                return <span className="badge badge-error">Critical</span>;
            if (percentage < 50)
                return <span className="badge badge-warning">Low</span>;
            return <span className="badge badge-info">Monitor</span>;
        }

        if (activeTab === "expiring" && drug.expiryDate) {
            const daysUntilExpiry = Math.floor(
                (new Date(drug.expiryDate).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
            );
            if (daysUntilExpiry < 30)
                return <span className="badge badge-error">Critical</span>;
            if (daysUntilExpiry < 60)
                return <span className="badge badge-warning">Warning</span>;
            return <span className="badge badge-info">Soon</span>;
        }

        return null;
    };

    const tabData = getCurrentTabData();

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header
                tabName="Pharmacy Reports"
                userName={user?.fullName}
                avatarUrl={user?.avatarUrl}
            />

            <div className="tabs tabs-boxed bg-base-200 w-fit">
                <a
                    className={`tab ${
                        activeTab === "lowStock" ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveTab("lowStock")}
                >
                    Low Stock Drugs
                    {!loading && (
                        <span className="ml-2 badge badge-sm badge-warning">
                            {getLowStockDrugs().length}
                        </span>
                    )}
                </a>
                <a
                    className={`tab ${
                        activeTab === "expiring" ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveTab("expiring")}
                >
                    Expiring Drugs
                    {!loading && (
                        <span className="ml-2 badge badge-sm badge-info">
                            {getExpiringDrugs().length}
                        </span>
                    )}
                </a>
                <a
                    className={`tab ${
                        activeTab === "outOfStock" ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveTab("outOfStock")}
                >
                    Out of Stock
                    {!loading && (
                        <span className="ml-2 badge badge-sm badge-error">
                            {getOutOfStockDrugs().length}
                        </span>
                    )}
                </a>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-100 p-4 rounded-lg">
                <div className="flex gap-2">
                    <button
                        className="btn btn-sm btn-outline gap-2"
                        onClick={() => handleExport("excel")}
                    >
                        <FileDown size={16} />
                        Export Excel
                    </button>
                    <button
                        className="btn btn-sm btn-outline gap-2"
                        onClick={() => handleExport("pdf")}
                    >
                        <FileDown size={16} />
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-warning">
                            <AlertTriangle size={32} />
                        </div>
                        <div className="stat-title">Low Stock</div>
                        <div className="stat-value text-warning">
                            {getLowStockDrugs().length}
                        </div>
                        <div className="stat-desc">Need restocking soon</div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-info">
                            <AlertTriangle size={32} />
                        </div>
                        <div className="stat-title">Expiring Soon</div>
                        <div className="stat-value text-info">
                            {getExpiringDrugs().length}
                        </div>
                        <div className="stat-desc">Within 3 months</div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-error">
                            <AlertTriangle size={32} />
                        </div>
                        <div className="stat-title">Out of Stock</div>
                        <div className="stat-value text-error">
                            {getOutOfStockDrugs().length}
                        </div>
                        <div className="stat-desc">Urgent restocking</div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : tabData.length > 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-base-200">
                    <table className="table w-full">
                        <thead className="bg-base-200/50">
                            <tr>
                                <th className="text-xs">Drug Name</th>
                                <th className="text-xs">Strength</th>
                                <th className="text-xs">Batch No.</th>
                                <th className="text-xs">Quantity</th>
                                <th className="text-xs">Min Stock</th>
                                {activeTab === "expiring" && (
                                    <th className="text-xs">Expiry Date</th>
                                )}
                                <th className="text-xs">Urgency</th>
                                <th className="text-xs">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tabData.map((drug) => (
                                <tr key={drug.id} className="hover:bg-base-50">
                                    <td className="text-xs">{drug.name}</td>
                                    <td className="text-xs">
                                        {drug.strength || "N/A"}
                                    </td>
                                    <td className="text-xs">
                                        {drug.batchNumber || "N/A"}
                                    </td>
                                    <td className="text-xs">
                                        {drug.quantity ?? 0}
                                    </td>
                                    <td className="text-xs">
                                        {drug.minStockLevel ?? "N/A"}
                                    </td>
                                    {activeTab === "expiring" && (
                                        <td className="text-xs">
                                            {drug.expiryDate
                                                ? new Date(
                                                      drug.expiryDate
                                                  ).toLocaleDateString()
                                                : "N/A"}
                                        </td>
                                    )}
                                    <td className="text-xs">
                                        {getUrgencyBadge(drug)}
                                    </td>
                                    <td className="text-xs">
                                        <button
                                            className="btn btn-primary btn-xs gap-1"
                                            onClick={() =>
                                                handleRestock(drug.id)
                                            }
                                        >
                                            <RefreshCw size={12} />
                                            Restock
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center text-gray-500 py-10">
                    {activeTab === "lowStock" && "No low stock drugs found."}
                    {activeTab === "expiring" && "No expiring drugs found."}
                    {activeTab === "outOfStock" &&
                        "No out of stock drugs found."}
                </div>
            )}
        </div>
    );
}
