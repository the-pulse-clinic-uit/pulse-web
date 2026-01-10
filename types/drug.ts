interface Drug {
    name: string;
    dosageForm: string;
    unit: string;
    strength?: string;
    unitPrice?: number;
    quantity?: number;
    minStockLevel?: number;
    expiryDate?: string;
    batchNumber?: string;
}
