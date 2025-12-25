import { useRouter } from "next/navigation";

interface ConfirmStepProps {
  doctorId: string | number |null;   
  date: string;                
  time: string;                
  onBack: () => void;          
}

export default function ConfirmStep({
  doctorId,
  date,
  time,
  onBack,
}: ConfirmStepProps) {
  const router = useRouter();

  const confirm = () => {
    alert("Appointment booked successfully!");
    router.push("/appointments");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h3 className="text-purple-900 font-semibold mb-4">
        Confirm Appointment
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Doctor</span>
          <span>#{doctorId}</span>
        </div>
        <div className="flex justify-between">
          <span>Date</span>
          <span>{date}</span>
        </div>
        <div className="flex justify-between">
          <span>Time</span>
          <span>{time}</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button onClick={onBack} className="px-6 py-2 border rounded-full">
          Back
        </button>
        <button
          onClick={confirm}
          className="px-6 py-2 bg-purple-500 text-white rounded-full"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
