"use client";
import { useState, useEffect, use } from "react";
import {
  CreditCard,
  Download,
  ArrowLeft,
  Calendar,
  User,
  Pill,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import Cookies from "js-cookie";

interface Props {
  params: Promise<{ id: string }>;
}

interface PrescriptionDetail {
  id: string;
  dose: string;
  frequency: string;
  timing: string;
  duration: string;
  quantity: number;
  instructions: string;
  drugDto: {
    id: string;
    name: string;
    dosageForm: string;
    unit: string;
    strength: string;
    unitPrice: number;
  };
}

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
    patientDto: {
      id: string;
      healthInsuranceId: string;
      bloodType: string;
      allergies: string;
      userDto: {
        id: string;
        email: string;
        fullName: string;
        citizenId: string;
        phone: string;
        gender: boolean;
        birthDate: string;
      };
    };
    doctorDto: {
      id: string;
      licenseId: string;
      staffDto: {
        userDto: {
          id: string;
          fullName: string;
          email: string;
          phone: string;
        };
      };
      departmentDto: {
        id: string;
        name: string;
        description: string;
      } | null;
    };
    prescriptionDto?: {
      id: string;
      createdAt: string;
      prescriptionDetails: PrescriptionDetail[];
    };
  };
}

export default function InvoiceDetailPage({ params }: Props) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<InvoiceDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceDetail = async () => {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Please login to view invoice details");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/invoices/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch invoice details");
        }

        const data: InvoiceDto = await response.json();
        setInvoice(data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load invoice details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoiceDetail();
    }
  }, [id]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePayment = async () => {
    if (!invoice) return;

    const token = Cookies.get("token");
    if (!token) {
      toast.error("Please login to make payment");
      return;
    }

    try {
      // Call the create-payment endpoint to get VNPay redirect URL
      const response = await fetch(`/api/invoices/${invoice.id}/create-payment`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      // Parse the JSON response
      const responseText = await response.text();
      const paymentData = JSON.parse(responseText);

      // Extract the payment URL from the nested JSON structure
      const vnpayUrl = paymentData.data.paymentUrl;

      if (!vnpayUrl) {
        throw new Error("Payment URL not found in response");
      }

      // Redirect to VNPay payment gateway
      window.location.href = vnpayUrl;
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create payment"
      );
    }
  };

  const handleDownload = () => {
    if (!invoice) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice", pageWidth / 2, yPosition, { align: "center" });

    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice #${invoice.id.substring(0, 8)}`, pageWidth / 2, yPosition, { align: "center" });

    // Patient Information
    yPosition += 15;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 20, yPosition);

    yPosition += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.encounterDto.patientDto.userDto.fullName, 20, yPosition);
    yPosition += 5;
    doc.text(invoice.encounterDto.patientDto.userDto.email, 20, yPosition);
    yPosition += 5;
    doc.text(invoice.encounterDto.patientDto.userDto.phone, 20, yPosition);

    // Invoice Details
    yPosition += 15;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Details:", 20, yPosition);

    yPosition += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${formatDate(invoice.createdAt)}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Doctor: ${invoice.encounterDto.doctorDto.staffDto.userDto.fullName}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Service: ${invoice.encounterDto.type}`, 20, yPosition);

    // Prescription Details
    if (invoice.encounterDto.prescriptionDto?.prescriptionDetails) {
      yPosition += 15;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Prescribed Medications:", 20, yPosition);

      yPosition += 10;
      invoice.encounterDto.prescriptionDto.prescriptionDetails.forEach((detail, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${detail.drugDto.name}`, 20, yPosition);
        yPosition += 6;

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Quantity: ${detail.quantity} | Unit Price: $${detail.drugDto.unitPrice.toFixed(2)}`, 25, yPosition);
        yPosition += 5;
        doc.text(`Total: $${(detail.quantity * detail.drugDto.unitPrice).toFixed(2)}`, 25, yPosition);
        yPosition += 8;
      });
    }

    // Total
    yPosition += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: $${invoice.totalAmount.toFixed(2)}`, 20, yPosition);

    if (invoice.amountPaid > 0) {
      yPosition += 7;
      doc.text(`Amount Paid: $${invoice.amountPaid.toFixed(2)}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Balance: $${(invoice.totalAmount - invoice.amountPaid).toFixed(2)}`, 20, yPosition);
    }

    doc.save(`invoice-${invoice.id.substring(0, 8)}.pdf`);
    toast.success("Invoice downloaded successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice not found</h2>
          <Link href="/invoices" className="text-purple-600 hover:underline">
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = invoice.status === "PAID";
  const remainingAmount = invoice.totalAmount - invoice.amountPaid;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
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

            {!isPaid && (
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
                <h1 className="text-2xl font-bold mb-2">
                  Invoice #{invoice.id.substring(0, 8)}
                </h1>
                <div className="flex items-center gap-4 text-purple-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(invoice.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {invoice.encounterDto.doctorDto.staffDto.userDto.fullName}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    isPaid
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {isPaid ? "Paid" : "Unpaid"}
                </div>
                <div className="text-2xl font-bold mt-2">
                  ${invoice.totalAmount.toFixed(2)}
                </div>
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
                    {invoice.encounterDto.patientDto.userDto.fullName}
                  </p>
                  <p>{invoice.encounterDto.patientDto.userDto.email}</p>
                  <p>{invoice.encounterDto.patientDto.userDto.phone}</p>
                  <p className="text-sm">
                    Blood Type: {invoice.encounterDto.patientDto.bloodType}
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
                    <span className="font-medium">{formatDate(invoice.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span className="font-medium">{formatDate(invoice.dueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Encounter Type:</span>
                    <span className="font-medium">{invoice.encounterDto.type}</span>
                  </div>
                  {invoice.encounterDto.doctorDto.departmentDto && (
                    <div className="flex justify-between">
                      <span>Department:</span>
                      <span className="font-medium">
                        {invoice.encounterDto.doctorDto.departmentDto.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            
            {invoice.encounterDto.diagnosis && (
              <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Diagnosis</h3>
                <p className="text-gray-900">{invoice.encounterDto.diagnosis}</p>
              </div>
            )}

            
            {invoice.encounterDto.prescriptionDto?.prescriptionDetails && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-purple-600" />
                  Prescribed Medications
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 text-gray-600 font-medium">
                          Medication
                        </th>
                        <th className="text-center py-3 text-gray-600 font-medium">
                          Qty
                        </th>
                        <th className="text-right py-3 text-gray-600 font-medium">
                          Unit Price
                        </th>
                        <th className="text-right py-3 text-gray-600 font-medium">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.encounterDto.prescriptionDto.prescriptionDetails.map(
                        (detail) => (
                          <tr key={detail.id} className="border-b border-gray-100">
                            <td className="py-3 text-gray-900">
                              <div>
                                <p className="font-medium">{detail.drugDto.name}</p>
                                <p className="text-xs text-gray-500">
                                  {detail.drugDto.strength} - {detail.drugDto.dosageForm}
                                </p>
                                {detail.instructions && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {detail.instructions}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="py-3 text-center text-gray-600">
                              {detail.quantity}
                            </td>
                            <td className="py-3 text-right text-gray-600">
                              ${detail.drugDto.unitPrice.toFixed(2)}
                            </td>
                            <td className="py-3 text-right font-medium text-gray-900">
                              ${(detail.quantity * detail.drugDto.unitPrice).toFixed(2)}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-end">
                <div className="w-full md:w-96 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Amount:</span>
                    <span className="font-semibold">${invoice.totalAmount.toFixed(2)}</span>
                  </div>
                  {invoice.amountPaid > 0 && (
                    <>
                      <div className="flex justify-between text-gray-600">
                        <span>Amount Paid:</span>
                        <span className="font-semibold text-green-600">
                          ${invoice.amountPaid.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                        <span>Balance Due:</span>
                        <span className="text-orange-600">
                          ${remainingAmount.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                  {!isPaid && invoice.amountPaid === 0 && (
                    <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                      <span>Amount Due:</span>
                      <span className="text-orange-600">
                        ${invoice.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  
                  {!isPaid && (
                    <div className="pt-4">
                      <button
                        onClick={handlePayment}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg shadow-lg"
                      >
                        <CreditCard className="w-5 h-5" />
                        Pay ${remainingAmount > 0 ? remainingAmount.toFixed(2) : invoice.totalAmount.toFixed(2)}
                      </button>
                    </div>
                  )}

                  
                  {isPaid && (
                    <div className="pt-4">
                      <div className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-lg font-semibold border-2 border-green-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Paid in Full
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}