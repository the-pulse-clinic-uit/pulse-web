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

interface DoctorOption {
    id: string;
    fullName: string;
}

interface AppointmentOption {
    id: string;
    patientName: string;
    appointmentTime: string;
    description: string;
}

interface PatientOption {
    id: string;
    fullName: string;
    citizenId: string;
    phone: string;
}

interface WaitlistFormData {
    dutyDate: string;
    notes: string;
    priority: "NORMAL" | "PRIORITY" | "EMERGENCY";
    appointmentId: string;
    patientId: string;
    doctorId: string;
    isWalkIn: boolean; // Phân biệt walk-in vs có appointment
}
// API Response Types
interface DoctorApiResponse {
    id: string;
    licenseId: string;
    staffDto: {
        userDto: {
            fullName: string;
        };
        departmentDto: {
            id: string;
        } | null;
    };
}

interface PatientApiResponse {
    id: string;
    userDto: {
        fullName: string;
        citizenId: string;
        phone: string;
    };
}

interface AppointmentApiResponse {
    id: string;
    startsAt: string;
    description: string | null;
    patientDto?: {
        userDto?: {
            fullName: string;
        };
    };
}

interface WaitlistEntryDto {
    id: string;
    dutyDate: string;
    ticketNo: number | null;
    notes: string | null;
    priority: string;
    status: string;
    createdAt: string;
    calledAt: string | null;
    servedAt: string | null;

    appointmentDto: {
        id: string;
        startsAt: string;
        endsAt: string;
        status: string;
        type: string;
        description: string;
        createdAt: string;
        updatedAt: string;
    }

    patientDto: {
        id: string;
        healthInsuranceId: string;
        bloodType: string;
        allergies: string;
        createdAt: string;
        userDto: {
            id: string;
            email: string;
            fullName: string;
            address: string | null;
            citizenId: string;
            phone: string;
            gender: boolean;
            birthDate: string;
            avatarUrl: string | null;
            createdAt: string;
            updatedAt: string;
            isActive: boolean;
            roleDto: unknown;
        };
    };

    doctorDto: {
        id: string;
        licenseId: string;
        isVerified: boolean;
        createdAt: string;
        staffDto: {
            id: string;
            position: string;
            createdAt: string;
            userDto: {
                id: string;
                email: string;
                fullName: string;
                address: string;
                citizenId: string;
                phone: string;
                gender: boolean;
                birthDate: string;
                avatarUrl: string | null;
                createdAt: string;
                updatedAt: string;
                isActive: boolean;
            };
            departmentDto: {
                id: string;
                name: string;
            } | null;
        };
    };
}
