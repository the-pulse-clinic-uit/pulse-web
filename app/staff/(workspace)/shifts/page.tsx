"use client";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

// ==================== TYPES ====================

type Shift = {
    id: string;
    name: string;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    slotMinutes: number;
    capacityPerSlot: number;
    totalSlots: number;
    departmentId: string;
    departmentName: string;
    status: "ACTIVE" | "INACTIVE";
    createdAt: string;
};

type ShiftAssignment = {
    id: string;
    shiftId: string;
    shiftName: string;
    doctorId: string;
    doctorName: string;
    roomNumber: string;
    assignedDate: string;
    status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
};

type Doctor = {
    id: string;
    fullName: string;
    specialization: string;
};

type Department = {
    id: string;
    name: string;
};

type ShiftFormData = {
    name: string;
    startTime: string;
    endTime: string;
    slotMinutes: number;
    capacityPerSlot: number;
    departmentId: string;
    status: "ACTIVE" | "INACTIVE";
};

type AssignmentFormData = {
    shiftId: string;
    doctorId: string;
    roomNumber: string;
    assignedDate: string;
};

// ==================== MOCK DATA ====================

const MOCK_DEPARTMENTS: Department[] = [
    { id: "dept-1", name: "General Medicine" },
    { id: "dept-2", name: "Cardiology" },
    { id: "dept-3", name: "Pediatrics" },
    { id: "dept-4", name: "Orthopedics" },
    { id: "dept-5", name: "Dermatology" },
];

const MOCK_DOCTORS: Doctor[] = [
    { id: "doc-1", fullName: "Dr. Nguyen Van A", specialization: "General Medicine" },
    { id: "doc-2", fullName: "Dr. Tran Thi B", specialization: "Cardiology" },
    { id: "doc-3", fullName: "Dr. Le Van C", specialization: "Pediatrics" },
    { id: "doc-4", fullName: "Dr. Pham Thi D", specialization: "Orthopedics" },
    { id: "doc-5", fullName: "Dr. Hoang Van E", specialization: "Dermatology" },
];

const MOCK_SHIFTS: Shift[] = [
    {
        id: "shift-1",
        name: "Morning Shift",
        startTime: "07:00",
        endTime: "12:00",
        slotMinutes: 30,
        capacityPerSlot: 2,
        totalSlots: 10,
        departmentId: "dept-1",
        departmentName: "General Medicine",
        status: "ACTIVE",
        createdAt: "2026-01-01",
    },
    {
        id: "shift-2",
        name: "Afternoon Shift",
        startTime: "13:00",
        endTime: "17:00",
        slotMinutes: 30,
        capacityPerSlot: 2,
        totalSlots: 8,
        departmentId: "dept-1",
        departmentName: "General Medicine",
        status: "ACTIVE",
        createdAt: "2026-01-01",
    },
    {
        id: "shift-3",
        name: "Evening Shift",
        startTime: "17:00",
        endTime: "21:00",
        slotMinutes: 30,
        capacityPerSlot: 1,
        totalSlots: 8,
        departmentId: "dept-2",
        departmentName: "Cardiology",
        status: "ACTIVE",
        createdAt: "2026-01-01",
    },
    {
        id: "shift-4",
        name: "Night Shift",
        startTime: "21:00",
        endTime: "07:00",
        slotMinutes: 60,
        capacityPerSlot: 1,
        totalSlots: 10,
        departmentId: "dept-3",
        departmentName: "Pediatrics",
        status: "INACTIVE",
        createdAt: "2025-12-15",
    },
];

