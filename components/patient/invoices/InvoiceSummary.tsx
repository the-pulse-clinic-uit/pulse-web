import { CreditCard, DollarSign, Calendar } from "lucide-react";
import { ReactNode } from "react";

const invoices = [
  { amount: 250, status: "Unpaid" },
  { amount: 180, status: "Paid" },
  { amount: 150, status: "Paid" },
  { amount: 120, status: "Paid" },
  { amount: 200, status: "Paid" },
];

export default function InvoiceSummary() {
  const totalUnpaid = invoices
    .filter((i) => i.status === "Unpaid")
    .reduce((s, i) => s + i.amount, 0);

  const totalPaid = invoices
    .filter((i) => i.status === "Paid")
    .reduce((s, i) => s + i.amount, 0);

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-8">
      <Card
        title="Amount Due"
        value={`$${totalUnpaid}`}
        icon={<CreditCard className="w-4 h-4 text-white" />}
        color="from-orange-400 to-orange-500"
      />
      <Card
        title="Total Paid"
        value={`$${totalPaid}`}
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
