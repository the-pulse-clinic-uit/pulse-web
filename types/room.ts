interface Room {
    id: string;
    roomNumber: string;
    bedAmount: number;
    isAvailable: boolean;
    createdAt: string;
    departmentDto: {
        id: string;
        name: string;
        description: string;
        createdAt: string;
    };
}
