import InvoiceSummary from "@/components/patient/invoices/InvoiceSummary";
import InvoiceList from "@/components/patient/invoices/InvoiceList";

export default function InvoicesPage() {
    return (
        <div className="min-h-screen mt-8">
            <div className="max-w-7xl mx-auto px-4 py-4 pt-20">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold text-purple-900 mb-2">
                        Invoices & Payments
                    </h1>
                    <p className="text-gray-600">
                        View and manage your billing information
                    </p>
                </div>

                <InvoiceSummary />
                <InvoiceList />
            </div>
        </div>
    );
}
