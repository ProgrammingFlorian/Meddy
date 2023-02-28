export interface Queue {
    id: number;
    // Foreign key for organisation
    organisation_id: number;
    name: string;
    // Time when the latest customer has started his appointment
    latest_appointment_start: Date | null;
}