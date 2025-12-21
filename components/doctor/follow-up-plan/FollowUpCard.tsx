import { User, Clock, Calendar, AlertCircle, CheckCircle, MoreVertical } from "lucide-react";

interface Props {
  patientName: string;
  condition: string;
  nextVisit: string;
  status: "pending" | "completed" | "overdue";
  priority: "high" | "medium" | "low";
  notes: string;
}

export default function FollowUpCard({
  patientName,
  condition,
  nextVisit,
  status,
  priority,
  notes,
}: Props) {
  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "overdue":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "overdue":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="bg-white border rounded-xl p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-900">{patientName}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor()}`}>
              {priority.toUpperCase()}
            </span>
          </div>

          <div className="space-y-2 mb-3">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Condition:</span> {condition}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar className="w-3 h-3" />
              <span className="font-medium">Next Visit:</span> {nextVisit}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Notes:</span> {notes}
            </div>
          </div>

          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor()}`}>
            {getStatusIcon()}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}