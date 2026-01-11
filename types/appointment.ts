interface AppointmentDto {
    id: string;
    startsAt: string;
    endsAt: string;
    status: string;
    type: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
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
        };
        departmentDto: {
            id: string;
            name: string;
            description: string;
            createdAt: string;
        } | null;
    };
    shiftAssignmentDto: unknown;
    followUpPlanDto: unknown;
}
