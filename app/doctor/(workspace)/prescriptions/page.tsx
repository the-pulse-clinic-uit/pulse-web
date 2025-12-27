import PrescriptionHeader from "@/components/doctor/prescriptions/PrescriptionHeader";
import PrescriptionList from "@/components/doctor/prescriptions/PrescriptionList";

export default function ManagePrescriptionPage() {
  return (
    <div className="space-y-6">
      <PrescriptionHeader />
      <PrescriptionList />
    </div>
  );
}