export interface Customer {
    id: number;
    position: number;
    name: string;
    duration: number;
    row: number;
}

export const getCustomerIdAsString = (customer: Customer): string => {
    return `${customer.id}`;
}