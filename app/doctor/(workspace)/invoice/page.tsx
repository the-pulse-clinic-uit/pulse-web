"use client";

import { useState } from "react";
import InvoiceHeader from "@/components/doctor/invoice/InvoiceHeader";
import InvoiceFilters from "@/components/doctor/invoice/InvoiceFilters";
import InvoiceTable, { Invoice } from "@/components/doctor/invoice/InvoiceTable";
import InvoiceSummary from "@/components/doctor/invoice/InvoiceSummary";

export default function DoctorInvoicePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "pending" | "overdue">("all");

  const invoices: Invoice[] = [
    {
      id: "INV-2025-001",
      patientName: "John Smith",
      date: "Dec 20, 2025",
      amount: "$250.00",
      status: "paid",
      services: "Consultation, ECG Test"
    },
    {
      id: "INV-2025-002",
      patientName: "Sarah Johnson",
      date: "Dec 19, 2025",
      amount: "$180.00",
      status: "pending",
      services: "Follow-up Visit"
    },
    {
      id: "INV-2025-003",
      patientName: "Michael Brown",
      date: "Dec 15, 2025",
      amount: "$320.00",
      status: "overdue",
      services: "Consultation, Blood Test"
    },
    {
      id: "INV-2025-004",
      patientName: "Emily Davis",
      date: "Dec 18, 2025",
      amount: "$150.00",
      status: "paid",
      services: "Consultation"
    }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || invoice.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 pt-6 pb-12">
      <InvoiceHeader />
      
      <InvoiceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      <InvoiceTable invoices={filteredInvoices} />

      <InvoiceSummary invoices={invoices} />
    </div>
  );
}