"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Clock } from "lucide-react";

interface ShiftAssignmentDto {
  id: string;
  dutyDate: string;
  roleInShift: "ON_CALL" | "PRIMARY";
  status: "ACTIVE" | "CANCELLED";
  shiftDto: {
    id: string;
    name: string;
    kind: "ER" | "CLINIC";
    startTime: string;
    endTime: string;
    slotMinutes: number;
    capacityPerSlot: number;
  };
}

interface AvailableTimeSlotDto {
  startsAt: string;
  endsAt: string;
  capacity: number;
}

interface ExtendedSlot extends AvailableTimeSlotDto {
  assignmentId: string;
}

interface SlotStepProps {
  doctorId: string | null;
  date: string;
  selectedSlot: { startsAt: string; endsAt: string; assignmentId: string } | null;
  onSelectSlot: (slot: { startsAt: string; endsAt: string; assignmentId: string }) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function SlotStep({
  doctorId,
  date,
  selectedSlot,
  onSelectSlot,
  onBack,
  onNext,
}: SlotStepProps) {
  const [assignments, setAssignments] = useState<ShiftAssignmentDto[]>([]);
    const [availableSlots, setAvailableSlots] = useState<ExtendedSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doctorId && date) {
      fetchAssignments();
    }
  }, [doctorId, date]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const res = await fetch(
        `/api/shifts/assignments/by_doctor/${doctorId}?startDate=${date}&endDate=${date}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data: ShiftAssignmentDto[] = await res.json();
        const activeAssignments = data.filter((a) => a.status === "ACTIVE");
        setAssignments(activeAssignments);

        // Fetch available slots for all shifts
        const allSlots: ExtendedSlot[] = [];
        for (const assignment of activeAssignments) {
          const slotsRes = await fetch(
            `/api/shifts/${assignment.shiftDto.id}/slots/available?date=${date}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (slotsRes.ok) {
            const slots: AvailableTimeSlotDto[] = await slotsRes.json();
            console.log("Fetched slots for assignment", assignment.id, ":", slots);
            allSlots.push(...slots.map((slot) => ({ ...slot, assignmentId: assignment.id } as ExtendedSlot)));
          }
        }
        setAvailableSlots(allSlots);
      }
    } catch (error) {
      console.error("Error fetching assignments or slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
      return "Invalid Time";
    }
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-purple-500"></span>
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-2xl shadow mb-8">
            <h3 className="flex items-center gap-2 text-purple-900 mb-3">
              <Clock size={18} /> Available Slots
            </h3>
            {availableSlots.length === 0 ? (
              <p className="text-gray-500">No available slots for this date.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots
                  .filter((slot) => slot.capacity > 0)
                  .map((slot, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        onSelectSlot({
                          startsAt: slot.startsAt,
                          endsAt: slot.endsAt,
                          assignmentId: slot.assignmentId,
                        })
                      }
                      className={`py-2 rounded-full text-sm
                      ${
                        selectedSlot?.startsAt === slot.startsAt
                          ? "bg-purple-500 text-white"
                          : "bg-purple-50 text-purple-600"
                      }`}
                    >
                      {formatTime(slot.startsAt)}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={onBack} className="px-6 py-2 border rounded-full">
              Back
            </button>
            <button
              onClick={onNext}
              disabled={!selectedSlot}
              className={`px-6 py-2 rounded-full
              ${
                selectedSlot
                  ? "bg-purple-500 text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
}