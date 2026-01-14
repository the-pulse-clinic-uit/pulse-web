"use client";

import { useState } from "react";
import StepIndicator from "@/components/patient/book-appointment/StepIndicator";
import DoctorStep from "@/components/patient/book-appointment/DoctorStep";
import DateTimeStep from "@/components/patient/book-appointment/DateTimeStep";
import ConfirmStep from "@/components/patient/book-appointment/ConfirmStep";

export default function BookAppointmentPage() {
    const [step, setStep] = useState(1);
    const [doctorId, setDoctorId] = useState<string | null>(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
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

            {step === 2 && (
                <DoctorStep
                    selectedDoctor={doctorId}
                    onSelect={setDoctorId}
                    onBack={() => setStep(1)}
                    onNext={() => setStep(3)}
                />
            )}

            {step === 1 && (
                <DateTimeStep
                    date={date}
                    time={time}
                    description={description}
                    onChangeDate={setDate}
                    onChangeTime={setTime}
                    onChangeDescription={setDescription}
                    onNext={() => setStep(2)}
                />
            )}

            {step === 3 && (
                <ConfirmStep
                    doctorId={doctorId}
                    date={date}
                    time={time}
                    description={description}
                    onBack={() => setStep(2)}
                />
            )}
        </div>
    );
}
