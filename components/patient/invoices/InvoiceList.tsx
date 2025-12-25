import InvoiceItem from './InvoiceItem';

const invoices = [
  {
    id: 'INV-2025-0042',
    date: 'Dec 10, 2025',
    description: 'Cardiology Checkup - Dr. Emily Carter',
    amount: 250,
    status: 'Unpaid',
    dueDate: 'Dec 24, 2025',
  },
  {
    id: 'INV-2025-0038',
    date: 'Nov 22, 2025',
    description: 'Annual Physical - Dr. Michael Chen',
    amount: 180,
    status: 'Paid',
    paidDate: 'Nov 25, 2025',
  },
];

export default function InvoiceList() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-purple-900 mb-4 text-lg font-semibold">All Invoices</h2>
      <div className="space-y-3">
        {invoices.map(inv => (
          <InvoiceItem key={inv.id} invoice={inv} />
        ))}
      </div>
    </div>
  );
}
