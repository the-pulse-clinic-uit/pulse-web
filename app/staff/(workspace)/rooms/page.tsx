"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { Building2, Bed, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Header from "@/components/staff/Header";
import Toolbar from "@/components/staff/ToolBar";
import DataTable, { ColumnDef } from "@/components/staff/DataTable";
import AddRoomModal from "@/components/staff/rooms/AddRoomModal";

interface Department {
    id: string;
    name: string;
    description: string;
    createdAt: string;
}

interface Room {
    id: string;
    roomNumber: string;
    bedAmount: number;
    isAvailable: boolean;
    createdAt: string;
    departmentDto: Department;
}

interface UserData {
    fullName?: string;
    avatarUrl?: string;
}

export default function ManageRoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserData | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        department: "",
        status: "",
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, filters, rooms]);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const token = Cookies.get("token");
            if (!token) {
                throw new Error("No authentication token");
            }

            const userRes = await fetch("/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (userRes.ok) setUser(await userRes.json());

            const response = await fetch("/api/rooms", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch rooms");
            }

            const data = await response.json();
            setRooms(data);
            setFilteredRooms(data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = useCallback(() => {
        let result = [...rooms];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (room) =>
                    room.roomNumber.toLowerCase().includes(query) ||
                    room.departmentDto.name.toLowerCase().includes(query)
            );
        }

        if (filters.department) {
            result = result.filter(
                (room) => room.departmentDto.id === filters.department
            );
        }

        if (filters.status) {
            const isAvailable = filters.status === "available";
            result = result.filter((room) => room.isAvailable === isAvailable);
        }

        setFilteredRooms(result);
    }, [searchQuery, filters, rooms]);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            department: "",
            status: "",
        });
        setSearchQuery("");
    };

    const handleDeleteRoom = async (roomId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this room? This action cannot be undone."
        );

        if (!confirmed) return;

        try {
            const token = Cookies.get("token");
            if (!token) {
                throw new Error("No authentication token");
            }

            const response = await fetch(`/api/rooms/${roomId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to delete room");
            }

            toast.success("Room deleted successfully!");
            fetchRooms();
        } catch (error) {
            console.error("Error deleting room:", error);
            toast.error(
                error instanceof Error ? error.message : "Failed to delete room"
            );
        }
    };

    const departments = Array.from(
        new Set(rooms.map((room) => JSON.stringify(room.departmentDto)))
    ).map((str) => JSON.parse(str) as Department);

    const stats = {
        total: rooms.length,
        available: rooms.filter((r) => r.isAvailable).length,
        occupied: rooms.filter((r) => !r.isAvailable).length,
        totalBeds: rooms.reduce((sum, r) => sum + r.bedAmount, 0),
    };

    const columns: ColumnDef<Room>[] = [
        {
            header: "Room Number",
            accessorKey: "roomNumber",
        },
        {
            header: "Department",
            accessorKey: "departmentDto",
            cell: (row) => row.departmentDto.name,
        },
        {
            header: "Beds",
            accessorKey: "bedAmount",
        },
        {
            header: "Status",
            accessorKey: "isAvailable",
            cell: (row) => (
                <span
                    className={`badge ${
                        row.isAvailable ? "badge-success" : "badge-error"
                    } gap-2`}
                >
                    {row.isAvailable ? (
                        <>
                            <CheckCircle className="w-3 h-3" />
                            Available
                        </>
                    ) : (
                        <>
                            <XCircle className="w-3 h-3" />
                            Occupied
                        </>
                    )}
                </span>
            ),
        },
        {
            header: "Created",
            accessorKey: "createdAt",
            cell: (row) => new Date(row.createdAt).toLocaleDateString(),
        },
        {
            header: "Actions",
            cell: (row) => (
                <button
                    onClick={() => handleDeleteRoom(row.id)}
                    className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                    title="Delete room"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header
                tabName="Manage Rooms"
                userName={user?.fullName}
                avatarUrl={user?.avatarUrl}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Total Rooms</div>
                        <div className="stat-value text-primary">
                            {stats.total}
                        </div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-success">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Available</div>
                        <div className="stat-value text-success">
                            {stats.available}
                        </div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-error">
                            <XCircle className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Occupied</div>
                        <div className="stat-value text-error">
                            {stats.occupied}
                        </div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <Bed className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Total Beds</div>
                        <div className="stat-value text-secondary">
                            {stats.totalBeds}
                        </div>
                    </div>
                </div>
            </div>

            <Toolbar
                buttonName="Rooms"
                onAdd={() => setIsAddModalOpen(true)}
                onSearch={handleSearch}
                onFilter={() => setIsFilterOpen(true)}
            />

            {(filters.department || filters.status || searchQuery) && (
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-base-content/60">
                        Active filters:
                    </span>
                    {searchQuery && (
                        <div className="badge badge-primary gap-2">
                            Search: {searchQuery}
                        </div>
                    )}
                    {filters.department && (
                        <div className="badge badge-primary gap-2">
                            Department:{" "}
                            {
                                departments.find(
                                    (d) => d.id === filters.department
                                )?.name
                            }
                        </div>
                    )}
                    {filters.status && (
                        <div className="badge badge-primary gap-2">
                            Status:{" "}
                            {filters.status === "available"
                                ? "Available"
                                : "Occupied"}
                        </div>
                    )}
                    <button
                        onClick={clearFilters}
                        className="btn btn-ghost btn-xs text-error"
                    >
                        Clear All
                    </button>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : filteredRooms.length > 0 ? (
                <>
                    <div className="text-sm text-base-content/60">
                        Showing {filteredRooms.length} of {rooms.length} rooms
                    </div>
                    <DataTable data={filteredRooms} columns={columns} />
                </>
            ) : (
                <div className="text-center text-gray-500 py-10">
                    {rooms.length > 0
                        ? "No rooms match your filters."
                        : "No rooms found."}
                </div>
            )}

            <div className={`modal ${isFilterOpen ? "modal-open" : ""}`}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Filter Rooms</h3>

                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Department</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={filters.department}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "department",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">All Departments</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Status</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={filters.status}
                                onChange={(e) =>
                                    handleFilterChange("status", e.target.value)
                                }
                            >
                                <option value="">All Status</option>
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-action">
                        <button
                            className="btn btn-ghost"
                            onClick={clearFilters}
                        >
                            Clear All
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsFilterOpen(false)}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            <AddRoomModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchRooms}
            />
        </div>
    );
}
