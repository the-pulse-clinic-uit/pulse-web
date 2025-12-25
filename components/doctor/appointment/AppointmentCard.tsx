import { Calendar, Clock, User, FileText, Play, Check, X } from "lucide-react";

type AppointmentType = 'upcoming' | 'pending' | 'past' | 'cancelled';

export default function AppointmentCard({
  data,
  type,
}: {
  data: {
    date: string;
    time: string;
    patient: string;
    issue: string;
  };
  type: AppointmentType;
}) {
  const renderAction = () => {
    if (type === 'upcoming') {
      return (
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          <Play className="w-4 h-4" />
          Start
        </button>
      );
    }

    if (type === 'pending') {
      return (
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors">
            <Check className="w-4 h-4" />
            Approve
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
            <X className="w-4 h-4" />
            Decline
          </button>
        </div>
      );
    }

    return null;
  };

  const getStatusColor = () => {
    switch (type) {
      case 'upcoming': return 'border-l-blue-500';
      case 'pending': return 'border-l-orange-500';
      case 'past': return 'border-l-green-500';
      case 'cancelled': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 ${getStatusColor()} hover:shadow-xl transition-shadow`}>
      <div className="flex justify-between items-start">
        <div className="flex gap-6">
          <div className="text-center bg-gray-50 rounded-lg p-3 min-w-[80px]">
            <div className="text-sm text-gray-500 mb-1">{data.date.split(' ')[0]}</div>
            <div className="text-2xl font-bold text-gray-900">{data.date.split(' ')[1]}</div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{data.time}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-900">{data.patient}</span>
            </div>
            
            <div className="text-sm text-gray-600">
              <span className="font-medium">Issue:</span> {data.issue}
            </div>
            
            <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors">
              <FileText className="w-4 h-4" />
              View Documents
            </button>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            type === 'upcoming' ? 'bg-blue-100 text-blue-800' :
            type === 'pending' ? 'bg-orange-100 text-orange-800' :
            type === 'past' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
          
          {renderAction()}
        </div>
      </div>
    </div>
  );
}
