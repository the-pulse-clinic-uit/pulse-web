import Link from "next/link";
import { CreditCard, Calendar, ChevronRight } from "lucide-react";

interface Invoice {
  id: string;
  description: string;
  date: string;
  amount: number;
  status: "Paid" | "Unpaid";
}

interface InvoiceItemProps {
  invoice: Invoice;
}

export default function InvoiceItem({ invoice }: InvoiceItemProps) {
  return (
    <Link
      href={`/invoices/${invoice.id}`}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition"
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          invoice.status === "Unpaid" ? "bg-orange-100" : "bg-green-100"
        }`}
      >
        <CreditCard
          className={`w-5 h-5 ${
            invoice.status === "Unpaid" ? "text-orange-600" : "text-green-600"
          }`}
        />
      </div>

      <div className="flex-1">
        <h4 className="text-purple-900 text-sm font-medium">{invoice.id}</h4>
        <p className="text-gray-600 text-xs">{invoice.description}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          {invoice.date}
        </div>
      </div>

      <div className="text-right">
        <p className="text-lg font-semibold text-purple-900">
          ${invoice.amount}
        </p>
      </div>

      <ChevronRight className="w-4 h-4 text-gray-400" />
    </Link>
  );
}
