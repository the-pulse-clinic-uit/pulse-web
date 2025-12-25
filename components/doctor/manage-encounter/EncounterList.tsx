import EncounterCard from "./EncounterCard";

const encounters = [
  {
    patientName: "Sarah Johnson",
    issue: "Type 2 diabetes follow-up",
    time: "09:00am - 09:30am",
    date: "15/12/2024",
  },
  {
    patientName: "Michael Chen",
    issue: "Hypertension consultation",
    time: "10:00am - 10:30am",
    date: "15/12/2024",
  },
  {
    patientName: "Emily Davis",
    issue: "Annual physical exam",
    time: "11:00am - 11:45am",
    date: "15/12/2024",
  },
  {
    patientName: "Robert Wilson",
    issue: "Chest pain evaluation",
    time: "02:00pm - 02:30pm",
    date: "15/12/2024",
  },
];

export default function EncounterList() {
  return (
    <div className="space-y-4">
      {encounters.length > 0 ? (
        encounters.map((encounter, index) => (
          <EncounterCard key={index} {...encounter} />
        ))
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-gray-500">No encounters scheduled for today</p>
        </div>
      )}
    </div>
  );
}