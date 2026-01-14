import { Calendar } from "lucide-react";

interface DateStepProps {
  date: string;
  onChangeDate: (date: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function DateStep({
  date,
  onChangeDate,
  onBack,
  onNext,
}: DateStepProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h3 className="flex items-center gap-2 text-purple-900 mb-3">
          <Calendar size={18} /> Select Date
        </h3>
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => onChangeDate(e.target.value)}
          className="w-full border rounded-full px-4 py-2"
        />
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={onBack} className="px-6 py-2 border rounded-full">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!date}
          className={`px-6 py-2 rounded-full
          ${
            date
              ? "bg-purple-500 text-white"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
}