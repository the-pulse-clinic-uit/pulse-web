"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

// ==================== VALIDATION FUNCTIONS ====================

const validateDateTime = (dateTimeStr: string, fieldName: string): string | null => {
    if (!dateTimeStr) {
        return `${fieldName} is required.`;
    }
    
    const date = new Date(dateTimeStr);
    
    // Check if date is invalid
    if (isNaN(date.getTime())) {
        return `${fieldName} is invalid. Please enter a valid date and time.`;
    }
    
    const year = date.getFullYear();
    
    // Check year range
    if (year < 1900 || year > 3000) {
        return `${fieldName} year must be between 1900 and 3000.`;
    }
    
    return null;
};

const validateDateOnly = (dateStr: string, fieldName: string): string | null => {
    if (!dateStr) {
        return `${fieldName} is required.`;
    }
    
    const date = new Date(dateStr);
    
    // Check if date is invalid
    if (isNaN(date.getTime())) {
        return `${fieldName} is invalid. Please enter a valid date.`;
    }
    
    const year = date.getFullYear();
    
    // Check year range
    if (year < 1900 || year > 3000) {
        return `${fieldName} year must be between 1900 and 3000.`;
    }
    
    return null;
};

interface PatientOption {
    id: string;
    fullName: string;
    citizenId: string;
    phone: string;
}

interface PatientApiResponse {
    id: string;
    userDto: {
        fullName: string;
        citizenId: string;
        phone: string;
    };
}

interface DepartmentOption {
    id: string;
    name: string;
}

interface DoctorOption {
    id: string;
    fullName: string;
    departmentId: string;
    departmentName: string;
}

interface DoctorApiResponse {
    id: string;
    licenseId: string;
    staffDto: {
        userDto: {
            fullName: string;
        };
        departmentDto: {
            id: string;
            name: string;
        } | null;
    };
}

interface RoomOption {
    id: string;
    roomNumber: string;
    departmentId: string;
}

interface RoomApiResponse {
    id: string;
    roomNumber: string;
    bedAmount: number;
    isAvailable: boolean;
    departmentDto: {
        id: string;
        name: string;
    };
}

interface ShiftDto {
    id: string;
    name: string;
    kind: "ER" | "CLINIC";
    startTime: string;
    endTime: string;
    slotMinutes: number;
    capacityPerSlot: number;
    departmentDto?: {
        id: string;
        name: string;
    };
}

interface ShiftAssignmentDto {
    id: string;
    dutyDate: string;
    roleInShift: "ON_CALL" | "PRIMARY";
    status: "ACTIVE" | "CANCELLED";
    doctorDto: {
        id: string;
    };
    shiftDto: ShiftDto;
    roomDto: {
        id: string;
        roomNumber: string;
    } | null;
}

interface ShiftAssignmentOption {
    id: string;
    shiftName: string;
    startTime: string;
    endTime: string;
    role: string;
    roomNumber: string;
}

interface AvailableSlot {
    startsAt: string; // ISO DateTime from backend
    capacity: number;
}

type AddAppointmentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (appointment: {
        patientId: string;
        doctorId: string;
        assignmentId: string;
        startsAt: string;
        endsAt: string;
        status: string;
        type: string;
        description?: string;
    }) => void;
};

