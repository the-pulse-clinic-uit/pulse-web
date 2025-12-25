import { User, Clock, Calendar, MoreVertical } from "lucide-react";

interface Props {
  patientName: string;
  issue: string;
  time: string;
  date: string;
}

export default function EncounterCard({
  patientName,
  issue,
  time,
  date,
}: Props) {
  return (
    <div className="flex items-center justify-between bg-white border rounded-xl p-4 hover:shadow-sm transition-shadow">
      <div className="flex gap-4">
        <div className="text-center min-w-[50px]">
          <p className="text-xs text-gray-500 uppercase">Thu</p>
          <p className="text-lg font-semibold text-gray-900">15</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900">{patientName}</span>
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-medium">Issue:</span> {issue}
          </div>

          <div className="flex gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{date}</span>
            </div>
          </div>

          <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
            Follow-up Plan
          </button>
        </div>
      </div>
      
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <MoreVertical className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}