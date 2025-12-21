import { FileText } from "lucide-react";
import { Invoice } from "./InvoiceTable";

interface InvoiceSummaryProps {
  invoices: Invoice[];
}

export default function InvoiceSummary({ invoices }: InvoiceSummaryProps) {
  const pendingAmount = invoices
    .filter(i => i.status === "pending" || i.status === "overdue")
    .reduce((sum, i) => sum + parseFloat(i.amount.replace('$', '')), 0);

  const paidAmount = invoices
    .filter(i => i.status === "paid")
    .reduce((sum, i) => sum + parseFloat(i.amount.replace('$', '')), 0);

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
            <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Pending Amount</p>
            <p className="text-2xl font-bold text-yellow-600">
              ${pendingAmount.toFixed(2)}
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Paid Amount</p>
            <p className="text-2xl font-bold text-green-600">
              ${paidAmount.toFixed(2)}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}