"use client";

import StatCard from "@/components/doctor/dashboard/StatCard";
import TodaySchedule from "@/components/doctor/dashboard/TodaySchedule";
import NotificationList from "@/components/doctor/dashboard/NotificationList";

export default function DoctorDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-6 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back, Dr. John Doe
          </h1>
          <p className="text-gray-600">
            Here is what is happening with your patients today
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

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Today's Appointments" value="12" trend="+12%" />
        <StatCard title="Pending Follow-ups" value="8" trend="+12%" />
        <StatCard title="Pending Admissions" value="3" trend="+12%" />
        <StatCard title="Active Prescriptions" value="24" trend="+12%" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TodaySchedule />
        </div>
        <div className="space-y-6">
          <NotificationList />
        </div>
      </div>
    </div>
  );
}
