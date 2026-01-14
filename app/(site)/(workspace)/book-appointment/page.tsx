"use client";

import { useState } from "react";
import StepIndicator from "@/components/patient/book-appointment/StepIndicator";
import DepartmentStep from "@/components/patient/book-appointment/DepartmentStep";
import DateStep from "@/components/patient/book-appointment/DateStep";
import DoctorStep from "@/components/patient/book-appointment/DoctorStep";
import SlotStep from "@/components/patient/book-appointment/SlotStep";
import ConfirmStep from "@/components/patient/book-appointment/ConfirmStep";

export default function BookAppointmentPage() {
  const [step, setStep] = useState(1);
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    startsAt: string;
    endsAt: string;
    assignmentId: string;
  } | null>(null);
  const [description, setDescription] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6 pb-12">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-semibold text-purple-900">
          Book an Appointment
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Follow the steps to schedule your visit
        </p>
      </div>

      <StepIndicator step={step} />

      {step === 1 && (
        <DepartmentStep
          selectedDepartment={departmentId}
          onSelect={setDepartmentId}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <DateStep
          date={date}
          onChangeDate={setDate}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <DoctorStep
          selectedDoctor={doctorId}
          departmentId={departmentId}
          onSelect={setDoctorId}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <SlotStep
          doctorId={doctorId}
          date={date}
          selectedSlot={selectedSlot}
          onSelectSlot={setSelectedSlot}
          onBack={() => setStep(3)}
          onNext={() => setStep(5)}
        />
      )}

      {step === 5 && (
        <ConfirmStep
          doctorId={doctorId}
          date={date}
          selectedSlot={selectedSlot}
          description={description}
          onChangeDescription={setDescription}
          onBack={() => setStep(4)}
        />
      )}
    </div>
  );
}
