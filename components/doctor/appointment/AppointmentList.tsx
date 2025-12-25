import AppointmentCard from './AppointmentCard';

const mockAppointments = {
  upcoming: [
    {
      id: 1,
      date: 'Thu 15',
      time: '09:00am - 09:30am',
      patient: 'Stephine Claire',
      issue: 'Fever and headache',
    },
    {
      id: 2,
      date: 'Thu 15',
      time: '10:00am - 10:30am',
      patient: 'John Doe',
      issue: 'Regular checkup',
    },
    {
      id: 3,
      date: 'Fri 16',
      time: '02:00pm - 02:30pm',
      patient: 'Sarah Wilson',
      issue: 'Blood pressure monitoring',
    },
  ],
  pending: [
    {
      id: 4,
      date: 'Mon 18',
      time: '11:00am - 11:30am',
      patient: 'Mike Johnson',
      issue: 'Consultation request',
    },
    {
      id: 5,
      date: 'Tue 19',
      time: '03:00pm - 03:30pm',
      patient: 'Emily Davis',
      issue: 'Follow-up appointment',
    },
  ],
  past: [
    {
      id: 6,
      date: 'Wed 13',
      time: '09:00am - 09:30am',
      patient: 'Robert Brown',
      issue: 'Annual physical exam',
    },
    {
      id: 7,
      date: 'Tue 12',
      time: '02:00pm - 02:30pm',
      patient: 'Lisa Anderson',
      issue: 'Diabetes management',
    },
  ],
  cancelled: [
    {
      id: 8,
      date: 'Mon 11',
      time: '10:00am - 10:30am',
      patient: 'David Miller',
      issue: 'Routine checkup',
    },
  ],
};

export default function AppointmentList({
  activeTab,
}: {
  activeTab: 'upcoming' | 'pending' | 'past' | 'cancelled';
}) {
  const appointments = mockAppointments[activeTab] || [];

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No {activeTab} appointments
        </h3>
        <p className="text-gray-600">
          You do not have any {activeTab} appointments at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((item) => (
        <AppointmentCard key={item.id} data={item} type={activeTab} />
      ))}
    </div>
  );
}