export default function AddAppointmentModal({
    isOpen,
    onClose,
    onSave,
}: AddAppointmentModalProps) {
    const [formData, setFormData] = useState({
        patientId: "",
        name: "",
        date: new Date().toISOString().split("T")[0],
        phoneNumber: "",
        departmentId: "",
        department: "",
        doctorId: "",
        doctor: "",
        room: "",
        assignmentId: "",
        slotStartTime: "",
        slotEndTime: "",
    });
    const [patients, setPatients] = useState<PatientOption[]>([]);
    const [departments, setDepartments] = useState<DepartmentOption[]>([]);
    const [allDoctors, setAllDoctors] = useState<DoctorOption[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<DoctorOption[]>([]);
    const [allRooms, setAllRooms] = useState<RoomOption[]>([]);
    const [filteredRooms, setFilteredRooms] = useState<RoomOption[]>([]);
    const [allShifts, setAllShifts] = useState<ShiftDto[]>([]);
    const [filteredShifts, setFilteredShifts] = useState<ShiftDto[]>([]);
    const [filteredAssignments, setFilteredAssignments] = useState<ShiftAssignmentOption[]>([]);
    const [fullAssignments, setFullAssignments] = useState<ShiftAssignmentDto[]>([]); // Store full assignment data
    const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
    const [loadingAssignments, setLoadingAssignments] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Fetch patients, departments, doctors, rooms, and shifts when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchPatients();
            fetchDepartments();
            fetchDoctors();
            fetchRooms();
            fetchShifts();
        }
    }, [isOpen]);

    // Filter doctors when department changes
    useEffect(() => {
        if (formData.departmentId) {
            const filtered = allDoctors.filter(
                (doctor) => doctor.departmentId === formData.departmentId
            );
            setFilteredDoctors(filtered);
        } else {
            setFilteredDoctors([]);
        }
    }, [formData.departmentId, allDoctors]);

    // Filter rooms when department changes
    useEffect(() => {
        if (formData.departmentId) {
            const filtered = allRooms.filter(
                (room) => room.departmentId === formData.departmentId
            );
            setFilteredRooms(filtered);
        } else {
            setFilteredRooms([]);
        }
    }, [formData.departmentId, allRooms]);

    // Filter shifts when department changes
    useEffect(() => {
        if (formData.departmentId) {
            const filtered = allShifts.filter(
                (shift) => shift.departmentDto?.id === formData.departmentId
            );
            setFilteredShifts(filtered);
        } else {
            setFilteredShifts([]);
        }
    }, [formData.departmentId, allShifts]);

    // Fetch assignments when doctor or date changes
    useEffect(() => {
        if (formData.doctorId && formData.date && filteredShifts.length > 0) {
            fetchAssignmentsByDoctor(formData.doctorId, formData.date);
        } else {
            setFilteredAssignments([]);
        }
    }, [formData.doctorId, formData.date, filteredShifts]);

    // Fetch available slots when assignment changes
    useEffect(() => {
        if (formData.assignmentId && formData.date && fullAssignments.length > 0) {
            fetchAvailableSlots(formData.assignmentId, formData.date);
        } else {
            setAvailableSlots([]);
        }
    }, [formData.assignmentId, formData.date, fullAssignments]);

    const fetchPatients = async () => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            const res = await fetch("/api/patients", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data: PatientApiResponse[] = await res.json();
                const patientsList: PatientOption[] = data.map((patient) => ({
                    id: patient.id,
                    fullName: patient.userDto.fullName,
                    citizenId: patient.userDto.citizenId,
                    phone: patient.userDto.phone,
                }));
                setPatients(patientsList);
            }
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    };

    const fetchDepartments = async () => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            const res = await fetch("/api/departments", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                const departmentsList: DepartmentOption[] = data.map((dept: { id: string; name: string }) => ({
                    id: dept.id,
                    name: dept.name,
                }));
                setDepartments(departmentsList);
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    const fetchDoctors = async () => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            const res = await fetch("/api/doctors", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data: DoctorApiResponse[] = await res.json();
                const doctorsList: DoctorOption[] = data
                    .filter((doctor) => doctor.staffDto?.departmentDto)
                    .map((doctor) => ({
                        id: doctor.id,
                        fullName: doctor.staffDto.userDto.fullName,
                        departmentId: doctor.staffDto.departmentDto!.id,
                        departmentName: doctor.staffDto.departmentDto!.name,
                    }));
                setAllDoctors(doctorsList);
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    const fetchRooms = async () => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            const res = await fetch("/api/rooms", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data: RoomApiResponse[] = await res.json();
                const roomsList: RoomOption[] = data.map((room) => ({
                    id: room.id,
                    roomNumber: room.roomNumber,
                    departmentId: room.departmentDto.id,
                }));
                setAllRooms(roomsList);
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    const fetchShifts = async () => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            const res = await fetch("/api/shifts", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data: ShiftDto[] = await res.json();
                setAllShifts(data);
            }
        } catch (error) {
            console.error("Error fetching shifts:", error);
        }
    };

    const fetchAssignmentsByDoctor = async (doctorId: string, date: string) => {
        const token = Cookies.get("token");
        if (!token) return;

        setLoadingAssignments(true);
        try {
            const allAssignments: ShiftAssignmentDto[] = [];

            // Fetch assignments only for shifts in the selected department
            for (const shift of filteredShifts) {
                const res = await fetch(
                    `/api/shifts/${shift.id}/assignments?date=${date}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (res.ok) {
                    const data: ShiftAssignmentDto[] = await res.json();
                    allAssignments.push(...data);
                }
            }

            // Filter assignments by doctor and active status
            const doctorAssignments = allAssignments.filter(
                (assignment) =>
                    assignment.doctorDto.id === doctorId &&
                    assignment.status === "ACTIVE"
            );

            // Format for dropdown
            const assignmentOptions: ShiftAssignmentOption[] = doctorAssignments.map(
                (assignment) => ({
                    id: assignment.id,
                    shiftName: assignment.shiftDto.name,
                    startTime: new Date(assignment.shiftDto.startTime).toLocaleTimeString(
                        "en-US",
                        { hour: "2-digit", minute: "2-digit" }
                    ),
                    endTime: new Date(assignment.shiftDto.endTime).toLocaleTimeString(
                        "en-US",
                        { hour: "2-digit", minute: "2-digit" }
                    ),
                    role: assignment.roleInShift,
                    roomNumber: assignment.roomDto?.roomNumber || "N/A",
                })
            );

            setFilteredAssignments(assignmentOptions);
            setFullAssignments(doctorAssignments); // Store full data
        } catch (error) {
            console.error("Error fetching assignments:", error);
        } finally {
            setLoadingAssignments(false);
        }
    };

    const fetchAvailableSlots = async (assignmentId: string, date: string) => {
        const token = Cookies.get("token");
        if (!token) return;

        // Find the full assignment to get shiftId
        const selectedAssignment = fullAssignments.find(a => a.id === assignmentId);
        if (!selectedAssignment) {
            setAvailableSlots([]);
            return;
        }

        const shiftId = selectedAssignment.shiftDto.id;

        setLoadingSlots(true);
        try {
            const res = await fetch(
                `/api/shifts/${shiftId}/slots/available?date=${date}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.ok) {
                const data: AvailableSlot[] = await res.json();
                setAvailableSlots(data);
            } else {
                console.error("Failed to fetch available slots:", res.statusText);
                setAvailableSlots([]);
            }
        } catch (error) {
            console.error("Error fetching available slots:", error);
            setAvailableSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handlePatientChange = (patientId: string) => {
        const selectedPatient = patients.find((p) => p.id === patientId);
        if (selectedPatient) {
            setFormData((prev) => ({
                ...prev,
                patientId: patientId,
                name: selectedPatient.fullName,
                phoneNumber: selectedPatient.phone,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                patientId: "",
                name: "",
                phoneNumber: "",
            }));
        }
    };

    const handleDepartmentChange = (departmentId: string) => {
        const selectedDept = departments.find((d) => d.id === departmentId);
        setFormData((prev) => ({
            ...prev,
            departmentId: departmentId,
            department: selectedDept?.name || "",
            doctorId: "",
            doctor: "",
            room: "",
        }));
    };

    const handleDoctorChange = (doctorId: string) => {
        const selectedDoctor = filteredDoctors.find((d) => d.id === doctorId);
        setFormData((prev) => ({
            ...prev,
            doctorId: doctorId,
            doctor: selectedDoctor?.fullName || "",
            assignmentId: "",
            slotStartTime: "",
            slotEndTime: "",
        }));
    };

    const handleAssignmentChange = (assignmentId: string) => {
        setFormData((prev) => ({
            ...prev,
            assignmentId: assignmentId,
            slotStartTime: "",
            slotEndTime: "",
        }));
    };

    const handleSlotChange = (slotStart: string, slotEnd: string) => {
        setFormData((prev) => ({
            ...prev,
            slotStartTime: slotStart,
            slotEndTime: slotEnd,
        }));
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = () => {
        // Validate appointment date
        const dateError = validateDateOnly(formData.date, "Appointment date");
        if (dateError) {
            alert(dateError);
            return;
        }

        // Validate slot time
        const slotTimeError = validateDateTime(formData.slotStartTime, "Appointment time");
        if (slotTimeError) {
            alert(slotTimeError);
            return;
        }

        // Check if all required fields are filled
        if (
            formData.patientId &&
            formData.doctorId &&
            formData.assignmentId &&
            formData.slotStartTime &&
            formData.slotEndTime
        ) {
            onSave({
                patientId: formData.patientId,
                doctorId: formData.doctorId,
                assignmentId: formData.assignmentId,
                startsAt: formData.slotStartTime,
                endsAt: formData.slotEndTime,
                status: "PENDING",
                type: "NORMAL",
                description: "",
            });
            setFormData({
                patientId: "",
                name: "",
                date: new Date().toISOString().split("T")[0],
                phoneNumber: "",
                departmentId: "",
                department: "",
                doctorId: "",
                doctor: "",
                room: "",
                assignmentId: "",
                slotStartTime: "",
                slotEndTime: "",
            });
        } else {
            alert("Please fill in all required fields.");
        }
    };

    const handleClose = () => {
        setFormData({
            patientId: "",
            name: "",
            date: new Date().toISOString().split("T")[0],
            phoneNumber: "",
            departmentId: "",
            department: "",
            doctorId: "",
            doctor: "",
            room: "",
            assignmentId: "",
            slotStartTime: "",
            slotEndTime: "",
        });
        setFilteredAssignments([]);
        setAvailableSlots([]);
        onClose();
    };

    const isFormValid =
        formData.name &&
        formData.slotStartTime &&
        formData.phoneNumber &&
        formData.doctor &&
        formData.department;

    return (
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-2xl mb-6">Add New Appointment</h3>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control col-span-2">
                            <label className="label">
                                <span className="label-text">
                                    Select Patient{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <select
                                name="patientId"
                                value={formData.patientId}
                                onChange={(e) => handlePatientChange(e.target.value)}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select a patient</option>
                                {patients.map((patient) => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.fullName} - {patient.citizenId} ({patient.phone})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Patient Name{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                readOnly
                                placeholder="Auto-filled from patient selection"
                                className="input input-bordered w-full bg-base-200"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Phone Number{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                readOnly
                                placeholder="Auto-filled from patient selection"
                                className="input input-bordered w-full bg-base-200"
                            />
                        </div>
                    </div>

                    <div className="divider my-2">Appointment Details</div>

                    {/* Step 1: Department */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Department{" "}
                                <span className="text-error">*</span>
                            </span>
                        </label>
                        <select
                            name="departmentId"
                            value={formData.departmentId}
                            onChange={(e) => handleDepartmentChange(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="">Select department first</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Step 2: Doctor */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Doctor <span className="text-error">*</span>
                            </span>
                        </label>
                        <select
                            name="doctorId"
                            value={formData.doctorId}
                            onChange={(e) => handleDoctorChange(e.target.value)}
                            disabled={!formData.departmentId}
                            className="select select-bordered w-full"
                        >
                            <option value="">Select doctor</option>
                            {filteredDoctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.fullName}
                                </option>
                            ))}
                        </select>
                        {!formData.departmentId && (
                            <label className="label">
                                <span className="label-text-alt text-gray-500">
                                    💡 Please select department first
                                </span>
                            </label>
                        )}
                    </div>

                    {/* Step 3: Date */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Appointment Date{" "}
                                <span className="text-error">*</span>
                            </span>
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            onKeyDown={(e) => e.preventDefault()}
                            disabled={!formData.doctorId}
                            className="input input-bordered w-full"
                        />
                        {!formData.doctorId && (
                            <label className="label">
                                <span className="label-text-alt text-gray-500">
                                    💡 Please select doctor first
                                </span>
                            </label>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Step 4: Room */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Room (Optional)
                                </span>
                            </label>
                            <select
                                name="room"
                                value={formData.room}
                                onChange={handleChange}
                                disabled={!formData.departmentId}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select room</option>
                                {filteredRooms.map((room) => (
                                    <option key={room.id} value={room.roomNumber}>
                                        {room.roomNumber}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Step 5: Shift Assignment */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Shift Assignment{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <select
                                name="assignmentId"
                                value={formData.assignmentId}
                                onChange={(e) => handleAssignmentChange(e.target.value)}
                                disabled={!formData.doctorId || loadingAssignments}
                                className="select select-bordered w-full"
                            >
                                <option value="">
                                    {loadingAssignments
                                        ? "Loading..."
                                        : "Select shift"}
                                </option>
                                {filteredAssignments.map((assignment) => (
                                    <option key={assignment.id} value={assignment.id}>
                                        {assignment.shiftName} ({assignment.startTime} -{" "}
                                        {assignment.endTime})
                                    </option>
                                ))}
                            </select>
                            {filteredAssignments.length === 0 && !loadingAssignments && formData.doctorId && (
                                <label className="label">
                                    <span className="label-text-alt text-warning">
                                        ⚠️ No active shifts for this doctor
                                    </span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Step 6: Time Slot */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Appointment Time Slot{" "}
                                <span className="text-error">*</span>
                            </span>
                        </label>
                        <select
                            name="slotStartTime"
                            value={formData.slotStartTime}
                            onChange={(e) => {
                                const selectedSlot = availableSlots.find(
                                    (s) => s.startsAt === e.target.value
                                );
                                if (selectedSlot) {
                                    // Calculate end time based on shift slot duration
                                    const selectedAssignment = fullAssignments.find(
                                        (a) => a.id === formData.assignmentId
                                    );
                                    const slotMinutes = selectedAssignment?.shiftDto.slotMinutes || 30;
                                    const startTime = new Date(selectedSlot.startsAt);
                                    const endTime = new Date(startTime.getTime() + slotMinutes * 60000);
                                    handleSlotChange(selectedSlot.startsAt, endTime.toISOString());
                                }
                            }}
                            disabled={!formData.assignmentId || loadingSlots}
                            className="select select-bordered w-full"
                        >
                            <option value="">
                                {loadingSlots
                                    ? "Loading slots..."
                                    : "Select available time slot"}
                            </option>
                            {availableSlots.map((slot, index) => {
                                const startTime = new Date(slot.startsAt);
                                const selectedAssignment = fullAssignments.find(
                                    (a) => a.id === formData.assignmentId
                                );
                                const slotMinutes = selectedAssignment?.shiftDto.slotMinutes || 30;
                                const endTime = new Date(startTime.getTime() + slotMinutes * 60000);
                                
                                const startTimeStr = startTime.toLocaleTimeString(
                                    "en-US",
                                    { hour: "2-digit", minute: "2-digit", hour12: false }
                                );
                                const endTimeStr = endTime.toLocaleTimeString(
                                    "en-US",
                                    { hour: "2-digit", minute: "2-digit", hour12: false }
                                );
                                const isAvailable = slot.capacity > 0;

                                return (
                                    <option
                                        key={index}
                                        value={slot.startsAt}
                                        disabled={!isAvailable}
                                    >
                                        Slot #{index + 1}: {startTimeStr} - {endTimeStr}
                                        {isAvailable
                                            ? ` (${slot.capacity} available)`
                                            : " (FULL)"}
                                    </option>
                                );
                            })}
                        </select>
                        {!formData.assignmentId ? (
                            <label className="label">
                                <span className="label-text-alt text-gray-500">
                                    💡 Please select shift assignment first
                                </span>
                            </label>
                        ) : availableSlots.length === 0 && !loadingSlots ? (
                            <label className="label">
                                <span className="label-text-alt text-warning">
                                    ⚠️ No available slots for this shift
                                </span>
                            </label>
                        ) : null}
                    </div>
                </div>

                <div className="modal-action">
                    <button onClick={handleClose} className="btn">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isFormValid}
                        className="btn btn-primary"
                    >
                        Save
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={handleClose}>
                <button>close</button>
            </div>
        </div>
    );
}
