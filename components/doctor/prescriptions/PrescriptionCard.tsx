import { User, Calendar, Pill, MoreVertical } from "lucide-react";

interface Props {
  id: string;
  patientName: string;
  medication: string;
  dosage: string;
  duration: string;
  date: string;
  status: "active" | "completed" | "expired";
  refills: number;
}

export default function PrescriptionCard({
  id,
  patientName,
  medication,
  dosage,
  duration,
  date,
  status,
  refills
}: Props) {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "expired":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex items-center justify-between bg-white border rounded-xl p-6 hover:shadow-sm transition-shadow">
      <div className="flex gap-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Pill className="w-6 h-6 text-blue-600" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">#{id}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900">{patientName}</span>
          </div>

          <p className="text-sm text-gray-600">
            <span className="font-medium">Medication:</span> {medication}
          </p>

          <div className="flex gap-6 text-sm text-gray-500">
            <div>
              <span className="font-medium">Dosage:</span> {dosage}
            </div>
            <div>
              <span className="font-medium">Duration:</span> {duration}
            </div>
            <div>
              <span className="font-medium">Refills:</span> {refills}
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Prescribed on {date}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {status === "active" && (
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            Refill
          </button>
        )}
        
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}