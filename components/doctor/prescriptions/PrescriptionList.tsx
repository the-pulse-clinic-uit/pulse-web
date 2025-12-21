import PrescriptionCard from "./PrescriptionCard";

const prescriptions = [
  {
    id: "RX-001",
    patientName: "Sarah Johnson",
    medication: "Lisinopril 10mg",
    dosage: "Once daily",
    duration: "30 days",
    date: "Dec 20, 2025",
    status: "active" as const,
    refills: 2
  },
  {
    id: "RX-002", 
    patientName: "Michael Chen",
    medication: "Metformin 500mg",
    dosage: "Twice daily",
    duration: "90 days",
    date: "Dec 18, 2025",
    status: "active" as const,
    refills: 5
  },
  {
    id: "RX-003",
    patientName: "Emily Davis", 
    medication: "Amoxicillin 250mg",
    dosage: "Three times daily",
    duration: "7 days",
    date: "Dec 15, 2025",
    status: "completed" as const,
    refills: 0
  },
  {
    id: "RX-004",
    patientName: "Robert Wilson",
    medication: "Atorvastatin 20mg", 
    dosage: "Once daily",
    duration: "30 days",
    date: "Dec 10, 2025",
    status: "expired" as const,
    refills: 1
  }
];

export default function PrescriptionList() {
  return (
    <div className="space-y-4">
      {prescriptions.length > 0 ? (
        prescriptions.map((prescription) => (
          <PrescriptionCard key={prescription.id} {...prescription} />
        ))
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-gray-500">No prescriptions found</p>
        </div>
      )}
    </div>
  );
}