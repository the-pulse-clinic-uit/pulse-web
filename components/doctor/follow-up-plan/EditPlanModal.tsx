"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Cookies from "js-cookie";
import { FollowUpPlanDto, FollowUpPlanRequestDto, RRuleOption, buildRRule, parseRRule } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plan: FollowUpPlanDto;
}

export default function EditPlanModal({
  isOpen,
  onClose,
  onSuccess,
  plan,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstDueAt: "",
    notes: "",
  });
  const [rruleOption, setRruleOption] = useState<RRuleOption>({
    freq: "WEEKLY" as const,
    count: 4,
    interval: 1,
  });

  useEffect(() => {
    if (isOpen && plan) {
      const parsed = parseRRule(plan.rrule);
      if (parsed) {
        setRruleOption(parsed);
      }
      
      const dateStr = new Date(plan.firstDueAt).toISOString().slice(0, 16);
      setFormData({
        firstDueAt: dateStr,
        notes: plan.notes || "",
      });
    }
  }, [isOpen, plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("token");
    if (!token) return;

    if (!formData.firstDueAt) {
      alert("Please fill all required fields");
      return;
    }

    const requestDto: FollowUpPlanRequestDto = {
      firstDueAt: formData.firstDueAt,
      rrule: buildRRule(rruleOption),
      notes: formData.notes || undefined,
      patientId: plan.patientDto.id,
      doctorId: plan.doctorDto.id,
      baseEncounterId: plan.baseEncounterDto.id,
    };

    try {
      setLoading(true);
      const res = await fetch(`/api/followup/plans/${plan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestDto),
      });

      if (res.ok) {
        alert("Follow-up plan updated successfully");
        onSuccess();
        onClose();
      } else {
        const error = await res.json();
        alert(`Failed: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Edit Follow-up Plan
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Patient:</span>{" "}
              <span className="text-gray-600">
                {plan.patientDto.userDto.fullName}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Diagnosis:</span>{" "}
              <span className="text-gray-600">
                {plan.baseEncounterDto.diagnosis}
              </span>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                First Appointment Date & Time *
              </span>
            </label>
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              value={formData.firstDueAt}
              onChange={(e) =>
                setFormData({ ...formData, firstDueAt: e.target.value })
              }
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="divider">Recurrence Schedule</div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Frequency *</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={rruleOption.freq}
                onChange={(e) =>
                  setRruleOption({
                    ...rruleOption,
                    freq: e.target.value as RRuleOption["freq"],
                  })
                }
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Number of Occurrences *
                </span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={rruleOption.count}
                onChange={(e) =>
                  setRruleOption({
                    ...rruleOption,
                    count: parseInt(e.target.value) || 1,
                  })
                }
                min="1"
                max="52"
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Interval (Every X {rruleOption.freq.toLowerCase()})
              </span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={rruleOption.interval}
              onChange={(e) =>
                setRruleOption({
                  ...rruleOption,
                  interval: parseInt(e.target.value) || 1,
                })
              }
              min="1"
              max="12"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-1">
              Schedule Preview:
            </p>
            <p className="text-sm text-blue-700">
              {(rruleOption.interval || 1) > 1
                ? `Every ${rruleOption.interval} ${rruleOption.freq.toLowerCase()}s, ${rruleOption.count} times`
                : `Every ${rruleOption.freq.toLowerCase()}, ${rruleOption.count} times`}
            </p>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Notes (Optional)</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Additional notes or instructions..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