const MOCK_ASSIGNMENTS: ShiftAssignment[] = [
    {
        id: "assign-1",
        shiftId: "shift-1",
        shiftName: "Morning Shift",
        doctorId: "doc-1",
        doctorName: "Dr. Nguyen Van A",
        roomNumber: "101",
        assignedDate: "2026-01-02",
        status: "SCHEDULED",
    },
    {
        id: "assign-2",
        shiftId: "shift-1",
        shiftName: "Morning Shift",
        doctorId: "doc-2",
        doctorName: "Dr. Tran Thi B",
        roomNumber: "102",
        assignedDate: "2026-01-02",
        status: "SCHEDULED",
    },
    {
        id: "assign-3",
        shiftId: "shift-2",
        shiftName: "Afternoon Shift",
        doctorId: "doc-3",
        doctorName: "Dr. Le Van C",
        roomNumber: "103",
        assignedDate: "2026-01-02",
        status: "IN_PROGRESS",
    },
    {
        id: "assign-4",
        shiftId: "shift-3",
        shiftName: "Evening Shift",
        doctorId: "doc-4",
        doctorName: "Dr. Pham Thi D",
        roomNumber: "201",
        assignedDate: "2026-01-01",
        status: "COMPLETED",
    },
];

// ==================== HELPER FUNCTIONS ====================

