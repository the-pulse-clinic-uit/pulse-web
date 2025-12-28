"use client";

import { Calendar, DollarSign, FileText, User, CreditCard } from "lucide-react";

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
            userDto: {
                fullName: string;
            };
        };
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

interface Props {
    invoice: InvoiceDto;
}

export default function InvoiceCard({ invoice }: Props) {
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const isPaid = invoice.status === "PAID";
    const remainingAmount = invoice.totalAmount - invoice.amountPaid;

    return (
        <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isPaid ? "bg-green-100" : "bg-red-100"
                        }`}>
                            <FileText className={`w-6 h-6 ${
                                isPaid ? "text-green-600" : "text-red-600"
                            }`} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">
                                Invoice #{invoice.id.substring(0, 8)}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Encounter: {invoice.encounterDto.id.substring(0, 8)}
                            </p>
                        </div>
                    </div>
                    {isPaid ? (
                        <span className="badge badge-success">Paid</span>
                    ) : (
                        <span className="badge badge-error">Unpaid</span>
                    )}
                </div>

                {/* Invoice Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Doctor</p>
                            <p className="text-sm font-medium">
                                {invoice.encounterDto.doctorDto.staffDto.userDto.fullName}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Due Date</p>
                            <p className="text-sm font-medium">
                                {formatDate(invoice.dueDate)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Total Amount</p>
                            <p className="text-sm font-medium">
                                ${invoice.totalAmount.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Amount Paid</p>
                            <p className="text-sm font-medium">
                                ${invoice.amountPaid.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Diagnosis */}
                {invoice.encounterDto.diagnosis && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                        <p className="text-xs text-gray-500 mb-1">Diagnosis</p>
                        <p className="text-sm">{invoice.encounterDto.diagnosis}</p>
                    </div>
                )}

                {/* Remaining Amount */}
                {!isPaid && remainingAmount > 0 && (
                    <div className="alert alert-warning py-2">
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <p className="text-xs font-semibold">Amount Due</p>
                                <p className="text-lg font-bold">
                                    ${remainingAmount.toFixed(2)}
                                </p>
                            </div>
                            <button className="btn btn-sm btn-primary">
                                Pay Now
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer - Creation Date */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Created on {formatDate(invoice.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    );
}
