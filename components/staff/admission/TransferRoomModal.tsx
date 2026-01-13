"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

interface Room {
    id: string;
    roomNumber: string;
    bedAmount: number;
    isAvailable: boolean;
    departmentDto: {
        id: string;
        name: string;
        description: string;
    };
}

interface TransferRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    admissionId: string;
    currentRoom: string;
    patientName: string;
}

export default function TransferRoomModal({
    isOpen,
    onClose,
    onSuccess,
    admissionId,
    currentRoom,
    patientName,
}: TransferRoomModalProps) {
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchAvailableRooms();
        }
    }, [isOpen]);

    const fetchAvailableRooms = async () => {
        setLoadingRooms(true);
        try {
            const token = Cookies.get("token");
            if (!token) throw new Error("No token found");

            const response = await fetch("/api/rooms", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch rooms");

            const data: Room[] = await response.json();
            const availableRooms = data.filter((room) => room.isAvailable);
            setRooms(availableRooms);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            toast.error("Failed to load available rooms");
        } finally {
            setLoadingRooms(false);
        }
    };

    const handleTransfer = async () => {
        if (!selectedRoomId) {
            toast.error("Please select a room");
            return;
        }

        setLoading(true);
        try {
            const token = Cookies.get("token");
            if (!token) throw new Error("No token found");

            const response = await fetch(
                `/api/admissions/${admissionId}/transfer-room?newRoomId=${selectedRoomId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to transfer room");
            }

            toast.success("Room transferred successfully!");
            setSelectedRoomId("");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error transferring room:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to transfer room"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedRoomId("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Transfer Room</h3>
                    <button
                        onClick={handleClose}
                        className="btn btn-sm btn-circle btn-ghost"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-base-content/70">
                        Patient:{" "}
                        <span className="font-semibold">{patientName}</span>
                    </p>
                    <p className="text-sm text-base-content/70">
                        Current Room:{" "}
                        <span className="font-semibold">{currentRoom}</span>
                    </p>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">
                            Select New Room{" "}
                            <span className="text-error">*</span>
                        </span>
                    </label>
                    {loadingRooms ? (
                        <div className="flex items-center justify-center py-4">
                            <span className="loading loading-spinner loading-sm"></span>
                        </div>
                    ) : (
                        <select
                            value={selectedRoomId}
                            onChange={(e) => setSelectedRoomId(e.target.value)}
                            className="select select-bordered w-full"
                            disabled={loading}
                        >
                            <option value="">Select a room</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    Room {room.roomNumber} -{" "}
                                    {room.departmentDto.name} ({room.bedAmount}{" "}
                                    beds)
                                </option>
                            ))}
                        </select>
                    )}
                    {!loadingRooms && rooms.length === 0 && (
                        <p className="text-sm text-error mt-2">
                            No available rooms found
                        </p>
                    )}
                </div>

                <div className="modal-action">
                    <button
                        onClick={handleClose}
                        className="btn btn-ghost"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleTransfer}
                        className="btn btn-primary"
                        disabled={loading || loadingRooms || !selectedRoomId}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Transferring...
                            </>
                        ) : (
                            "Transfer Room"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
