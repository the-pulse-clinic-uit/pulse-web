"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import InvoiceItem from './InvoiceItem';

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

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view invoices");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/invoices/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch invoices");
        }

        const data: InvoiceDto[] = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load invoices"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const transformInvoice = (invoice: InvoiceDto) => ({
    id: invoice.id,
    date: formatDate(invoice.createdAt),
    description: `${invoice.encounterDto.type} - Dr. ${invoice.encounterDto.doctorDto.staffDto.userDto.fullName}`,
    amount: invoice.totalAmount,
    status: invoice.status === "PAID" ? "Paid" as const : "Unpaid" as const,
  });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-purple-900 mb-4 text-lg font-semibold">All Invoices</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-purple-900 mb-4 text-lg font-semibold">All Invoices</h2>
      {invoices.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No invoices found
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map(inv => (
            <InvoiceItem key={inv.id} invoice={transformInvoice(inv)} />
          ))}
        </div>
      )}
    </div>
  );
}
