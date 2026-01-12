"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import FollowUpCard from "./FollowUpCard";
import FollowUpTabs from "./FollowUpTabs";
import FollowUpHeader from "./FollowUpHeader";
import { FollowUpPlanDto, FollowUpPlanStatus } from "@/types";

export default function FollowUpList() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FollowUpPlanStatus>("ACTIVE");
  const [plans, setPlans] = useState<FollowUpPlanDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fetchDoctorInfo = useCallback(async () => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/doctor/login");
      return null;
    }

    try {
      const res = await fetch("/api/doctors/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        return data.id;
      } else if (res.status === 401 || res.status === 403) {
        Cookies.remove("token");
        router.push("/doctor/login");
      }
    } catch (error) {
      console.error("Error fetching doctor info:", error);
    }
    return null;
  }, [router]);

  const fetchPlans = useCallback(async (id: string) => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/followup/plans/doctor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data: FollowUpPlanDto[] = await res.json();
        setPlans(data);
      } else {
        console.error("Failed to fetch plans");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      const id = await fetchDoctorInfo();
      if (id) {
        setDoctorId(id);
        await fetchPlans(id);
      }
    };
    initialize();
  }, [fetchDoctorInfo, fetchPlans]);

  const handleRefresh = useCallback(() => {
    if (doctorId) {
      fetchPlans(doctorId);
    }
  }, [doctorId, fetchPlans]);

  const filteredPlans = useMemo(() => {
    let result = plans.filter((plan) => plan.status === activeTab);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((plan) =>
        plan.patientDto.userDto.fullName.toLowerCase().includes(query)
      );
    }

    if (selectedDate) {
      result = result.filter((plan) => {
        const planDate = new Date(plan.firstDueAt);
        return (
          planDate.getFullYear() === selectedDate.getFullYear() &&
          planDate.getMonth() === selectedDate.getMonth()
        );
      });
    }

    return result;
  }, [plans, activeTab, searchQuery, selectedDate]);

  // Count by status
  const counts = {
    ACTIVE: plans.filter((p) => p.status === "ACTIVE").length,
    PAUSED: plans.filter((p) => p.status === "PAUSED").length,
    COMPLETED: plans.filter((p) => p.status === "COMPLETED").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div>
      <FollowUpHeader
        onSearch={setSearchQuery}
        onDateChange={setSelectedDate}
      />

      <FollowUpTabs
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as FollowUpPlanStatus)}
        counts={counts}
      />

      <div className="space-y-4">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <FollowUpCard
              key={plan.id}
              plan={plan}
              onRefresh={handleRefresh}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border">
            <p className="text-gray-500">
              No {activeTab.toLowerCase()} follow-up plans
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
