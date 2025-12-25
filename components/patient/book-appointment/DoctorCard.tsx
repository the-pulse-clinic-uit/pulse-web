import { User } from "lucide-react";

interface Props {
  selected: boolean;
  name: string;
  specialty: string;
  experience: string;
  onClick: () => void;
}

export default function DoctorCard({
  selected,
  name,
  specialty,
  experience,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white rounded-2xl p-6 shadow-md transition
      ${selected ? "ring-4 ring-purple-500" : "hover:shadow-lg"}`}
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-purple-100 flex items-center justify-center">
        <User className="text-purple-600" />
      </div>
      <h3 className="text-center font-semibold text-purple-900">{name}</h3>
      <p className="text-center text-sm text-gray-600">{specialty}</p>
      <p className="text-center text-xs text-gray-400 mt-1">
        {experience} experience
      </p>
    </div>
  );
}
