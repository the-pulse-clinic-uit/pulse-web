"use client";

import { FollowUpPlanStatus } from "@/types";

interface Tab {
  id: FollowUpPlanStatus;
  label: string;
}

const tabs: Tab[] = [
  { id: "ACTIVE", label: "Active" },
  { id: "PAUSED", label: "Paused" },
  { id: "COMPLETED", label: "Completed" },
];

interface FollowUpTabsProps {
  activeTab: FollowUpPlanStatus;
  onTabChange: (tab: string) => void;
  counts: Record<FollowUpPlanStatus, number>;
}

export default function FollowUpTabs({
  activeTab,
  onTabChange,
  counts,
}: FollowUpTabsProps) {
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {tab.label}
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.id
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {counts[tab.id]}
          </span>
        </button>
      ))}
    </div>
  );
}
