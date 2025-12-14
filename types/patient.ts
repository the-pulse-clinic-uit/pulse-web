export type Patient = {
    id: string;
    name: string;
    age: number;
    gender: string;
    chiefComplaint: string;
    department: string;
    arrivalTime: string;
    status: "Waiting" | "Approved";
};
