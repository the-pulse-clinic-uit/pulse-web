"use client";

import { useState } from "react";
import FollowUpCard from "./FollowUpCard";
import FollowUpTabs from "./FollowUpTabs";

const followUpPlans = [
  {
    patientName: "Sarah Johnson",
    condition: "Type 2 diabetes management",
    nextVisit: "22/12/2024",
    status: "pending" as const,
    priority: "high" as const,
    notes: "Monitor blood sugar levels, adjust medication if needed",
  },
  {
    patientName: "Michael Chen",
    condition: "Hypertension follow-up",
    nextVisit: "20/12/2024",
    status: "overdue" as const,
    priority: "high" as const,
    notes: "Check blood pressure, review medication compliance",
  },
  {
    patientName: "Emily Davis",
    condition: "Post-surgery recovery",
    nextVisit: "25/12/2024",
    status: "pending" as const,
    priority: "medium" as const,
    notes: "Wound healing assessment, physical therapy progress",
  },
  {
    patientName: "Robert Wilson",
    condition: "Cardiac rehabilitation",
    nextVisit: "18/12/2024",
    status: "completed" as const,
    priority: "medium" as const,
    notes: "Exercise tolerance improved, continue current program",
  },
  {
    patientName: "Lisa Anderson",
    condition: "Chronic pain management",
    nextVisit: "30/12/2024",
    status: "pending" as const,
    priority: "low" as const,
    notes: "Pain levels stable, continue current treatment plan",
  },
];

export default function FollowUpList() {
  const [activeTab, setActiveTab] = useState("pending");

  const filteredPlans = followUpPlans.filter(plan => plan.status === activeTab);

  return (
    <div>
      <FollowUpTabs onTabChange={setActiveTab} />
      
      <div className="space-y-4">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan, index) => (
            <FollowUpCard 
              key={`${plan.patientName}-${index}`}
              patientName={plan.patientName}
              condition={plan.condition}
              nextVisit={plan.nextVisit}
              status={plan.status}
              priority={plan.priority}
              notes={plan.notes}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border">
            <p className="text-gray-500">No {activeTab} follow-up plans</p>
          </div>
        )}
      </div>
    </div>
  );
}