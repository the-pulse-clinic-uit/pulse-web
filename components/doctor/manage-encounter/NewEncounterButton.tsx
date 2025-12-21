import { Plus } from "lucide-react";

export default function NewEncounterButton() {
  return (
    <div className="flex justify-end mb-6">
      <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
        <Plus className="w-4 h-4" />
        New Encounter
      </button>
    </div>
  );
}