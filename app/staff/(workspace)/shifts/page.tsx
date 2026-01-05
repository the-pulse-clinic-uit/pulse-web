"use client";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useCallback, useEffect, useMemo, useState } from "react";

// ==================== TYPES ====================

interface UserData {
    fullName: string;
    avatarUrl: string;
    email: string;
}

interface StaffData {
    id: string;
    departmentDto: {
        id: string;
        name: string;
    };
}

interface DepartmentDto {
    id: string;
    name: string;
    description: string;
    createdAt: string;
}

interface RoomDto {
    id: string;
    roomNumber: string;
    bedAmount: number;
    isAvailable: boolean;
    createdAt: string;
    departmentDto: DepartmentDto;
}

interface ShiftDto {
    id: string;
    name: string;
    kind: "ER" | "CLINIC";
    startTime: string; // ISO DateTime
    endTime: string; // ISO DateTime
    slotMinutes: number;
    capacityPerSlot: number;
    createdAt: string;
    departmentDto?: DepartmentDto;
    defaultRoomDto?: RoomDto;
}

interface DoctorDto {
    id: string;
    licenseId: string;
    isVerified: boolean;
    createdAt: string;
    staffDto: {
        id: string;
        position: string;
        userDto: {
            fullName: string;
            email: string;
        };
        departmentDto: {
            id: string;
            name: string;
        } | null;
    };
}

interface ShiftAssignmentDto {
    id: string;
    dutyDate: string; // ISO Date (yyyy-MM-dd)
    roleInShift: "ON_CALL" | "PRIMARY";
    status: "ACTIVE" | "CANCELLED";
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    doctorDto: DoctorDto;
    shiftDto: ShiftDto;
    roomDto: RoomDto | null;
}

interface ShiftFormData {
    name: string;
    kind: "ER" | "CLINIC";
    startTime: string; // ISO DateTime
    endTime: string; // ISO DateTime
    slotMinutes: number;
    capacityPerSlot: number;
    departmentId: string;
    defaultRoomId: string;
}

interface AssignmentFormData {
    shiftId: string;
    doctorId: string;
    roomId: string;
    dutyDate: string; // ISO Date
    roleInShift: "ON_CALL" | "PRIMARY";
    status: "ACTIVE" | "CANCELLED";
    notes: string;
}

// Display types for table
type ShiftDisplay = {
    id: string;
    name: string;
    kind: string;
    startTime: string;
    endTime: string;
    slotMinutes: number;
    capacityPerSlot: number;
    totalSlots: number;
    departmentName: string;
    roomNumber: string;
};

type AssignmentDisplay = {
    id: string;
    dutyDate: string;
    shiftName: string;
    doctorName: string;
    roomNumber: string;
    roleInShift: string;
    status: string;
};

// ==================== HELPER FUNCTIONS ====================

const getKindBadgeStyle = (kind: string) => {
    return kind === "ER" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700";
};

const getStatusBadgeStyle = (status: string) => {
    return status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
};

const getRoleBadgeStyle = (role: string) => {
    return role === "PRIMARY" ? "bg-purple-100 text-purple-700" : "bg-yellow-100 text-yellow-700";
};

const calculateTotalSlots = (startTime: string, endTime: string, slotMinutes: number): number => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    return Math.floor(diffMinutes / slotMinutes);
};

const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

// Convert local datetime input to ISO string
const toISODateTime = (dateStr: string, timeStr: string): string => {
    return `${dateStr}T${timeStr}:00`;
};

// Extract date and time from ISO string for input fields
const extractDateTime = (isoString: string): { date: string; time: string } => {
    const dt = new Date(isoString);
    const date = dt.toISOString().split("T")[0];
    const time = dt.toTimeString().slice(0, 5);
    return { date, time };
};

// ==================== VALIDATION FUNCTIONS ====================

