import { User, Calendar, Pill, MoreVertical, FileText } from "lucide-react";

interface PrescriptionDetail {
    id: string;
    dose: string;
    frequency: string;
    timing: string;
    instructions: string;
    quantity: number;
    unitPrice: number;
    itemTotalPrice: number;
    drugDto: {
        id: string;
        name: string;
        dosageForm: string;
        unit: string;
        strength: string;
        unitPrice: number;
    };
}

interface Props {
    id: string;
    patientName: string;
    diagnosis: string;
    totalPrice: number;
    date: string;
    status: "DRAFT" | "DISPENSED" | "CANCELLED";
    prescriptionDetails: PrescriptionDetail[];
}

export default function PrescriptionCard({
    id,
    patientName,
    diagnosis,
    totalPrice,
    date,
    status,
    prescriptionDetails,
}: Props) {
    const getStatusColor = () => {
        switch (status) {
            case "DISPENSED":
                return "bg-blue-100 text-blue-700";
            case "CANCELLED":
                return "bg-red-100 text-red-700";
            case "DRAFT":
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    const getStatusLabel = () => {
        switch (status) {
            case "DISPENSED":
                return "Dispensed";
            case "CANCELLED":
                return "Cancelled";
            case "DRAFT":
            default:
                return "Draft";
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatCurrency = (amount: number): string => {
        return amount.toLocaleString("vi-VN") + " VND";
    };

    return (
        <div className="bg-white border rounded-xl p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex gap-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Pill className="w-6 h-6 text-primary" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500">
                                #{id.slice(0, 8)}
                            </span>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
                            >
                                {getStatusLabel()}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">
                                {patientName}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span>
                                <span className="font-medium">Diagnosis:</span>{" "}
                                {diagnosis || "N/A"}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>Prescribed on {formatDate(date)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-semibold text-primary">
                            {formatCurrency(totalPrice)}
                        </p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">
                    Medications ({prescriptionDetails.length})
                </p>
                <div className="space-y-2">
                    {prescriptionDetails.slice(0, 3).map((detail) => (
                        <div
                            key={detail.id}
                            className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                                    <Pill className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">
                                        {detail.drugDto.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {detail.drugDto.strength} •{" "}
                                        {detail.dose} • {detail.frequency}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    x{detail.quantity}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatCurrency(detail.itemTotalPrice)}
                                </p>
                            </div>
                        </div>
                    ))}
                    {prescriptionDetails.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                            +{prescriptionDetails.length - 3} more medications
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
