"use client";
import { useState } from "react";

type ApproveAdmissionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (room: string) => void;
    admission: {
        id: string;
        name: string;
        age: number;
        chiefComplaint: string;
        attendingPhysician: string;
        department: string;
        admissionDate: string;
    };
};

export default function ApproveAdmissionModal({
    isOpen,
    onClose,
    onSave,
    admission,
}: ApproveAdmissionModalProps) {
    const [room, setRoom] = useState("");

    const handleSave = () => {
        if (room.trim()) {
            onSave(room);
            setRoom("");
        }
    };

    const handleClose = () => {
        setRoom("");
        onClose();
    };

    return (
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box max-w-md">
                <h3 className="font-bold text-2xl mb-6">Approve Admission</h3>

                <div className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-500">
                                Admission ID
                            </span>
                        </label>
                        <p className="font-medium">{admission.id}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-500">
                                    Patient&apos;s Name
                                </span>
                            </label>
                            <p className="font-medium">{admission.name}</p>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-500">
                                    Attending Physician
                                </span>
                            </label>
                            <p className="font-medium">
                                {admission.attendingPhysician}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-500">
                                    Age
                                </span>
                            </label>
                            <p className="font-medium">{admission.age}</p>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-500">
                                    Admission Date
                                </span>
                            </label>
                            <p className="font-medium">
                                {admission.admissionDate}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-500">
                                    Department
                                </span>
                            </label>
                            <p className="font-medium">
                                {admission.department}
                            </p>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-500">
                                    Chief Complaint
                                </span>
                            </label>
                            <p className="font-medium">
                                {admission.chiefComplaint}
                            </p>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-500">
                                Room
                            </span>
                        </label>
                        <input
                            type="text"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                            placeholder="Enter room number"
                            className="input input-bordered w-full"
                        />
                    </div>
                </div>

                <div className="modal-action">
                    <button onClick={handleClose} className="btn">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!room.trim()}
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