const getStatusBadgeStyle = (status: string) => {
    switch (status) {
        case "ACTIVE":
        case "SCHEDULED":
            return "bg-green-100 text-green-700";
        case "IN_PROGRESS":
            return "bg-blue-100 text-blue-700";
        case "COMPLETED":
            return "bg-gray-100 text-gray-700";
        case "INACTIVE":
        case "CANCELLED":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

const calculateTotalSlots = (startTime: string, endTime: string, slotMinutes: number): number => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMin;
    let endTotalMinutes = endHour * 60 + endMin;

    // Handle overnight shifts
    if (endTotalMinutes <= startTotalMinutes) {
        endTotalMinutes += 24 * 60;
    }

    const totalMinutes = endTotalMinutes - startTotalMinutes;
    return Math.floor(totalMinutes / slotMinutes);
};

const formatTime = (time: string): string => {
    const [hour, minute] = time.split(":");
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
};

// ==================== MAIN COMPONENT ====================

export default function ShiftsPage() {
    const router = useRouter();

    // Tab state
    const [activeTab, setActiveTab] = useState<"shifts" | "assignments">("shifts");

    // Data state
    const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS);
    const [assignments, setAssignments] = useState<ShiftAssignment[]>(MOCK_ASSIGNMENTS);
    const [departments] = useState<Department[]>(MOCK_DEPARTMENTS);
    const [doctors] = useState<Doctor[]>(MOCK_DOCTORS);
    const [loading, setLoading] = useState(false);

    // Search and Filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        status: "ALL" as string,
        department: "ALL" as string,
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Shift Modal state
    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
    const [isEditingShift, setIsEditingShift] = useState(false);
    const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
    const [shiftFormData, setShiftFormData] = useState<ShiftFormData>({
        name: "",
        startTime: "08:00",
        endTime: "12:00",
        slotMinutes: 30,
        capacityPerSlot: 2,
        departmentId: "",
        status: "ACTIVE",
    });

    // Assignment Modal state
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
    const [assignmentFormData, setAssignmentFormData] = useState<AssignmentFormData>({
        shiftId: "",
        doctorId: "",
        roomNumber: "",
        assignedDate: new Date().toISOString().split("T")[0],
    });

    // View Slots Modal state
    const [isViewSlotsModalOpen, setIsViewSlotsModalOpen] = useState(false);
    const [selectedShiftForSlots, setSelectedShiftForSlots] = useState<Shift | null>(null);

    // ==================== HANDLERS ====================

    // Shift handlers
    const handleOpenShiftModal = (shift?: Shift) => {
        if (shift) {
            setIsEditingShift(true);
            setEditingShiftId(shift.id);
            setShiftFormData({
                name: shift.name,
                startTime: shift.startTime,
                endTime: shift.endTime,
                slotMinutes: shift.slotMinutes,
                capacityPerSlot: shift.capacityPerSlot,
                departmentId: shift.departmentId,
                status: shift.status,
            });
        } else {
            setIsEditingShift(false);
            setEditingShiftId(null);
            setShiftFormData({
                name: "",
                startTime: "08:00",
                endTime: "12:00",
                slotMinutes: 30,
                capacityPerSlot: 2,
                departmentId: "",
                status: "ACTIVE",
            });
        }
        setIsShiftModalOpen(true);
    };

    const handleCloseShiftModal = () => {
        setIsShiftModalOpen(false);
        setIsEditingShift(false);
        setEditingShiftId(null);
    };

    const handleShiftFormChange = (field: keyof ShiftFormData, value: string | number) => {
        setShiftFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmitShift = (e: React.FormEvent) => {
        e.preventDefault();

        const department = departments.find((d) => d.id === shiftFormData.departmentId);
        const totalSlots = calculateTotalSlots(
            shiftFormData.startTime,
            shiftFormData.endTime,
            shiftFormData.slotMinutes
        );

        if (isEditingShift && editingShiftId) {
            // Update existing shift
            setShifts((prev) =>
                prev.map((shift) =>
                    shift.id === editingShiftId
                        ? {
                              ...shift,
                              ...shiftFormData,
                              departmentName: department?.name || "",
                              totalSlots,
                          }
                        : shift
                )
            );
            alert("Shift updated successfully!");
        } else {
            // Create new shift
            const newShift: Shift = {
                id: `shift-${Date.now()}`,
                ...shiftFormData,
                departmentName: department?.name || "",
                totalSlots,
                createdAt: new Date().toISOString().split("T")[0],
            };
            setShifts((prev) => [...prev, newShift]);
            alert("Shift created successfully!");
        }

        handleCloseShiftModal();
    };

    const handleDeleteShift = (shiftId: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this shift?");
        if (confirmed) {
            setShifts((prev) => prev.filter((s) => s.id !== shiftId));
            // Also remove related assignments
            setAssignments((prev) => prev.filter((a) => a.shiftId !== shiftId));
            alert("Shift deleted successfully!");
        }
    };

    const handleViewSlots = (shift: Shift) => {
        setSelectedShiftForSlots(shift);
        setIsViewSlotsModalOpen(true);
    };

    // Assignment handlers
    const handleOpenAssignmentModal = () => {
        setAssignmentFormData({
            shiftId: "",
            doctorId: "",
            roomNumber: "",
            assignedDate: new Date().toISOString().split("T")[0],
        });
        setIsAssignmentModalOpen(true);
    };

    const handleCloseAssignmentModal = () => {
        setIsAssignmentModalOpen(false);
    };

    const handleAssignmentFormChange = (field: keyof AssignmentFormData, value: string) => {
        setAssignmentFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmitAssignment = (e: React.FormEvent) => {
        e.preventDefault();

        const shift = shifts.find((s) => s.id === assignmentFormData.shiftId);
        const doctor = doctors.find((d) => d.id === assignmentFormData.doctorId);

        const newAssignment: ShiftAssignment = {
            id: `assign-${Date.now()}`,
            shiftId: assignmentFormData.shiftId,
            shiftName: shift?.name || "",
            doctorId: assignmentFormData.doctorId,
            doctorName: doctor?.fullName || "",
            roomNumber: assignmentFormData.roomNumber,
            assignedDate: assignmentFormData.assignedDate,
            status: "SCHEDULED",
        };

        setAssignments((prev) => [...prev, newAssignment]);
        alert("Doctor assigned to shift successfully!");
        handleCloseAssignmentModal();
    };

    const handleCancelAssignment = (assignmentId: string) => {
        const confirmed = window.confirm("Are you sure you want to cancel this assignment?");
        if (confirmed) {
            setAssignments((prev) =>
                prev.map((a) => (a.id === assignmentId ? { ...a, status: "CANCELLED" } : a))
            );
            alert("Assignment cancelled successfully!");
        }
    };

    // Filter and search handlers
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleOpenFilterModal = () => {
        setIsFilterModalOpen(true);
    };

    const handleCloseFilterModal = () => {
        setIsFilterModalOpen(false);
    };

    const handleResetFilters = () => {
        setFilters({ status: "ALL", department: "ALL" });
    };

    const handleApplyFilters = () => {
        setIsFilterModalOpen(false);
    };

    // ==================== FILTERED DATA ====================

    const filteredShifts = useMemo(() => {
        let result = [...shifts];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (shift) =>
                    shift.name.toLowerCase().includes(query) ||
                    shift.departmentName.toLowerCase().includes(query)
            );
        }

        if (filters.status !== "ALL") {
            result = result.filter((shift) => shift.status === filters.status);
        }

        if (filters.department !== "ALL") {
            result = result.filter((shift) => shift.departmentId === filters.department);
        }

        return result;
    }, [shifts, searchQuery, filters]);

    const filteredAssignments = useMemo(() => {
        let result = [...assignments];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (assignment) =>
                    assignment.doctorName.toLowerCase().includes(query) ||
                    assignment.shiftName.toLowerCase().includes(query) ||
                    assignment.roomNumber.toLowerCase().includes(query)
            );
        }

        if (filters.status !== "ALL") {
            result = result.filter((assignment) => assignment.status === filters.status);
        }

        return result;
    }, [assignments, searchQuery, filters]);

    // ==================== COLUMN DEFINITIONS ====================

    const shiftColumns = useMemo<ColumnDef<Shift>[]>(
        () => [
            { header: "Shift Name", accessorKey: "name", className: "font-medium" },
            {
                header: "Time",
                cell: (row) => (
                    <span>
                        {formatTime(row.startTime)} - {formatTime(row.endTime)}
                    </span>
                ),
            },
            {
                header: "Slot Duration",
                cell: (row) => <span>{row.slotMinutes} mins</span>,
            },
            {
                header: "Capacity/Slot",
                accessorKey: "capacityPerSlot",
            },
            {
                header: "Total Slots",
                accessorKey: "totalSlots",
                className: "font-semibold",
            },
            { header: "Department", accessorKey: "departmentName" },
            {
                header: "Status",
                cell: (row) => (
                    <span className={`badge border-none ${getStatusBadgeStyle(row.status)}`}>
                        {row.status}
                    </span>
                ),
            },
            {
                header: "Actions",
                cell: (row) => (
                    <div className="flex flex-row gap-2">
                        <button
                            className="btn btn-xs bg-blue-100 text-blue-700 border-none hover:bg-blue-200"
                            onClick={() => handleViewSlots(row)}
                        >
                            View Slots
                        </button>
                        <button
                            className="btn btn-xs bg-yellow-100 text-yellow-700 border-none hover:bg-yellow-200"
                            onClick={() => handleOpenShiftModal(row)}
                        >
                            Edit
                        </button>
                        <button
                            className="btn btn-xs bg-red-100 text-red-700 border-none hover:bg-red-200"
                            onClick={() => handleDeleteShift(row.id)}
                        >
                            Delete
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    const assignmentColumns = useMemo<ColumnDef<ShiftAssignment>[]>(
        () => [
            { header: "Date", accessorKey: "assignedDate", className: "font-medium" },
            { header: "Shift", accessorKey: "shiftName" },
            { header: "Doctor", accessorKey: "doctorName", className: "font-medium" },
            { header: "Room", accessorKey: "roomNumber" },
            {
                header: "Status",
                cell: (row) => (
                    <span className={`badge border-none ${getStatusBadgeStyle(row.status)}`}>
                        {row.status}
                    </span>
                ),
            },
            {
                header: "Actions",
                cell: (row) => (
                    <div className="flex flex-row gap-2">
                        {row.status === "SCHEDULED" && (
                            <button
                                className="btn btn-xs bg-red-100 text-red-700 border-none hover:bg-red-200"
                                onClick={() => handleCancelAssignment(row.id)}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                ),
            },
        ],
        []
    );

    // ==================== GENERATE SLOTS FOR PREVIEW ====================

    const generateSlots = (shift: Shift) => {
        const slots = [];
        const [startHour, startMin] = shift.startTime.split(":").map(Number);
        let currentMinutes = startHour * 60 + startMin;

        for (let i = 0; i < shift.totalSlots; i++) {
            const slotStartHour = Math.floor(currentMinutes / 60) % 24;
            const slotStartMin = currentMinutes % 60;
            const slotEndMinutes = currentMinutes + shift.slotMinutes;
            const slotEndHour = Math.floor(slotEndMinutes / 60) % 24;
            const slotEndMin = slotEndMinutes % 60;

            slots.push({
                slotNumber: i + 1,
                startTime: `${String(slotStartHour).padStart(2, "0")}:${String(slotStartMin).padStart(2, "0")}`,
                endTime: `${String(slotEndHour).padStart(2, "0")}:${String(slotEndMin).padStart(2, "0")}`,
                capacity: shift.capacityPerSlot,
            });

            currentMinutes += shift.slotMinutes;
        }

        return slots;
    };

    // ==================== RENDER ====================

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header tabName="Shift Management" userName="Staff Member" />

            {/* Tabs */}
            <div className="tabs tabs-boxed bg-base-200 w-fit">
                <button
                    className={`tab ${activeTab === "shifts" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("shifts")}
                >
                    Shifts
                </button>
                <button
                    className={`tab ${activeTab === "assignments" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("assignments")}
                >
                    Doctor Assignments
                </button>
            </div>

            <Toolbar
                buttonName={activeTab === "shifts" ? "Shift" : "Assignment"}
                onSearch={handleSearch}
                onFilter={handleOpenFilterModal}
                onAdd={activeTab === "shifts" ? () => handleOpenShiftModal() : handleOpenAssignmentModal}
            />

            {/* Active filters display */}
            {(filters.status !== "ALL" || filters.department !== "ALL" || searchQuery) && (
                <div className="flex flex-wrap items-center gap-2 px-4">
                    <span className="text-sm font-semibold text-gray-600">Active Filters:</span>
                    {searchQuery && (
                        <div className="badge badge-lg gap-2">
                            Search: &quot;{searchQuery}&quot;
                            <button onClick={() => setSearchQuery("")} className="text-xs hover:text-error">
                                ✕
                            </button>
                        </div>
                    )}
                    {filters.status !== "ALL" && (
                        <div className="badge badge-lg gap-2">
                            Status: {filters.status}
                            <button
                                onClick={() => setFilters({ ...filters, status: "ALL" })}
                                className="text-xs hover:text-error"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    {filters.department !== "ALL" && activeTab === "shifts" && (
                        <div className="badge badge-lg gap-2">
                            Department: {departments.find((d) => d.id === filters.department)?.name}
                            <button
                                onClick={() => setFilters({ ...filters, department: "ALL" })}
                                className="text-xs hover:text-error"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    <button onClick={handleResetFilters} className="btn btn-xs btn-ghost text-error">
                        Clear All
                    </button>
                </div>
            )}

            <div className="px-4">
                <p className="text-sm text-gray-600">
                    Showing{" "}
                    {activeTab === "shifts" ? filteredShifts.length : filteredAssignments.length} of{" "}
                    {activeTab === "shifts" ? shifts.length : assignments.length}{" "}
                    {activeTab === "shifts" ? "shifts" : "assignments"}
                </p>
            </div>

            {/* Data Table */}
            {activeTab === "shifts" ? (
                <DataTable columns={shiftColumns} data={filteredShifts} />
            ) : (
                <DataTable columns={assignmentColumns} data={filteredAssignments} />
            )}

            <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />

            {/* ==================== MODALS ==================== */}

            {/* Create/Edit Shift Modal */}
            {isShiftModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="font-bold text-xl mb-6">
                            {isEditingShift ? "Edit Shift" : "Create New Shift"}
                        </h3>

                        <form onSubmit={handleSubmitShift} className="space-y-5">
                            {/* Shift Name */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Shift Name *</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="e.g., Morning Shift"
                                    value={shiftFormData.name}
                                    onChange={(e) => handleShiftFormChange("name", e.target.value)}
                                    required
                                />
                            </div>

                            {/* Time Range */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Start Time *</span>
                                    </label>
                                    <input
                                        type="time"
                                        className="input input-bordered w-full"
                                        value={shiftFormData.startTime}
                                        onChange={(e) => handleShiftFormChange("startTime", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">End Time *</span>
                                    </label>
                                    <input
                                        type="time"
                                        className="input input-bordered w-full"
                                        value={shiftFormData.endTime}
                                        onChange={(e) => handleShiftFormChange("endTime", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Slot Configuration */}
                            <div className="divider">Slot Configuration</div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Slot Duration (minutes) *</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={shiftFormData.slotMinutes}
                                        onChange={(e) =>
                                            handleShiftFormChange("slotMinutes", parseInt(e.target.value))
                                        }
                                    >
                                        <option value={15}>15 minutes</option>
                                        <option value={30}>30 minutes</option>
                                        <option value={45}>45 minutes</option>
                                        <option value={60}>60 minutes</option>
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Capacity Per Slot *</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="input input-bordered w-full"
                                        min={1}
                                        max={10}
                                        value={shiftFormData.capacityPerSlot}
                                        onChange={(e) =>
                                            handleShiftFormChange("capacityPerSlot", parseInt(e.target.value))
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            {/* Calculated Slots Preview */}
                            <div className="bg-base-200 p-4 rounded-lg">
                                <p className="text-sm font-semibold mb-2">📊 Calculated Slots:</p>
                                <p className="text-lg font-bold text-primary">
                                    {calculateTotalSlots(
                                        shiftFormData.startTime,
                                        shiftFormData.endTime,
                                        shiftFormData.slotMinutes
                                    )}{" "}
                                    slots
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Total capacity:{" "}
                                    {calculateTotalSlots(
                                        shiftFormData.startTime,
                                        shiftFormData.endTime,
                                        shiftFormData.slotMinutes
                                    ) * shiftFormData.capacityPerSlot}{" "}
                                    patients
                                </p>
                            </div>

                            {/* Department */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Department *</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={shiftFormData.departmentId}
                                    onChange={(e) => handleShiftFormChange("departmentId", e.target.value)}
                                    required
                                >
                                    <option value="">Select a department</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Status</span>
                                </label>
                                <div className="flex gap-4">
                                    <label className="label cursor-pointer gap-2">
                                        <input
                                            type="radio"
                                            name="status"
                                            className="radio radio-primary"
                                            value="ACTIVE"
                                            checked={shiftFormData.status === "ACTIVE"}
                                            onChange={(e) => handleShiftFormChange("status", e.target.value)}
                                        />
                                        <span className="label-text">Active</span>
                                    </label>
                                    <label className="label cursor-pointer gap-2">
                                        <input
                                            type="radio"
                                            name="status"
                                            className="radio radio-error"
                                            value="INACTIVE"
                                            checked={shiftFormData.status === "INACTIVE"}
                                            onChange={(e) => handleShiftFormChange("status", e.target.value)}
                                        />
                                        <span className="label-text">Inactive</span>
                                    </label>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="modal-action mt-8 gap-3">
                                <button type="button" className="btn btn-ghost" onClick={handleCloseShiftModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary px-8">
                                    {isEditingShift ? "Update Shift" : "Create Shift"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Doctor Modal */}
            {isAssignmentModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-lg">
                        <h3 className="font-bold text-xl mb-6">Assign Doctor to Shift</h3>

                        <form onSubmit={handleSubmitAssignment} className="space-y-5">
                            {/* Date */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Date *</span>
                                </label>
                                <input
                                    type="date"
                                    className="input input-bordered w-full"
                                    value={assignmentFormData.assignedDate}
                                    onChange={(e) => handleAssignmentFormChange("assignedDate", e.target.value)}
                                    required
                                />
                            </div>

                            {/* Shift */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Shift *</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={assignmentFormData.shiftId}
                                    onChange={(e) => handleAssignmentFormChange("shiftId", e.target.value)}
                                    required
                                >
                                    <option value="">Select a shift</option>
                                    {shifts
                                        .filter((s) => s.status === "ACTIVE")
                                        .map((shift) => (
                                            <option key={shift.id} value={shift.id}>
                                                {shift.name} ({formatTime(shift.startTime)} -{" "}
                                                {formatTime(shift.endTime)}) - {shift.departmentName}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Doctor */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Doctor *</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={assignmentFormData.doctorId}
                                    onChange={(e) => handleAssignmentFormChange("doctorId", e.target.value)}
                                    required
                                >
                                    <option value="">Select a doctor</option>
                                    {doctors.map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>
                                            {doctor.fullName} - {doctor.specialization}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Room Number */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Room Number *</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="e.g., 101, A-201"
                                    value={assignmentFormData.roomNumber}
                                    onChange={(e) => handleAssignmentFormChange("roomNumber", e.target.value)}
                                    required
                                />
                            </div>

                            {/* Actions */}
                            <div className="modal-action mt-8 gap-3">
                                <button type="button" className="btn btn-ghost" onClick={handleCloseAssignmentModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary px-8">
                                    Assign Doctor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Slots Modal */}
            {isViewSlotsModalOpen && selectedShiftForSlots && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
                        <h3 className="font-bold text-xl mb-2">Slot Details</h3>
                        <p className="text-gray-600 mb-6">
                            {selectedShiftForSlots.name} ({formatTime(selectedShiftForSlots.startTime)} -{" "}
                            {formatTime(selectedShiftForSlots.endTime)})
                        </p>

                        <div className="bg-base-200 p-4 rounded-lg mb-6">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-sm text-gray-500">Total Slots</p>
                                    <p className="text-2xl font-bold text-primary">
                                        {selectedShiftForSlots.totalSlots}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Slot Duration</p>
                                    <p className="text-2xl font-bold">{selectedShiftForSlots.slotMinutes} min</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Capacity/Slot</p>
                                    <p className="text-2xl font-bold">{selectedShiftForSlots.capacityPerSlot}</p>
                                </div>
                            </div>
                        </div>

                        <div className="divider">Slot Schedule</div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {generateSlots(selectedShiftForSlots).map((slot) => (
                                <div
                                    key={slot.slotNumber}
                                    className="bg-base-100 border border-base-300 rounded-lg p-3 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="badge badge-primary badge-sm">
                                            Slot #{slot.slotNumber}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Cap: {slot.capacity}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold">
                                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="modal-action mt-8">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => setIsViewSlotsModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Modal */}
            {isFilterModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-lg">
                        <h3 className="font-bold text-xl mb-6">
                            Filter {activeTab === "shifts" ? "Shifts" : "Assignments"}
                        </h3>

                        <div className="space-y-5">
                            {/* Status Filter */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Status</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                >
                                    <option value="ALL">All Status</option>
                                    {activeTab === "shifts" ? (
                                        <>
                                            <option value="ACTIVE">Active</option>
                                            <option value="INACTIVE">Inactive</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="SCHEDULED">Scheduled</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            {/* Department Filter (only for shifts) */}
                            {activeTab === "shifts" && (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Department</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={filters.department}
                                        onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                                    >
                                        <option value="ALL">All Departments</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="modal-action mt-6">
                            <button type="button" className="btn btn-ghost" onClick={handleResetFilters}>
                                Reset
                            </button>
                            <button type="button" className="btn btn-ghost" onClick={handleCloseFilterModal}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleApplyFilters}>
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
