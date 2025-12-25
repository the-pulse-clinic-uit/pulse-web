"use client";
import {
  CreditCard,
  Download,
  ArrowLeft,
  Calendar,
  User,
  MapPin,
} from "lucide-react";
import Link from "next/link";

interface Props {
  params?: { id?: string };
}

interface Patient {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  status: "Paid" | "Unpaid" | "Unknown";
  amount: number;
  doctor: string;
  service: string;
  patient: Patient;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
}

// Mock data – trong thực tế sẽ fetch từ API
const getInvoiceData = (id: string): Invoice => {
  if (!id) {
    return {
      id: "",
      date: "",
      dueDate: "",
      status: "Unknown",
      amount: 0,
      doctor: "",
      service: "",
      patient: { name: "", email: "", phone: "", address: "" },
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
    };
  }

  return {
    id,
    date: "Dec 10, 2025",
    dueDate: "Dec 24, 2025",
    status: id.includes("0042") ? "Unpaid" : "Paid",
    amount: id.includes("0042") ? 250 : 180,
    doctor: "Dr. Emily Carter",
    service: "Cardiology Checkup",
    patient: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
      address: "123 Main Street, Apt 4B, New York, NY 10001",
    },
    items: [
      { description: "Consultation Fee", quantity: 1, rate: 150, amount: 150 },
      { description: "ECG Test", quantity: 1, rate: 75, amount: 75 },
      { description: "Blood Pressure Check", quantity: 1, rate: 25, amount: 25 },
    ],
    subtotal: 250,
    tax: 0,
    total: 250,
  };
};

export default function InvoiceDetailPage({ params }: Props) {
  const id = params?.id ?? "";
  const invoice = getInvoiceData(id);

  const handlePayment = () => {
    alert("Redirecting to payment gateway...");
  };

  const handleDownload = () => {
    alert("Downloading invoice PDF...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/invoices"
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Invoices
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>

            {invoice.status === "Unpaid" && (
              <button
                onClick={handlePayment}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                Pay Now
              </button>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2">Invoice {invoice.id}</h1>
                <div className="flex items-center gap-4 text-purple-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {invoice.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {invoice.doctor}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    invoice.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {invoice.status}
                </div>
                <div className="text-2xl font-bold mt-2">${invoice.total}</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Bill To:
                </h3>
                <div className="text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">
                    {invoice.patient.name}
                  </p>
                  <p>{invoice.patient.email}</p>
                  <p>{invoice.patient.phone}</p>
                  <p className="flex items-start gap-1">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {invoice.patient.address}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Invoice Details:
                </h3>
                <div className="text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Invoice Date:</span>
                    <span className="font-medium">{invoice.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span className="font-medium">{invoice.dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{invoice.service}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Services
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-gray-600 font-medium">
                        Description
                      </th>
                      <th className="text-center py-3 text-gray-600 font-medium">
                        Qty
                      </th>
                      <th className="text-right py-3 text-gray-600 font-medium">
                        Rate
                      </th>
                      <th className="text-right py-3 text-gray-600 font-medium">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 text-gray-900">
                          {item.description}
                        </td>
                        <td className="py-3 text-center text-gray-600">
                          {item.quantity}
                        </td>
                        <td className="py-3 text-right text-gray-600">
                          ${item.rate}
                        </td>
                        <td className="py-3 text-right font-medium text-gray-900">
                          ${item.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${invoice.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax:</span>
                    <span>${invoice.tax}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900 border-t pt-2">
                    <span>Total:</span>
                    <span>${invoice.total}</span>
                  </div>
                </div>    
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}