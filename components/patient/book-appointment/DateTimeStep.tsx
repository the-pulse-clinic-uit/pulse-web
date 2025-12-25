import { Calendar, Clock } from "lucide-react";

const timeSlots = [
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM",
  "02:00 PM","02:30 PM","03:00 PM","03:30 PM",
];

interface DateTimeStepProps {
  date: string;                          
  time: string;                          
  onChangeDate: (date: string) => void; 
  onChangeTime: (time: string) => void;  
  onBack: () => void;                    
  onNext: () => void;                    
}

export default function DateTimeStep({
  date,
  time,
  onChangeDate,
  onChangeTime,
  onBack,
  onNext,
}: DateTimeStepProps) {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="flex items-center gap-2 text-purple-900 mb-3">
            <Calendar size={18} /> Select Date
          </h3>
          <input
            type="date"
            value={date}
            onChange={(e) => onChangeDate(e.target.value)}
            className="w-full border rounded-full px-4 py-2"
          />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="flex items-center gap-2 text-purple-900 mb-3">
            <Clock size={18} /> Select Time
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((t) => (
              <button
                key={t}
                onClick={() => onChangeTime(t)}
                className={`py-2 rounded-full text-sm
                ${
                  time === t
                    ? "bg-purple-500 text-white"
                    : "bg-purple-50 text-purple-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={onBack} className="px-6 py-2 border rounded-full">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!date || !time}
          className={`px-6 py-2 rounded-full
          ${
            date && time
              ? "bg-purple-500 text-white"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          Continue
        </button>
      </div>
    </>
  );
}
