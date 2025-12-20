
"use client";

import WelcomeBanner from "@/components/patient/dashboard/WelcomeBanner";
import SummaryCard from "@/components/patient/dashboard/SummaryCard";
import QuickAction from "@/components/patient/dashboard/QuickAction";
import ActivityItem from "@/components/patient/dashboard/ActivityItem";

import {
  Calendar,
  Pill,
  CreditCard,
  FileText,
  MessageSquare,
  User,
} from "lucide-react";

export default function DashboardPage() {
  const user = {
    name: "Patient",
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-4 pt-20">
        <WelcomeBanner userName={user.name} />

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <SummaryCard
            icon={<Calendar className="w-4 h-4 text-white" />}
            badge="Upcoming"
            badgeColor="purple"
            title="Next Appointment"
            main="Dr. Emily Carter"
            sub="Dec 22, 2025 at 10:00 AM"
            href="/appointments"
          />

          <SummaryCard
            icon={<Pill className="w-4 h-4 text-white" />}
            badge="Active"
            badgeColor="green"
            title="Active Prescriptions"
            main="3 medications"
            sub="Last updated: Dec 15, 2025"
            href="/prescriptions"
          />

          <SummaryCard
            icon={<CreditCard className="w-4 h-4 text-white" />}
            badge="Due"
            badgeColor="orange"
            title="Pending Payment"
            main="$250.00"
            sub="Invoice #INV-2025-0042"
            href="/invoices"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-purple-900 text-lg font-semibold mb-4">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction
              href="/book-appointment"
              icon={<Calendar className="w-4 h-4 text-white" />}
              title="Book Appointment"
              desc="Schedule a visit with a doctor"
            />
            <QuickAction
              href="/records"
              icon={<FileText className="w-4 h-4 text-white" />}
              title="Medical Records"
              desc="Access your health records"
            />
            <QuickAction
              href="/chat"
              icon={<MessageSquare className="w-4 h-4 text-white" />}
              title="Chat with Staff"
              desc="Ask questions or get support"
            />
            <QuickAction
              href="/profile"
              icon={<User className="w-4 h-4 text-white" />}
              title="Update Profile"
              desc="Manage your information"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-purple-900 text-lg font-semibold mb-4">
            Recent Activity
          </h2>

          <div className="space-y-3">
            <ActivityItem
              icon={<Calendar className="w-4 h-4 text-purple-600" />}
              title="Appointment scheduled"
              desc="Dr. Emily Carter - Dec 22, 2025"
              time="2 days ago"
            />
            <ActivityItem
              icon={<Pill className="w-4 h-4 text-purple-600" />}
              title="Prescription refilled"
              desc="Lisinopril 10mg - 30 tablets"
              time="4 days ago"
            />
            <ActivityItem
              icon={<FileText className="w-4 h-4 text-purple-600" />}
              title="Lab results available"
              desc="Blood work - All normal"
              time="1 week ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
