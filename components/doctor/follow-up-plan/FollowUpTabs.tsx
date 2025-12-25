"use client";

import { useState } from "react";

const tabs = [
  { id: "pending", label: "Pending", count: 8 },
  { id: "completed", label: "Completed", count: 12 },
  { id: "overdue", label: "Overdue", count: 3 },
];

interface FollowUpTabsProps {
  onTabChange: (tab: string) => void;
}

export default function FollowUpTabs({ onTabChange }: FollowUpTabsProps) {
  const [activeTab, setActiveTab] = useState("pending");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange(tabId);
  };

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
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
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}