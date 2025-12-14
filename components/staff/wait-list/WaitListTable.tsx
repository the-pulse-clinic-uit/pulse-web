import { Patient } from "@/types";
import React from "react";

interface DataTableProps {
    patients: Patient[];
}

const DataTable: React.FC<DataTableProps> = ({ patients }) => {
    return (
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
            <table className="table w-full">
                <thead className="bg-base-200/50 text-base-content/70">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Chief Complaint</th>
                        <th>Department</th>
                        <th>Arrival Time</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient) => (
                        <tr key={patient.id} className="border-b-0">
                            <th className="font-bold">{patient.id}</th>
                            <td className="font-medium">{patient.name}</td>
                            <td>{patient.age}</td>
                            <td>{patient.gender}</td>
                            <td
                                className="max-w-xs truncate"
                                title={patient.chiefComplaint}
                            >
                                {patient.chiefComplaint}
                            </td>
                            <td>{patient.department}</td>
                            <td>{patient.arrivalTime}</td>
                            <td>
                                <div
                                    className={`badge badge-sm gap-2 py-3 px-4 min-w-[100px] ${
                                        patient.status === "Waiting"
                                            ? "badge-info text-info-content bg-blue-100 text-blue-800"
                                            : "badge-success text-success-content bg-green-100 text-green-800"
                                    }`}
                                >
                                    {patient.status}
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col gap-2">
                                    {patient.status === "Waiting" ? (
                                        <>
                                            <button className="btn btn-xs btn-success bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:border-green-300 normal-case">
                                                Approve
                                            </button>
                                            <button className="btn btn-xs btn-error bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:border-red-300 normal-case">
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <button className="btn btn-xs btn-secondary bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 hover:border-purple-300 normal-case">
                                            Move to Admission
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
