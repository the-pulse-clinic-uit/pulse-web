export default function AppointmentHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Appointments
        </h1>
        <p className="text-gray-600">
          Manage your patient appointments and schedule
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">Dr. John Doe</p>
          <p className="text-xs text-gray-500">Cardiologist</p>
        </div>
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          JD
        </div>
      </div>
    </div>
  );
}
