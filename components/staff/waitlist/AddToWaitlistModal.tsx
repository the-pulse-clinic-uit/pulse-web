"use client";

interface DoctorOption {
    id: string;
    fullName: string;
}

interface AppointmentOption {
    id: string;
    patientName: string;
    appointmentTime: string;
    description: string;
}

interface PatientOption {
    id: string;
    fullName: string;
    citizenId: string;
    phone: string;
}

interface WaitlistFormData {
    dutyDate: string;
    notes: string;
    priority: "NORMAL" | "PRIORITY" | "EMERGENCY";
    appointmentId: string;
    patientId: string;
    doctorId: string;
    isWalkIn: boolean;
}

interface AddToWaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: WaitlistFormData;
    onFormChange: (field: keyof WaitlistFormData, value: string | boolean) => void;
    doctors: DoctorOption[];
    allPatients: PatientOption[];
    appointments: AppointmentOption[];
}

export default function AddToWaitlistModal({
    isOpen,
    onClose,
    onSubmit,
    formData,
    onFormChange,
    doctors,
    allPatients,
    appointments,
}: AddToWaitlistModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="font-bold text-xl mb-6">Add Patient to Waitlist</h3>

                <form onSubmit={onSubmit} className="space-y-5">
                    {/* Duty Date */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Duty Date *</span>
                        </label>
                        <input
                            type="date"
                            className="input input-bordered w-full mt-1"
                            value={formData.dutyDate}
                            onChange={(e) => onFormChange("dutyDate", e.target.value)}
                            required
                        />
                    </div>

                    {/* Doctor Selection */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Doctor *</span>
                        </label>
                        <select
                            className="select select-bordered w-full mt-1"
                            value={formData.doctorId}
                            onChange={(e) => onFormChange("doctorId", e.target.value)}
                            required
                        >
                            <option value="">Select a doctor</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Divider */}
                    <div className="divider my-4"></div>

                    {/* Patient Type: Walk-in or Appointment */}
                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3 py-3">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-primary"
                                checked={formData.isWalkIn}
                                onChange={(e) => onFormChange("isWalkIn", e.target.checked)}
                            />
                            <span className="label-text font-semibold">Walk-in Patient (No Appointment)</span>
                        </label>
                    </div>

                    {/* Appointment Selection (if not walk-in) */}
                    {!formData.isWalkIn && (
                        <div className="form-control bg-base-200 p-4 rounded-lg">
                            <label className="label">
                                <span className="label-text font-semibold">Select Appointment</span>
                            </label>
                            <select
                                className="select select-bordered w-full mt-2"
                                value={formData.appointmentId}
                                onChange={(e) => onFormChange("appointmentId", e.target.value)}
                                disabled={!formData.doctorId}
                            >
                                <option value="">Select an appointment</option>
                                {appointments.map((apt) => (
                                    <option key={apt.id} value={apt.id}>
                                        {apt.appointmentTime} - {apt.patientName}
                                        {apt.description && ` (${apt.description})`}
                                    </option>
                                ))}
                            </select>
                            <label className="label mt-2">
                                <span className="label-text-alt text-gray-500">
                                    💡 Select doctor and date first to see available appointments
                                </span>
                            </label>
                        </div>
                    )}

                    {/* Patient Selection */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Patient *</span>
                        </label>
                        <select
                            className="select select-bordered w-full mt-1"
                            value={formData.patientId}
                            onChange={(e) => onFormChange("patientId", e.target.value)}
                            required
                        >
                            <option value="">Select a patient</option>
                            {allPatients.map((patient) => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.fullName} - {patient.citizenId} ({patient.phone})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Divider */}
                    <div className="divider my-4"></div>

                    {/* Priority */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Priority *</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3 mt-2">
                            <label className={`btn ${formData.priority === "NORMAL" ? "btn-active" : "btn-outline"} flex-col h-auto py-3`}>
                                <input
                                    type="radio"
                                    name="priority"
                                    className="hidden"
                                    value="NORMAL"
                                    checked={formData.priority === "NORMAL"}
                                    onChange={(e) => onFormChange("priority", e.target.value)}
                                />
                                <span className="text-lg">⚪</span>
                                <span className="text-sm font-medium">Normal</span>
                            </label>
                            <label className={`btn ${formData.priority === "PRIORITY" ? "btn-active" : "btn-outline"} flex-col h-auto py-3`}>
                                <input
                                    type="radio"
                                    name="priority"
                                    className="hidden"
                                    value="PRIORITY"
                                    checked={formData.priority === "PRIORITY"}
                                    onChange={(e) => onFormChange("priority", e.target.value)}
                                />
                                <span className="text-lg">🟠</span>
                                <span className="text-sm font-medium">Priority</span>
                            </label>
                            <label className={`btn ${formData.priority === "EMERGENCY" ? "btn-active" : "btn-outline"} flex-col h-auto py-3`}>
                                <input
                                    type="radio"
                                    name="priority"
                                    className="hidden"
                                    value="EMERGENCY"
                                    checked={formData.priority === "EMERGENCY"}
                                    onChange={(e) => onFormChange("priority", e.target.value)}
                                />
                                <span className="text-lg">🔴</span>
                                <span className="text-sm font-medium">Emergency</span>
                            </label>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Notes (Optional)</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered h-28 mt-1 ml-5"
                            placeholder="Enter any additional notes or special instructions..."
                            value={formData.notes}
                            onChange={(e) => onFormChange("notes", e.target.value)}
                        />
                    </div>

                    {/* Actions */}
                    <div className="modal-action mt-8 gap-3">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary px-8"
                        >
                            Add to Waitlist
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
