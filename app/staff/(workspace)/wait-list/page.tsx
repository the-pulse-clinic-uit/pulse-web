"use client";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import Pagination from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useCallback, useEffect, useMemo, useState } from "react";

type WaitListPatient = {
    id: string;
    ticketNo: string;
    name: string;
    age: number;
    gender: string;
    departmentId: string;
    department: string;
    priority: "NORMAL" | "PRIORITY" | "EMERGENCY";
};

// Helper function để get priority badge style
const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
        case "EMERGENCY":
            return "bg-red-100 text-red-700";
        case "PRIORITY":
            return "bg-orange-100 text-orange-700";
        case "NORMAL":
        default:
            return "bg-gray-100 text-gray-700";
    }
};

// Helper function để get priority order cho sorting
const getPriorityOrder = (priority: string) => {
    switch (priority) {
        case "EMERGENCY":
            return 1;
        case "PRIORITY":
            return 2;
        case "NORMAL":
        default:
            return 3;
    }
};

export default function WaitListPage() {
    const router = useRouter();
    const [patients, setPatients] = useState<WaitListPatient[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserData | null>(null);
    const [staff, setStaff] = useState<StaffData | null>(null);

    // Search and Filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        priority: "ALL" as "ALL" | "NORMAL" | "PRIORITY" | "EMERGENCY",
        department: "ALL" as string,
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [doctors, setDoctors] = useState<DoctorOption[]>([]);
    const [allPatients, setAllPatients] = useState<PatientOption[]>([]);
    const [appointments, setAppointments] = useState<AppointmentOption[]>([]);
    const [formData, setFormData] = useState<WaitlistFormData>({
        dutyDate: new Date().toISOString().split("T")[0],
        notes: "",
        priority: "NORMAL",
        appointmentId: "",
        patientId: "",
        doctorId: "",
        isWalkIn: false,
    });

    const fetchData = useCallback(async () => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const userRes = await fetch("/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (userRes.ok) setUser(await userRes.json());

            const staffRes = await fetch("/api/staff/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (staffRes.ok) {
                const staffData = await staffRes.json();
                setStaff(staffData);

                const waitlistEntryRes = await fetch(
                    `/api/waitlist/department/${staffData?.departmentDto?.id}`,
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (waitlistEntryRes.ok) {
                    const data = await waitlistEntryRes.json();

                    const formattedPatients: WaitListPatient[] = data
                        .map((item: WaitlistEntryDto) => {
                            // CHỈ LẤY WAITING - không hiển thị CALLED/SERVED
                            if (item.status !== "WAITING") {
                                return null;
                            }

                            // Loại bỏ các record có dutyDate trong quá khứ
                            if (item.dutyDate < new Date().toISOString().split("T")[0]) {
                                return null;
                            }

                            return {
                                id: item.id,
                                ticketNo: item.ticketNo
                                    ? `#${item.ticketNo.toString().padStart(3, "0")}`
                                    : "N/A",
                                name: item.patientDto.userDto.fullName,
                                age:
                                    new Date().getFullYear() -
                                    new Date(
                                        item.patientDto.userDto.birthDate
                                    ).getFullYear(),
                                gender: item.patientDto.userDto.gender
                                    ? "Male"
                                    : "Female",
                                department: item.doctorDto.staffDto.departmentDto
                                    ? item.doctorDto.staffDto.departmentDto.name
                                    : "General",
                                departmentId: item.doctorDto.staffDto.departmentDto
                                    ? item.doctorDto.staffDto.departmentDto.id
                                    : "",
                                priority: item.priority as "NORMAL" | "PRIORITY" | "EMERGENCY",
                            };
                        })
                        .filter((item: WaitListPatient | null) => item !== null) as WaitListPatient[];

                    // Sort by priority (EMERGENCY -> PRIORITY -> NORMAL)
                    formattedPatients.sort((a, b) => {
                        return getPriorityOrder(a.priority) - getPriorityOrder(b.priority);
                    });

                    setPatients(formattedPatients);
                } else if (
                    waitlistEntryRes.status === 401 ||
                    waitlistEntryRes.status === 403
                ) {
                    Cookies.remove("token");
                    router.push("/login");
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [router]);

    const fetchDoctors = useCallback(async () => {
        if (!staff?.departmentDto?.id) return;

        const token = Cookies.get("token");
        if (!token) return;

        try {
            const res = await fetch(`/api/doctors`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data: DoctorApiResponse[] = await res.json();

                // Filter doctors theo departmentId
                const filteredDoctors = data.filter(
                    (doctor) =>
                        doctor.staffDto?.departmentDto?.id === staff.departmentDto.id
                );

                const doctorsList: DoctorOption[] = filteredDoctors.map((doctor) => ({
                    id: doctor.id,
                    fullName: doctor.staffDto.userDto.fullName,
                }));

                setDoctors(doctorsList);
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    }, [staff]);

    // Fetch all patients
    const fetchAllPatients = useCallback(async () => {
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
                setAllPatients(patientsList);
            }
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    }, []);

    // Fetch appointments cho ngày được chọn
    const fetchAppointments = useCallback(async (date: string, doctorId: string) => {
        if (!doctorId) return;

        const token = Cookies.get("token");
        if (!token) return;

        try {
            const res = await fetch(
                `/api/appointments/doctor/${doctorId}?date=${date}&status=SCHEDULED`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.ok) {
                const data: AppointmentApiResponse[] = await res.json();
                const appointmentsList: AppointmentOption[] = data.map((apt) => ({
                    id: apt.id,
                    patientName: apt.patientDto?.userDto?.fullName || "Unknown",
                    appointmentTime: new Date(apt.startsAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    description: apt.description || "",
                }));
                setAppointments(appointmentsList);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    }, []);

    const handleApproveWaitlist = useCallback(async (departmentId: string) => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const dutyDate = new Date().toISOString().split("T")[0];

            const res = await fetch(
                `/api/waitlist/department/${departmentId}/call-next?dutyDate=${dutyDate}`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.ok) {
                // TODO: Sau khi call-next thành công, tự động thêm vào encounter
                const waitlistData = await res.json();
                await fetch('/api/encounters', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}` 
                    },
                    body: JSON.stringify({
                        patientId: waitlistData.patientDto.id,
                        doctorId: waitlistData.doctorDto.id,
                        notes: waitlistData.notes,
                    }),
                });
                
                await fetchData();
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Update error:", error);
        }
    }, [router, fetchData]);

    const handleCancelWaitlist = useCallback(async (entryId: string) => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to cancel this patient's appointment?"
        );
        if (!confirmed) return;

        try {
            const res = await fetch(`/api/waitlist/${entryId}/cancel`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                alert("Patient appointment cancelled successfully");
                await fetchData();
            } else {
                const errorData = await res.json();
                alert(`Failed to cancel: ${errorData.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Cancel error:", error);
            alert("An error occurred while cancelling the appointment");
        }
    }, [router, fetchData]);

    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
        fetchDoctors();
        fetchAllPatients();
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setFormData({
            dutyDate: new Date().toISOString().split("T")[0],
            notes: "",
            priority: "NORMAL",
            appointmentId: "",
            patientId: "",
            doctorId: "",
            isWalkIn: false,
        });
        setAppointments([]);
    };

    const handleFormChange = (
        field: keyof WaitlistFormData,
        value: string | boolean
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Fetch appointments khi chọn doctor hoặc thay đổi date
        if (field === "doctorId" || field === "dutyDate") {
            const newDoctorId = field === "doctorId" ? (value as string) : formData.doctorId;
            const newDate = field === "dutyDate" ? (value as string) : formData.dutyDate;
            if (newDoctorId && newDate) {
                fetchAppointments(newDate, newDoctorId);
            }
        }

        // Khi chuyển sang walk-in, clear appointmentId
        if (field === "isWalkIn" && value === true) {
            setFormData((prev) => ({ ...prev, appointmentId: "" }));
        }
    };

    const handleSubmitWaitlist = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = Cookies.get("token");
        if (!token) {
            router.push("/login");
            return;
        }

        // Validation
        if (!formData.doctorId || !formData.patientId) {
            alert("Please select both doctor and patient");
            return;
        }

        try {
            const requestBody = {
                dutyDate: formData.dutyDate,
                notes: formData.notes || null,
                priority: formData.priority,
                appointmentId: formData.appointmentId || null,
                patientId: formData.patientId,
                doctorId: formData.doctorId,
            };

            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (res.ok) {
                alert("Patient added to waitlist successfully");
                handleCloseAddModal();
                await fetchData();
            } else {
                const errorData = await res.json();
                alert(`Failed to add: ${errorData.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("An error occurred while adding to waitlist");
        }
    };

    // Filter và search data
    const filteredPatients = useMemo(() => {
        let result = [...patients];

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (patient) =>
                    patient.name.toLowerCase().includes(query) ||
                    patient.ticketNo.toLowerCase().includes(query) ||
                    patient.department.toLowerCase().includes(query)
            );
        }

        // Apply priority filter
        if (filters.priority !== "ALL") {
            result = result.filter((patient) => patient.priority === filters.priority);
        }

        // Apply department filter
        if (filters.department !== "ALL") {
            result = result.filter((patient) => patient.departmentId === filters.department);
        }

        return result;
    }, [patients, searchQuery, filters]);

    // Get unique departments for filter
    const departments = useMemo(() => {
        const uniqueDepts = Array.from(
            new Set(patients.map((p) => JSON.stringify({ id: p.departmentId, name: p.department })))
        ).map((str) => JSON.parse(str));
        return uniqueDepts;
    }, [patients]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleOpenFilterModal = () => {
        setIsFilterModalOpen(true);
    };

    const handleCloseFilterModal = () => {
        setIsFilterModalOpen(false);
    };

    const handleApplyFilters = () => {
        setIsFilterModalOpen(false);
    };

    const handleResetFilters = () => {
        setFilters({
            priority: "ALL",
            department: "ALL",
        });
    };

    const waitListColumns = useMemo<ColumnDef<WaitListPatient>[]>(
        () => [
            { header: "ID", accessorKey: "ticketNo", className: "font-bold" },
            { header: "Name", accessorKey: "name", className: "font-medium" },
            { header: "Age", accessorKey: "age" },
            { header: "Gender", accessorKey: "gender" },
            { header: "Department", accessorKey: "department" },
            {
                header: "Priority",
                cell: (row) => (
                    <span
                        className={`badge border-none ${getPriorityBadgeStyle(
                            row.priority
                        )}`}
                    >
                        {row.priority}
                    </span>
                ),
            },
            {
                header: "Action",
                cell: (row) => (
                    <div className="flex flex-row gap-2">
                        <button
                            className="btn btn-xs bg-green-100 text-green-700 border-none hover:bg-green-200"
                            onClick={() => handleApproveWaitlist(row.departmentId)}
                        >
                            Serve
                        </button>
                        <button
                            className="btn btn-xs bg-red-100 text-red-700 border-none hover:bg-red-200"
                            onClick={() => handleCancelWaitlist(row.id)}
                        >
                            Cancel
                        </button>
                    </div>
                ),
            },
        ],
        [handleApproveWaitlist, handleCancelWaitlist]
    );

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header tabName="Manage Wait List" userName={user?.fullName} />
            <Toolbar
                buttonName="Wait List"
                onSearch={handleSearch}
                onFilter={handleOpenFilterModal}
                onAdd={handleOpenAddModal}
            />

            {/* Active filters display */}
            {(filters.priority !== "ALL" || filters.department !== "ALL" || searchQuery) && (
                <div className="flex flex-wrap items-center gap-2 px-4">
                    <span className="text-sm font-semibold text-gray-600">Active Filters:</span>
                    {searchQuery && (
                        <div className="badge badge-lg gap-2">
                            Search: &apos;{searchQuery}&apos;
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-xs hover:text-error"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    {filters.priority !== "ALL" && (
                        <div className="badge badge-lg gap-2">
                            Priority: {filters.priority}
                            <button
                                onClick={() => setFilters({ ...filters, priority: "ALL" })}
                                className="text-xs hover:text-error"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    {filters.department !== "ALL" && (
                        <div className="badge badge-lg gap-2">
                            Department: {departments.find(d => d.id === filters.department)?.name}
                            <button
                                onClick={() => setFilters({ ...filters, department: "ALL" })}
                                className="text-xs hover:text-error"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    <button
                        onClick={handleResetFilters}
                        className="btn btn-xs btn-ghost text-error"
                    >
                        Clear All
                    </button>
                </div>
            )}

            <div className="px-4">
                <p className="text-sm text-gray-600">
                    Showing {filteredPatients.length} of {patients.length} patients
                </p>
            </div>

            <DataTable columns={waitListColumns} data={filteredPatients} />
            <Pagination
                currentPage={1}
                totalPages={10}
                onPageChange={() => { }}
            />

            {/* Add to Waitlist Modal */}
            {isAddModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="font-bold text-xl mb-6">Add Patient to Waitlist</h3>

                        <form onSubmit={handleSubmitWaitlist} className="space-y-5">
                            {/* Duty Date */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Duty Date *</span>
                                </label>
                                <input
                                    type="date"
                                    className="input input-bordered w-full mt-1"
                                    value={formData.dutyDate}
                                    onChange={(e) => handleFormChange("dutyDate", e.target.value)}
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
                                    onChange={(e) => handleFormChange("doctorId", e.target.value)}
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
                                        onChange={(e) => handleFormChange("isWalkIn", e.target.checked)}
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
                                        onChange={(e) => handleFormChange("appointmentId", e.target.value)}
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
                                    onChange={(e) => handleFormChange("patientId", e.target.value)}
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
                                            onChange={(e) => handleFormChange("priority", e.target.value)}
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
                                            onChange={(e) => handleFormChange("priority", e.target.value)}
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
                                            onChange={(e) => handleFormChange("priority", e.target.value)}
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
                                    onChange={(e) => handleFormChange("notes", e.target.value)}
                                />
                            </div>

                            {/* Actions */}
                            <div className="modal-action mt-8 gap-3">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={handleCloseAddModal}
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
            )}

            {/* Filter Modal */}
            {isFilterModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-lg">
                        <h3 className="font-bold text-xl mb-6">Filter Wait List</h3>

                        <div className="space-y-5">
                            {/* Priority Filter */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Priority</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={filters.priority}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            priority: e.target.value as typeof filters.priority,
                                        })
                                    }
                                >
                                    <option value="ALL">All Priorities</option>
                                    <option value="EMERGENCY">🔴 Emergency</option>
                                    <option value="PRIORITY">🟠 Priority</option>
                                    <option value="NORMAL">⚪ Normal</option>
                                </select>
                            </div>

                            {/* Department Filter */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Department</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={filters.department}
                                    onChange={(e) =>
                                        setFilters({ ...filters, department: e.target.value })
                                    }
                                >
                                    <option value="ALL">All Departments</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="divider"></div>

                            {/* Filter Summary */}
                            <div className="bg-base-200 p-4 rounded-lg">
                                <p className="text-sm font-semibold mb-2">Filter Summary:</p>
                                <ul className="text-sm space-y-1 text-gray-600">
                                    <li>• Priority: <span className="font-medium">{filters.priority}</span></li>
                                    <li>• Department: <span className="font-medium">
                                        {filters.department === "ALL"
                                            ? "ALL"
                                            : departments.find(d => d.id === filters.department)?.name || "ALL"}
                                    </span></li>
                                </ul>
                            </div>
                        </div>

                        <div className="modal-action mt-6">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={handleResetFilters}
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={handleCloseFilterModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleApplyFilters}
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}