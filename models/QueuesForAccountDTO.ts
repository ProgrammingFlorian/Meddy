import {Customer} from "./Customer";

export interface QueuesForAccountDTO {
    organisation_id: number;
    organisations: {
        name: string;
        queues: [{
            id: number;
            name: string;
            latest_appointment_start: Date;
            customers: [Customer];
        }];
    };
}