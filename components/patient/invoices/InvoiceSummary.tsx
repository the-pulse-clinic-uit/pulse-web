"use client";

import { CreditCard, DollarSign, Calendar } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

interface InvoiceDto {
  id: string;
  status: string;
  dueDate: string;
  amountPaid: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export default function InvoiceSummary() {
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      const token = Cookies.get("token");
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

  const totalUnpaid = invoices
    .filter((i) => i.status === "UNPAID")
    .reduce((s, i) => s + (i.totalAmount - i.amountPaid), 0);

  const totalPaid = invoices
    .filter((i) => i.status === "PAID")
    .reduce((s, i) => s + i.amountPaid, 0);

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-4 animate-pulse">
          <div className="w-8 h-8 bg-gray-200 rounded-xl mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 animate-pulse">
          <div className="w-8 h-8 bg-gray-200 rounded-xl mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 animate-pulse">
          <div className="w-8 h-8 bg-gray-200 rounded-xl mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-8">
      <Card
        title="Amount Due"
        value={`$${totalUnpaid.toFixed(2)}`}
        icon={<CreditCard className="w-4 h-4 text-white" />}
        color="from-orange-400 to-orange-500"
      />
      <Card
        title="Total Paid"
        value={`$${totalPaid.toFixed(2)}`}
        icon={<DollarSign className="w-4 h-4 text-white" />}
        color="from-green-400 to-green-500"
      />
      <Card
        title="Total Invoices"
        value={invoices.length.toString()}
        icon={<Calendar className="w-4 h-4 text-white" />}
        color="from-purple-400 to-purple-500"
      />
    </div>
  );
}

interface CardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
}

function Card({ title, value, icon, color }: CardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <div
        className={`w-8 h-8 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-3`}
      >
        {icon}
      </div>
      <h3 className="text-purple-900 mb-1 text-sm font-medium">{title}</h3>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
