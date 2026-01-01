export type Patient = {
    id: string;
    name: string;
    ticketNo: string;
    age: number;
    gender: string;
    departmentId: string;
    // chiefComplaint: string;
    department: string;
    // arrivalTime: string;
    status: "Waiting" | "Approved";
};
