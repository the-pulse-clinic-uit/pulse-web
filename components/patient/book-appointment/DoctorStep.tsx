import DoctorCard from "./DoctorCard";

const doctors = [
  { id: 1, name: "Dr. Emily Carter", specialty: "Cardiologist", experience: "15 years" },
  { id: 2, name: "Dr. Michael Chen", specialty: "General Practitioner", experience: "12 years" },
  { id: 3, name: "Dr. Sarah Williams", specialty: "Dermatologist", experience: "10 years" },
];

export default function DoctorStep({
  selectedDoctor,
  onSelect,
  onNext,
}: {
  selectedDoctor: number | null;
  onSelect: (id: number) => void;
  onNext: () => void;
}) {
  return (
    <>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {doctors.map((d) => (
          <DoctorCard
            key={d.id}
            {...d}
            selected={selectedDoctor === d.id}
            onClick={() => onSelect(d.id)}
          />
        ))}
      </div>

      <div className="text-center">
        <button
          disabled={!selectedDoctor}
          onClick={onNext}
          className={`px-8 py-3 rounded-full
          ${
            selectedDoctor
              ? "bg-purple-500 text-white hover:bg-purple-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </>
  );
}
