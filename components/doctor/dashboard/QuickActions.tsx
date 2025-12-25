export default function QuickActions() {
  const actions = [
    "Manage Appointments",
    "View Encounters",
    "Prescriptions",
    "Follow-Up Plans",
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((a) => (
          <button
            key={a}
            className="border rounded-lg p-4 text-sm hover:bg-purple-50"
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}
