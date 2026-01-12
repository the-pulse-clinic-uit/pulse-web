"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Cookies from "js-cookie";
import { FollowUpPlanRequestDto, RRuleOption, buildRRule } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preSelectedEncounterId?: string;
  preSelectedPatientId?: string;
}

interface Patient {
  id: string;
  userDto: {
    fullName: string;
    citizenId: string;
  };
}

interface Encounter {
  id: string;
  diagnosis: string;
  startedAt: string;
  patientDto: {
    id: string;
    userDto: {
      fullName: string;
    };
  };
}

export default function CreatePlanModal({
  isOpen,
  onClose,
  onSuccess,
  preSelectedEncounterId,
  preSelectedPatientId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstDueAt: "",
    notes: "",
    patientId: preSelectedPatientId || "",
    baseEncounterId: preSelectedEncounterId || "",
  });
  const [rruleOption, setRruleOption] = useState<RRuleOption>({
    freq: "WEEKLY" as const,
    count: 4,
    interval: 1,
  });

  useEffect(() => {
    if (isOpen) {
      fetchDoctorInfo();
      fetchPatients();
      if (preSelectedPatientId) {
        fetchEncounters(preSelectedPatientId);
        setFormData(prev => ({ 
          ...prev, 
          patientId: preSelectedPatientId,
          baseEncounterId: preSelectedEncounterId || ""
        }));
      } else if (formData.patientId) {
        fetchEncounters(formData.patientId);
      }
    }
  }, [isOpen, preSelectedPatientId, preSelectedEncounterId]);

  const fetchDoctorInfo = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await fetch("/api/doctors/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setDoctorId(data.id);
      }
    } catch (error) {
      console.error("Error fetching doctor info:", error);
    }
  };

  const fetchPatients = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await fetch("/api/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchEncounters = async (pid: string) => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/encounters/patient/${pid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setEncounters(data.filter((e: Encounter) => e.diagnosis));
      }
    } catch (error) {
      console.error("Error fetching encounters:", error);
    }
  };

  const handlePatientChange = (pid: string) => {
    setFormData({ ...formData, patientId: pid, baseEncounterId: "" });
    if (pid) {
      fetchEncounters(pid);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("token");
    if (!token) return;

    if (!formData.firstDueAt || !formData.patientId || !formData.baseEncounterId) {
      alert("Please fill all required fields");
      return;
    }

    if (!doctorId) {
      alert("Doctor information not available");
      return;
    }

    const requestDto: FollowUpPlanRequestDto = {
      firstDueAt: formData.firstDueAt,
      rrule: buildRRule(rruleOption),
      notes: formData.notes || undefined,
      patientId: formData.patientId,
      doctorId: doctorId,
      baseEncounterId: formData.baseEncounterId,
    };

    try {
      setLoading(true);
      const res = await fetch("/api/followup/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestDto),
      });

      if (res.ok) {
        alert("Follow-up plan created successfully");
        onSuccess();
        handleClose();
      } else {
        const error = await res.json();
        alert(`Failed: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating plan:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstDueAt: "",
      notes: "",
      patientId: preSelectedPatientId || "",
      baseEncounterId: preSelectedEncounterId || "",
    });
    setRruleOption({ freq: "WEEKLY", count: 4, interval: 1 });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Create Follow-up Plan
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Patient *</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.patientId}
              onChange={(e) => handlePatientChange(e.target.value)}
              required
              disabled={!!preSelectedPatientId}
            >
              <option value="">Select a patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.userDto.fullName} - {patient.userDto.citizenId}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Base Encounter (Diagnosis) *
              </span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.baseEncounterId}
              onChange={(e) =>
                setFormData({ ...formData, baseEncounterId: e.target.value })
              }
              required
              disabled={!formData.patientId || !!preSelectedEncounterId}
            >
              <option value="">Select an encounter</option>
              {encounters.map((encounter) => (
                <option key={encounter.id} value={encounter.id}>
                  {encounter.diagnosis} -{" "}
                  {new Date(encounter.startedAt).toLocaleDateString()}
                </option>
              ))}
            </select>
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
            <label className="label">
              <span className="label-text-alt text-gray-500">
                Example: Interval 2 with Weekly = Every 2 weeks
              </span>
            </label>
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
              onClick={handleClose}
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
              {loading ? "Creating..." : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
