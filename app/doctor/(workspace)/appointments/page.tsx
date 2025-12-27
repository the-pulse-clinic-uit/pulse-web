'use client';

import { useState } from 'react';
import AppointmentHeader from '@/components/doctor/appointment/AppointmentHeader';
import AppointmentTabs from '@/components/doctor/appointment/AppointmentTabs';
import AppointmentList from '@/components/doctor/appointment/AppointmentList';

export default function DoctorAppointmentPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'past' | 'cancelled'>(
    'upcoming'
  );

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <AppointmentHeader />

      <AppointmentTabs activeTab={activeTab} onChange={setActiveTab} />

      <AppointmentList activeTab={activeTab} />
    </div>
  );
}
