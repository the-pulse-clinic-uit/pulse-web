"use client";

import {
  User,
  Clock,
  Calendar,
  CheckCircle,
  Play,
  Pause,
  MoreVertical,
  Repeat,
  FileText,
  CalendarPlus,
  Edit,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { FollowUpPlanDto, getRRuleText, calculateNextDates } from "@/types";
import EditPlanModal from "./EditPlanModal";

interface Props {
  plan: FollowUpPlanDto;
  onRefresh: () => void;
}

export default function FollowUpCard({ plan, onRefresh }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDates, setShowDates] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusIcon = () => {
    switch (plan.status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "PAUSED":
        return <Pause className="w-4 h-4 text-orange-500" />;
      default:
        return <Play className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (plan.status) {
      case "COMPLETED":
        return "bg-green-50 text-green-700 border-green-200";
      case "PAUSED":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const handlePause = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/followup/plans/${plan.id}/pause`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        onRefresh();
      } else {
        alert("Failed to pause plan");
      }
    } catch (error) {
      console.error("Error pausing plan:", error);
      alert("An error occurred");
    }
    setIsMenuOpen(false);
  };

  const handleResume = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/followup/plans/${plan.id}/resume`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        onRefresh();
      } else {
        alert("Failed to resume plan");
      }
    } catch (error) {
      console.error("Error resuming plan:", error);
      alert("An error occurred");
    }
    setIsMenuOpen(false);
  };

  const handleComplete = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    if (!confirm("Are you sure you want to mark this plan as completed?")) {
      return;
    }

    try {
      const res = await fetch(`/api/followup/plans/${plan.id}/complete`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        onRefresh();
      } else {
        alert("Failed to complete plan");
      }
    } catch (error) {
      console.error("Error completing plan:", error);
      alert("An error occurred");
    }
    setIsMenuOpen(false);
  };

  const handleDelete = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    if (!confirm("Are you sure you want to delete this plan?")) {
      return;
    }

    try {
      const res = await fetch(`/api/followup/plans/${plan.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        onRefresh();
      } else {
        alert("Failed to delete plan");
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("An error occurred");
    }
    setIsMenuOpen(false);
  };

  const handleGenerateAppointments = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    if (
      !confirm(
        "This will generate appointments based on the RRULE. Continue?"
      )
    ) {
      return;
    }

    try {
      setIsGenerating(true);
      const res = await fetch(
        `/api/followup/plans/${plan.id}/generate_appointments`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const appointments = await res.json();
        alert(`Generated ${appointments.length} appointments successfully`);
        onRefresh();
      } else {
        const error = await res.json();
        alert(`Failed: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error generating appointments:", error);
      alert("An error occurred");
    } finally {
      setIsGenerating(false);
      setIsMenuOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const nextDates = calculateNextDates(plan.firstDueAt, plan.rrule);

  return (
    <div className="bg-white border rounded-xl p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Patient Info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-900">
                {plan.patientDto.userDto.fullName}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {plan.patientDto.userDto.citizenId}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-3">
            <div className="flex items-start gap-2 text-sm">
              <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <span className="font-medium text-gray-700">Diagnosis:</span>{" "}
                <span className="text-gray-600">
                  {plan.baseEncounterDto.diagnosis || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <span className="font-medium text-gray-700">First Due:</span>{" "}
                <span className="text-gray-600">
                  {formatDate(plan.firstDueAt)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <Repeat className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <span className="font-medium text-gray-700">Schedule:</span>{" "}
                <span className="text-gray-600">
                  {getRRuleText(plan.rrule)}
                </span>
                <button
                  onClick={() => setShowDates(!showDates)}
                  className="ml-2 text-blue-600 hover:text-blue-700 text-xs underline"
                >
                  {showDates ? "Hide" : "Show"} dates
                </button>
              </div>
            </div>

            {showDates && (
              <div className="ml-6 mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Scheduled Appointments:
                </p>
                <div className="space-y-1">
                  {nextDates.map((date, idx) => (
                    <div key={idx} className="text-xs text-gray-600">
                      {idx + 1}. {formatDate(date.toISOString())}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {plan.notes && (
              <div className="flex items-start gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="font-medium text-gray-700">Notes:</span>{" "}
                  <span className="text-gray-600">{plan.notes}</span>
                </div>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor()}`}
          >
            {getStatusIcon()}
            {plan.status}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-10">
              <div className="py-1">
                {plan.status === "ACTIVE" && (
                  <>
                    <button
                      onClick={handleGenerateAppointments}
                      disabled={isGenerating}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                    >
                      <CalendarPlus className="w-4 h-4" />
                      {isGenerating ? "Generating..." : "Generate Appointments"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Plan
                    </button>
                    <button
                      onClick={handlePause}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Pause className="w-4 h-4" />
                      Pause Plan
                    </button>
                    <button
                      onClick={handleComplete}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Completed
                    </button>
                  </>
                )}

                {plan.status === "PAUSED" && (
                  <>
                    <button
                      onClick={() => {
                        setIsEditModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Plan
                    </button>
                    <button
                      onClick={handleResume}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Resume Plan
                    </button>
                  </>
                )}

                {plan.status !== "COMPLETED" && (
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                  >
                    Delete Plan
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <EditPlanModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={onRefresh}
        plan={plan}
      />
    </div>
  );
}
