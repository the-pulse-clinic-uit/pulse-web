const appointments = [
  { time: "09:00 AM", name: "John Doe", desc: "Consultation - Room 101", status: "confirmed" },
  { time: "10:30 AM", name: "Sarah Smith", desc: "Follow-up - Room 101", status: "confirmed" },
  { time: "03:30 PM", name: "Emily Davis", desc: "Consultation - Room 101", status: "confirmed" },
  { time: "05:00 PM", name: "Robert Wilson", desc: "Follow-up - Room 102", status: "pending" },
];

export default function TodaySchedule() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold text-gray-900 mb-4">
        Appointment Timeline
      </h3>

      <div className="space-y-4">
        {appointments.map((a) => (
          <div key={a.time} className="flex items-start gap-4">
            <span className="text-sm text-gray-500 w-20">{a.time}</span>

            <div className="flex-1 border-l pl-4">
              <p className="font-medium text-gray-900">{a.name}</p>
              <p className="text-sm text-gray-500">{a.desc}</p>
            </div>

            <span
              className={`text-xs px-2 py-1 rounded-full ${
                a.status === "confirmed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {a.status}
            </span>
          </div>
        ))}
      </div>

      <button className="mt-4 text-sm text-purple-600 hover:underline">
        View All Appointments →
      </button>
    </div>
  );
}