const validateDateTime = (dateTimeStr: string, fieldName: string): string | null => {
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

const validateDateTimeRange = (
    startDateTime: string,
    endDateTime: string
): string | null => {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    
    if (end <= start) {
        return "End time must be after start time.";
    }
    
    return null;
};

// ==================== MAIN COMPONENT ====================

export default function ShiftsPage() {
    const router = useRouter();

    // User data
    const [user, setUser] = useState<UserData | null>(null);
    const [staff, setStaff] = useState<StaffData | null>(null);

    // Tab state
    const [activeTab, setActiveTab] = useState<"shifts" | "assignments">("shifts");

    // Data state
    const [shifts, setShifts] = useState<ShiftDto[]>([]);
    const [assignments, setAssignments] = useState<ShiftAssignmentDto[]>([]);
    const [departments, setDepartments] = useState<DepartmentDto[]>([]);
    const [rooms, setRooms] = useState<RoomDto[]>([]);
    const [doctors, setDoctors] = useState<DoctorDto[]>([]);
    const [loading, setLoading] = useState(true);

    // Search and Filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        status: "ALL" as string,
        kind: "ALL" as string,
        department: "ALL" as string,
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Shift Modal state
    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
    const [isEditingShift, setIsEditingShift] = useState(false);
    const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
    const [shiftFormData, setShiftFormData] = useState<ShiftFormData>({
        name: "",
        kind: "CLINIC",
        startTime: toISODateTime(new Date().toISOString().split("T")[0], "08:00"),
        endTime: toISODateTime(new Date().toISOString().split("T")[0], "12:00"),
        slotMinutes: 30,
        capacityPerSlot: 2,
        departmentId: "",
        defaultRoomId: "",
    });

    // Assignment Modal state
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
    const [assignmentFormData, setAssignmentFormData] = useState<AssignmentFormData>({
        shiftId: "",
        doctorId: "",
        roomId: "",
        dutyDate: new Date().toISOString().split("T")[0],
        roleInShift: "PRIMARY",
        status: "ACTIVE",
        notes: "",
    });
    const [filteredDoctorsForAssignment, setFilteredDoctorsForAssignment] = useState<DoctorDto[]>([]);
    const [filteredRoomsForAssignment, setFilteredRoomsForAssignment] = useState<RoomDto[]>([]);

    // View Slots Modal state
    const [isViewSlotsModalOpen, setIsViewSlotsModalOpen] = useState(false);
    const [selectedShiftForSlots, setSelectedShiftForSlots] = useState<ShiftDto | null>(null);

    // ==================== FETCH DATA ====================

    const fetchUserData = useCallback(async () => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/staff/login");
            return;
        }

        try {
            const userRes = await fetch("/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (userRes.ok) {
                const userData = await userRes.json();
                setUser(userData);
            }

            const staffRes = await fetch("/api/staff/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (staffRes.ok) {
                const staffData = await staffRes.json();
                setStaff(staffData);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }, [router]);

    const fetchShifts = useCallback(async () => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            const res = await fetch("/api/shifts", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const text = await res.text();
                if (text) {
                    const data: ShiftDto[] = JSON.parse(text);
                    setShifts(data);
                }
            }
        } catch (error) {
            console.error("Error fetching shifts:", error);
        }
    }, []);

    const fetchAssignments = useCallback(async () => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            // Fetch assignments for current date range
            // Note: API requires per-shift or per-doctor queries
            // For demo, we'll fetch for today across all shifts
            const allAssignments: ShiftAssignmentDto[] = [];
            
            for (const shift of shifts) {
                const today = new Date().toISOString().split("T")[0];
                const res = await fetch(`/api/shifts/${shift.id}/assignments?date=${today}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const text = await res.text();
                    if (text) {
                        const data: ShiftAssignmentDto[] = JSON.parse(text);
                        allAssignments.push(...data);
                    }
                }
            }

            setAssignments(allAssignments);
        } catch (error) {
            console.error("Error fetching assignments:", error);
        }
    }, [shifts]);

    const fetchDepartments = useCallback(async () => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            const res = await fetch("/api/departments", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const text = await res.text();
                if (text) {
                    const data: DepartmentDto[] = JSON.parse(text);
                    setDepartments(data);
                }
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    }, []);

    const fetchRooms = useCallback(async () => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            const res = await fetch("/api/rooms", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const text = await res.text();
                if (text) {
                    const data: RoomDto[] = JSON.parse(text);
                    setRooms(data);
                }
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    }, []);

    const fetchDoctors = useCallback(async () => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            const res = await fetch("/api/doctors", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const text = await res.text();
                if (text) {
                    const data: DoctorDto[] = JSON.parse(text);
                    setDoctors(data);
                }
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    }, []);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        await Promise.all([
            fetchUserData(),
            fetchShifts(),
            fetchDepartments(),
            fetchRooms(),
            fetchDoctors(),
        ]);
        setLoading(false);
    }, [fetchUserData, fetchShifts, fetchDepartments, fetchRooms, fetchDoctors]);

    useEffect(() => {
        void fetchAllData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (shifts.length > 0) {
            void fetchAssignments();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shifts]);

    // Filter doctors and rooms when shift is selected for assignment
    useEffect(() => {
        if (assignmentFormData.shiftId) {
            const selectedShift = shifts.find((s) => s.id === assignmentFormData.shiftId);
            if (selectedShift?.departmentDto?.id) {
                const deptId = selectedShift.departmentDto.id;
                
                // Filter doctors by shift's department
                const filteredDocs = doctors.filter(
                    (doctor) => doctor.staffDto.departmentDto?.id === deptId
                );
                setFilteredDoctorsForAssignment(filteredDocs);
                
                // Filter rooms by shift's department
                const filteredRms = rooms.filter(
                    (room) => room.departmentDto?.id === deptId
                );
                setFilteredRoomsForAssignment(filteredRms);
            } else {
                setFilteredDoctorsForAssignment(doctors);
                setFilteredRoomsForAssignment(rooms);
            }
        } else {
            setFilteredDoctorsForAssignment([]);
            setFilteredRoomsForAssignment([]);
        }
    }, [assignmentFormData.shiftId, shifts, doctors, rooms]);

    // ==================== SHIFT HANDLERS ====================

    const handleOpenShiftModal = useCallback((shift?: ShiftDto) => {
        if (shift) {
            setIsEditingShift(true);
            setEditingShiftId(shift.id);
            setShiftFormData({
                name: shift.name,
                kind: shift.kind,
                startTime: shift.startTime,
                endTime: shift.endTime,
                slotMinutes: shift.slotMinutes,
                capacityPerSlot: shift.capacityPerSlot,
                departmentId: shift.departmentDto?.id || staff?.departmentDto?.id || "",
                defaultRoomId: shift.defaultRoomDto?.id || "",
            });
        } else {
            setIsEditingShift(false);
            setEditingShiftId(null);
            const today = new Date().toISOString().split("T")[0];
            setShiftFormData({
                name: "",
                kind: "CLINIC",
                startTime: toISODateTime(today, "08:00"),
                endTime: toISODateTime(today, "12:00"),
                slotMinutes: 30,
                capacityPerSlot: 2,
                departmentId: staff?.departmentDto?.id || "",
                defaultRoomId: "",
            });
        }
        setIsShiftModalOpen(true);
    }, [staff]);

    const handleCloseShiftModal = () => {
        setIsShiftModalOpen(false);
        setIsEditingShift(false);
        setEditingShiftId(null);
    };

    const handleShiftFormChange = (field: keyof ShiftFormData, value: string | number) => {
        setShiftFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleShiftDateTimeChange = (field: "start" | "end", type: "date" | "time", value: string) => {
        const currentDateTime = field === "start" ? shiftFormData.startTime : shiftFormData.endTime;
        const { date: currentDate, time: currentTime } = extractDateTime(currentDateTime);

        const newDate = type === "date" ? value : currentDate;
        const newTime = type === "time" ? value : currentTime;
        const newDateTime = toISODateTime(newDate, newTime);

        if (field === "start") {
            setShiftFormData((prev) => ({ ...prev, startTime: newDateTime }));
        } else {
            setShiftFormData((prev) => ({ ...prev, endTime: newDateTime }));
        }
    };

    const handleSubmitShift = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate dates before submitting
        const startTimeError = validateDateTime(shiftFormData.startTime, "Start date/time");
        if (startTimeError) {
            alert(startTimeError);
            return;
        }

        const endTimeError = validateDateTime(shiftFormData.endTime, "End date/time");
        if (endTimeError) {
            alert(endTimeError);
            return;
        }

        const rangeError = validateDateTimeRange(shiftFormData.startTime, shiftFormData.endTime);
        if (rangeError) {
            alert(rangeError);
            return;
        }

        const token = Cookies.get("token");
        if (!token) {
            router.push("/staff/login");
            return;
        }

        try {
            const requestBody = {
                name: shiftFormData.name,
                kind: shiftFormData.kind,
                startTime: shiftFormData.startTime,
                endTime: shiftFormData.endTime,
                slotMinutes: shiftFormData.slotMinutes,
                capacityPerSlot: shiftFormData.capacityPerSlot,
                departmentId: shiftFormData.departmentId || null,
                defaultRoomId: shiftFormData.defaultRoomId || null,
            };

            if (isEditingShift && editingShiftId) {
                // Update
                const res = await fetch(`/api/shifts/${editingShiftId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(requestBody),
                });

                if (res.ok) {
                    alert("Shift updated successfully!");
                    handleCloseShiftModal();
                    await fetchShifts();
                } else {
                    try {
                        const text = await res.text();
                        const errorData = text ? JSON.parse(text) : {};
                        alert(`Failed to update shift: ${errorData.message || "Unknown error"}`);
                    } catch {
                        alert(`Failed to update shift: ${res.statusText}`);
                    }
                }
            } else {
                // Create
                const res = await fetch("/api/shifts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(requestBody),
                });

                if (res.ok) {
                    alert("Shift created successfully!");
                    handleCloseShiftModal();
                    await fetchShifts();
                } else {
                    try {
                        const text = await res.text();
                        const errorData = text ? JSON.parse(text) : {};
                        alert(`Failed to create shift: ${errorData.message || "Unknown error"}`);
                    } catch {
                        alert(`Failed to create shift: ${res.statusText}`);
                    }
                }
            }
        } catch (error) {
            console.error("Submit shift error:", error);
            alert("An error occurred while saving the shift");
        }
    };

    const handleDeleteShift = useCallback(async (shiftId: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this shift?");
        if (!confirmed) return;

        const token = Cookies.get("token");
        if (!token) {
            router.push("/staff/login");
            return;
        }

        try {
            const res = await fetch(`/api/shifts/${shiftId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok || res.status === 204) {
                alert("Shift deleted successfully!");
                await fetchShifts();
            } else {
                alert("Failed to delete shift");
            }
        } catch (error) {
            console.error("Delete shift error:", error);
            alert("An error occurred while deleting the shift");
        }
    }, [router, fetchShifts]);

    const handleViewSlots = (shift: ShiftDto) => {
        setSelectedShiftForSlots(shift);
        setIsViewSlotsModalOpen(true);
    };

    // ==================== ASSIGNMENT HANDLERS ====================

    const handleOpenAssignmentModal = () => {
        setAssignmentFormData({
            shiftId: "",
            doctorId: "",
            roomId: "",
            dutyDate: new Date().toISOString().split("T")[0],
            roleInShift: "PRIMARY",
            status: "ACTIVE",
            notes: "",
        });
        setIsAssignmentModalOpen(true);
    };

    const handleCloseAssignmentModal = () => {
        setIsAssignmentModalOpen(false);
    };

    const handleAssignmentFormChange = (field: keyof AssignmentFormData, value: string) => {
        setAssignmentFormData((prev) => {
            // If changing shift, reset doctor and room selections
            if (field === "shiftId") {
                return { ...prev, [field]: value, doctorId: "", roomId: "" };
            }
            return { ...prev, [field]: value };
        });
    };

    const handleSubmitAssignment = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate duty date before submitting
        const dateError = validateDateOnly(assignmentFormData.dutyDate, "Duty date");
        if (dateError) {
            alert(dateError);
            return;
        }

        const token = Cookies.get("token");
        if (!token) {
            router.push("/staff/login");
            return;
        }

        try {
            const requestBody = {
                dutyDate: assignmentFormData.dutyDate,
                roleInShift: assignmentFormData.roleInShift,
                status: assignmentFormData.status,
                notes: assignmentFormData.notes || null,
                doctorId: assignmentFormData.doctorId,
                shiftId: assignmentFormData.shiftId,
                roomId: assignmentFormData.roomId || null,
            };

            const res = await fetch("/api/shifts/assignments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (res.ok) {
                alert("Doctor assigned to shift successfully!");
                handleCloseAssignmentModal();
                await fetchAssignments();
            } else {
                try {
                    const text = await res.text();
                    const errorData = text ? JSON.parse(text) : {};
                    alert(`Failed to assign doctor: ${errorData.message || "Unknown error"}`);
                } catch {
                    alert(`Failed to assign doctor: ${res.statusText}`);
                }
            }
        } catch (error) {
            console.error("Submit assignment error:", error);
            alert("An error occurred while assigning doctor");
        }
    };

    const handleCancelAssignment = useCallback(async (assignmentId: string) => {
        const confirmed = window.confirm("Are you sure you want to cancel this assignment?");
        if (!confirmed) return;

        const token = Cookies.get("token");
        if (!token) {
            router.push("/staff/login");
            return;
        }

        try {
            const res = await fetch(`/api/shifts/assignments/${assignmentId}/status?status=CANCELLED`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                alert("Assignment cancelled successfully!");
                await fetchAssignments();
            } else {
                alert("Failed to cancel assignment");
            }
        } catch (error) {
            console.error("Cancel assignment error:", error);
            alert("An error occurred while cancelling the assignment");
        }
    }, [router, fetchAssignments]);

    // ==================== FILTER AND SEARCH HANDLERS ====================

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
        setFilters({ status: "ALL", kind: "ALL", department: "ALL" });
    };

    const handleApplyFilters = () => {
        setIsFilterModalOpen(false);
    };

    // ==================== FILTERED DATA ====================

    const shiftsDisplay = useMemo<ShiftDisplay[]>(() => {
        return shifts.map((shift) => ({
            id: shift.id,
            name: shift.name,
            kind: shift.kind,
            startTime: shift.startTime,
            endTime: shift.endTime,
            slotMinutes: shift.slotMinutes,
            capacityPerSlot: shift.capacityPerSlot,
            totalSlots: calculateTotalSlots(shift.startTime, shift.endTime, shift.slotMinutes),
            departmentName: shift.departmentDto?.name || "N/A",
            roomNumber: shift.defaultRoomDto?.roomNumber || "N/A",
        }));
    }, [shifts]);

    const assignmentsDisplay = useMemo<AssignmentDisplay[]>(() => {
        return assignments.map((assignment) => ({
            id: assignment.id,
            dutyDate: assignment.dutyDate,
            shiftName: assignment.shiftDto.name,
            doctorName: assignment.doctorDto.staffDto.userDto.fullName,
            roomNumber: assignment.roomDto?.roomNumber || "N/A",
            roleInShift: assignment.roleInShift,
            status: assignment.status,
        }));
    }, [assignments]);

    const filteredShifts = useMemo(() => {
        let result = [...shiftsDisplay];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (shift) =>
                    shift.name.toLowerCase().includes(query) ||
                    shift.departmentName.toLowerCase().includes(query)
            );
        }

        if (filters.kind !== "ALL") {
            result = result.filter((shift) => shift.kind === filters.kind);
        }

        if (filters.department !== "ALL") {
            result = result.filter((shift) => {
                const originalShift = shifts.find((s) => s.id === shift.id);
                return originalShift?.departmentDto?.id === filters.department;
            });
        }

        return result;
    }, [shiftsDisplay, shifts, searchQuery, filters]);

    const filteredAssignments = useMemo(() => {
        let result = [...assignmentsDisplay];

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
    }, [assignmentsDisplay, searchQuery, filters]);

    // ==================== COLUMN DEFINITIONS ====================

    const shiftColumns = useMemo<ColumnDef<ShiftDisplay>[]>(
        () => [
            { header: "Shift Name", accessorKey: "name", className: "font-medium" },
            {
                header: "Type",
                cell: (row) => (
                    <span className={`badge border-none ${getKindBadgeStyle(row.kind)}`}>{row.kind}</span>
                ),
            },
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
            { header: "Room", accessorKey: "roomNumber" },
            {
                header: "Actions",
                cell: (row) => (
                    <div className="flex flex-row gap-2">
                        <button
                            className="btn btn-xs bg-blue-100 text-blue-700 border-none hover:bg-blue-200"
                            onClick={() => {
                                const shift = shifts.find((s) => s.id === row.id);
                                if (shift) handleViewSlots(shift);
                            }}
                        >
                            View Slots
                        </button>
                        <button
                            className="btn btn-xs bg-yellow-100 text-yellow-700 border-none hover:bg-yellow-200"
                            onClick={() => {
                                const shift = shifts.find((s) => s.id === row.id);
                                if (shift) handleOpenShiftModal(shift);
                            }}
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
        [shifts, handleOpenShiftModal, handleDeleteShift]
    );

    const assignmentColumns = useMemo<ColumnDef<AssignmentDisplay>[]>(
        () => [
            {
                header: "Date",
                cell: (row) => <span>{formatDate(row.dutyDate)}</span>,
                className: "font-medium",
            },
            { header: "Shift", accessorKey: "shiftName" },
            { header: "Doctor", accessorKey: "doctorName", className: "font-medium" },
            { header: "Room", accessorKey: "roomNumber" },
            {
                header: "Role",
                cell: (row) => (
                    <span className={`badge border-none ${getRoleBadgeStyle(row.roleInShift)}`}>
                        {row.roleInShift}
                    </span>
                ),
            },
            {
                header: "Status",
                cell: (row) => (
                    <span className={`badge border-none ${getStatusBadgeStyle(row.status)}`}>{row.status}</span>
                ),
            },
            {
                header: "Actions",
                cell: (row) => (
                    <div className="flex flex-row gap-2">
                        {row.status === "ACTIVE" && (
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
        [handleCancelAssignment]
    );

    // ==================== GENERATE SLOTS FOR PREVIEW ====================

    const generateSlots = (shift: ShiftDto) => {
        const slots = [];
        const totalSlots = calculateTotalSlots(shift.startTime, shift.endTime, shift.slotMinutes);
        const startDate = new Date(shift.startTime);

        for (let i = 0; i < totalSlots; i++) {
            const slotStart = new Date(startDate.getTime() + i * shift.slotMinutes * 60000);
            const slotEnd = new Date(slotStart.getTime() + shift.slotMinutes * 60000);

            slots.push({
                slotNumber: i + 1,
                startTime: slotStart.toISOString(),
                endTime: slotEnd.toISOString(),
                capacity: shift.capacityPerSlot,
            });
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
            <Header tabName="Shift Management" userName={user?.fullName} />

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
            {(filters.status !== "ALL" ||
                filters.kind !== "ALL" ||
                filters.department !== "ALL" ||
                searchQuery) && (
                <div className="flex flex-wrap items-center gap-2 px-4">
                    <span className="text-sm font-semibold text-gray-600">Active Filters:</span>
                    {searchQuery && (
                        <div className="badge badge-lg gap-2">
                            Search: &apos;{searchQuery}&apos;
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
                    {filters.kind !== "ALL" && activeTab === "shifts" && (
                        <div className="badge badge-lg gap-2">
                            Type: {filters.kind}
                            <button
                                onClick={() => setFilters({ ...filters, kind: "ALL" })}
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
                    Showing {activeTab === "shifts" ? filteredShifts.length : filteredAssignments.length} of{" "}
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

                            {/* Shift Kind */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Shift Type *</span>
                                </label>
                                <div className="flex gap-4">
                                    <label className="label cursor-pointer gap-2">
                                        <input
                                            type="radio"
                                            name="kind"
                                            className="radio radio-primary"
                                            value="CLINIC"
                                            checked={shiftFormData.kind === "CLINIC"}
                                            onChange={(e) => handleShiftFormChange("kind", e.target.value)}
                                        />
                                        <span className="label-text">Clinic</span>
                                    </label>
                                    <label className="label cursor-pointer gap-2">
                                        <input
                                            type="radio"
                                            name="kind"
                                            className="radio radio-error"
                                            value="ER"
                                            checked={shiftFormData.kind === "ER"}
                                            onChange={(e) => handleShiftFormChange("kind", e.target.value)}
                                        />
                                        <span className="label-text">Emergency (ER)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Time Range */}
                            <div className="divider">Schedule</div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Start Date *</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="input input-bordered w-full"
                                        value={extractDateTime(shiftFormData.startTime).date}
                                        onChange={(e) => handleShiftDateTimeChange("start", "date", e.target.value)}
                                        onKeyDown={(e) => e.preventDefault()}
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Start Time *</span>
                                    </label>
                                    <input
                                        type="time"
                                        className="input input-bordered w-full"
                                        value={extractDateTime(shiftFormData.startTime).time}
                                        onChange={(e) => handleShiftDateTimeChange("start", "time", e.target.value)}
                                        onKeyDown={(e) => e.preventDefault()}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">End Date *</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="input input-bordered w-full"
                                        value={extractDateTime(shiftFormData.endTime).date}
                                        onChange={(e) => handleShiftDateTimeChange("end", "date", e.target.value)}
                                        onKeyDown={(e) => e.preventDefault()}
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
                                        value={extractDateTime(shiftFormData.endTime).time}
                                        onChange={(e) => handleShiftDateTimeChange("end", "time", e.target.value)}
                                        onKeyDown={(e) => e.preventDefault()}
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

                            {/* Department & Room */}
                            <div className="divider">Location</div>

                            {/* Department Display (Read-only) */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Department</span>
                                </label>
                                <div className="bg-base-200 p-3 rounded-lg">
                                    <p className="text-sm font-medium">
                                        {staff?.departmentDto?.name || "No Department Assigned"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Shift will be created for your department
                                    </p>
                                </div>
                            </div>

                            {/* Room Selection (Filtered by department) */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Default Room</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={shiftFormData.defaultRoomId}
                                    onChange={(e) => handleShiftFormChange("defaultRoomId", e.target.value)}
                                >
                                    <option value="">Select a room (optional)</option>
                                    {rooms
                                        .filter((room) => room.departmentDto?.id === staff?.departmentDto?.id)
                                        .map((room) => (
                                            <option key={room.id} value={room.id}>
                                                {room.roomNumber}
                                            </option>
                                        ))}
                                </select>
                                <label className="label">
                                    <span className="label-text-alt text-gray-500">
                                        Only showing rooms in {staff?.departmentDto?.name || "your department"}
                                    </span>
                                </label>
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
                                    <span className="label-text font-semibold">Duty Date *</span>
                                </label>
                                <input
                                    type="date"
                                    className="input input-bordered w-full"
                                    value={assignmentFormData.dutyDate}
                                    onChange={(e) => handleAssignmentFormChange("dutyDate", e.target.value)}
                                    onKeyDown={(e) => e.preventDefault()}
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
                                    {shifts.map((shift) => (
                                        <option key={shift.id} value={shift.id}>
                                            {shift.name} ({formatTime(shift.startTime)} -{" "}
                                            {formatTime(shift.endTime)}) - {shift.kind}
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
                                    disabled={!assignmentFormData.shiftId}
                                    required
                                >
                                    <option value="">Select a doctor</option>
                                    {filteredDoctorsForAssignment.map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>
                                            {doctor.staffDto.userDto.fullName} -{" "}
                                            {doctor.staffDto.departmentDto?.name || "No Dept"}
                                        </option>
                                    ))}
                                </select>
                                {!assignmentFormData.shiftId && (
                                    <label className="label">
                                        <span className="label-text-alt text-gray-500">
                                            💡 Please select shift first
                                        </span>
                                    </label>
                                )}
                            </div>

                            {/* Room */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Room</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={assignmentFormData.roomId}
                                    onChange={(e) => handleAssignmentFormChange("roomId", e.target.value)}
                                    disabled={!assignmentFormData.shiftId}
                                >
                                    <option value="">Select a room (optional)</option>
                                    {filteredRoomsForAssignment.map((room) => (
                                        <option key={room.id} value={room.id}>
                                            {room.roomNumber} - {room.departmentDto?.name || "No Dept"}
                                        </option>
                                    ))}
                                </select>
                                {!assignmentFormData.shiftId && (
                                    <label className="label">
                                        <span className="label-text-alt text-gray-500">
                                            💡 Please select shift first
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="divider">Assignment Details</div>

                            {/* Role */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Role in Shift *</span>
                                </label>
                                <div className="flex gap-4">
                                    <label className="label cursor-pointer gap-2">
                                        <input
                                            type="radio"
                                            name="roleInShift"
                                            className="radio radio-primary"
                                            value="PRIMARY"
                                            checked={assignmentFormData.roleInShift === "PRIMARY"}
                                            onChange={(e) => handleAssignmentFormChange("roleInShift", e.target.value)}
                                        />
                                        <span className="label-text">Primary</span>
                                    </label>
                                    <label className="label cursor-pointer gap-2">
                                        <input
                                            type="radio"
                                            name="roleInShift"
                                            className="radio radio-warning"
                                            value="ON_CALL"
                                            checked={assignmentFormData.roleInShift === "ON_CALL"}
                                            onChange={(e) => handleAssignmentFormChange("roleInShift", e.target.value)}
                                        />
                                        <span className="label-text">On Call</span>
                                    </label>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Notes</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-20"
                                    placeholder="Additional notes..."
                                    value={assignmentFormData.notes}
                                    onChange={(e) => handleAssignmentFormChange("notes", e.target.value)}
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
                                        {calculateTotalSlots(
                                            selectedShiftForSlots.startTime,
                                            selectedShiftForSlots.endTime,
                                            selectedShiftForSlots.slotMinutes
                                        )}
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
                                        <span className="badge badge-primary badge-sm">Slot #{slot.slotNumber}</span>
                                        <span className="text-xs text-gray-500">Cap: {slot.capacity}</span>
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
                            {/* Status Filter (for assignments) */}
                            {activeTab === "assignments" && (
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
                                        <option value="ACTIVE">Active</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>
                            )}

                            {/* Kind Filter (for shifts) */}
                            {activeTab === "shifts" && (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Type</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={filters.kind}
                                        onChange={(e) => setFilters({ ...filters, kind: e.target.value })}
                                    >
                                        <option value="ALL">All Types</option>
                                        <option value="CLINIC">Clinic</option>
                                        <option value="ER">Emergency (ER)</option>
                                    </select>
                                </div>
                            )}

                            {/* Department Filter (for shifts) */}
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
