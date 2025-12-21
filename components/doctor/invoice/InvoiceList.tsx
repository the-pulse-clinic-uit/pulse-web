import InvoiceCard from "./InvoiceCard";

const InvoiceList = () => {
  const invoices = [
    {
      date: "15/05/2025",
      patient: "Stephine Claire",
      invoiceId: "INV-001",
      total: "128.000",
    },
    {
      date: "16/05/2025",
      patient: "John Doe",
      invoiceId: "INV-002",
      total: "256.000",
    },
  ];

  return (
    <div>
      {invoices.map((inv, idx) => (
        <InvoiceCard key={idx} {...inv} />
      ))}
    </div>
  );
};

export default InvoiceList;
