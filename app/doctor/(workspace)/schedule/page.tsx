"use client";

import { useState } from "react";
import ScheduleHeader from "@/components/doctor/schedule/ScheduleHeader";
import WeeklyCalendar from "@/components/doctor/schedule/WeeklyCalendar";

export default function SchedulePage() {
  const [currentView, setCurrentView] = useState<"week" | "month">("week");

  return (
    <div className="max-w-7xl mx-auto px-6 pt-6 pb-12">
      <ScheduleHeader 
        currentView={currentView} 
        onViewChange={setCurrentView} 
      />
      
      <WeeklyCalendar />
    </div>
  );
}
