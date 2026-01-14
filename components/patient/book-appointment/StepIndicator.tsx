import { Check } from "lucide-react";

export default function StepIndicator({ step }: { step: number }) {
  const steps = ["Select Department", "Choose Date", "Select Doctor", "Choose Slot"];

  return (
    <div className="flex justify-center items-center gap-6 mb-10">
      {steps.map((label, i) => {
        const current = i + 1;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium
              ${
                step >= current
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step > current ? <Check size={16} /> : current}
            </div>
            <span
              className={`text-sm ${
                step >= current ? "text-purple-900" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
