"use client";

import { Clock, Calendar, MapPin, Eye, RotateCcw, X, Check } from "lucide-react";

interface Appointment {
  id: string;
  time: string;
  patientName: string;
  date: string;
  room: string;
  type: string;
  status: "confirmed" | "pending";
}

interface Props {
  appointment: Appointment;
  onDetails: (id: string) => void;
  onReschedule: (id: string) => void;
  onCancel: (id: string) => void;
  onAccept?: (id: string) => void;
}

export default function AppointmentCard({ 
  appointment, 
  onDetails, 
  onReschedule, 
  onCancel, 
  onAccept 
}: Props) {
  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-orange-100 text-orange-800"
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">{appointment.time}</span>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">{appointment.patientName}</h3>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{appointment.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{appointment.room}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
                {appointment.status}
              </span>
            </div>
            
            <p className="text-sm text-gray-600">{appointment.type}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDetails(appointment.id)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            Details
          </button>
          
          {appointment.status === "pending" && onAccept && (
            <button
              onClick={() => onAccept(appointment.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Check className="w-4 h-4" />
              Accept
            </button>
          )}
          
          <button
            onClick={() => onReschedule(appointment.id)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reschedule
          </button>
          
          <button
            onClick={() => onCancel(appointment.id)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}