"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

interface Department {
    id: string;
    name: string;
    description: string;
    createdAt: string;
}

interface AddRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddRoomModal({
    isOpen,
    onClose,
    onSuccess,
}: AddRoomModalProps) {
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loadingDepartments, setLoadingDepartments] = useState(false);
    const [formData, setFormData] = useState({
        roomNumber: "",
        bedAmount: 1,
        isAvailable: true,
        departmentId: "",
    });

    useEffect(() => {
        if (isOpen) {
            fetchDepartments();
        }
    }, [isOpen]);

    const fetchDepartments = async () => {
        setLoadingDepartments(true);
        try {
            const token = Cookies.get("token");
            if (!token) throw new Error("No token found");

            const response = await fetch("/api/departments", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch departments");

            const data = await response.json();
            setDepartments(data);
        } catch (error) {
            console.error("Error fetching departments:", error);
            toast.error("Failed to load departments");
        } finally {
            setLoadingDepartments(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else if (name === "bedAmount") {
            setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 1 }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = Cookies.get("token");
            if (!token) throw new Error("No token found");

            if (!formData.roomNumber.trim()) {
                toast.error("Room number is required");
                setLoading(false);
                return;
            }

            if (!formData.departmentId) {
                toast.error("Please select a department");
                setLoading(false);
                return;
            }

            if (formData.bedAmount < 1) {
                toast.error("Bed amount must be at least 1");
                setLoading(false);
                return;
            }

            const response = await fetch("/api/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create room");
            }

            toast.success("Room created successfully!");
            setFormData({
                roomNumber: "",
                bedAmount: 1,
                isAvailable: true,
                departmentId: "",
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error creating room:", error);
            toast.error(
                error instanceof Error ? error.message : "Failed to create room"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            roomNumber: "",
            bedAmount: 1,
            isAvailable: true,
            departmentId: "",
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Add New Room</h3>
                    <button
                        onClick={handleClose}
                        className="btn btn-sm btn-circle btn-ghost"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Room Number{" "}
                                <span className="text-error">*</span>
                            </span>
                        </label>
                        <input
                            type="text"
                            name="roomNumber"
                            value={formData.roomNumber}
                            onChange={handleChange}
                            placeholder="e.g., 302"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Department <span className="text-error">*</span>
                            </span>
                        </label>
                        {loadingDepartments ? (
                            <div className="flex items-center justify-center py-2">
                                <span className="loading loading-spinner loading-sm"></span>
                            </div>
                        ) : (
                            <select
                                name="departmentId"
                                value={formData.departmentId}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Number of Beds{" "}
                                <span className="text-error">*</span>
                            </span>
                        </label>
                        <input
                            type="number"
                            name="bedAmount"
                            value={formData.bedAmount}
                            onChange={handleChange}
                            min="1"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-2">
                            <input
                                type="checkbox"
                                name="isAvailable"
                                checked={formData.isAvailable}
                                onChange={handleChange}
                                className="checkbox checkbox-primary"
                            />
                            <span className="label-text">
                                Room is available
                            </span>
                        </label>
                    </div>

                    <div className="modal-action">
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
                            disabled={loading || loadingDepartments}
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Creating...
                                </>
                            ) : (
                                "Create Room"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
