export interface Customer {
    id: number;
    position: number;
    name: string;
    duration: number;
    row: number;
    notes?: string;
    assignedEmployee?: string;
    waitingTime?: number;
}

export const getCustomerIdAsString = (customer: Customer): string => {
    return `${customer.id}`;
}