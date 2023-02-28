import {Customer} from "../models/Customer";
import {PostgrestResponse} from "@supabase/supabase-js";
import {supabase} from "../lib/store";
import {QueuesForAccountDTO} from "../models/QueuesForAccountDTO";

const TABLE_CUSTOMERS = 'customers';

export const fetchCustomersFromAccountOrganisationGroupedByQueue = async (accountId: string): Promise<QueuesForAccountDTO> => {
    try {
        // @ts-ignore ignore type not perfect
        const response: PostgrestResponse<QueuesForAccountDTO> = await supabase.from('account_to_organisation').select(`
        organisation_id, organisations (
            name,
            queues (
                id, name, latest_appointment_start,
                customers (*)
            )
        )`).eq('account_id', accountId);
        if (response.data && response.data.length > 0) {
            return Promise.resolve(response.data[0])
        }
    } catch (error) {
        console.error('Error retrieving waiting_queue from database', error);
    }
    return Promise.reject();
}


export const fetchCustomersWithQueueId = async (setData: (data: Customer[]) => void, queue_id: number) => {
    try {
        const data: PostgrestResponse<Customer> = await supabase.from(TABLE_CUSTOMERS).select('*').eq("queue_id", queue_id);
        if (data.data !== null) {
            const result = [...data.data];
            result.sort((a, b) => (a.position - b.position));
            setData(result);
        }
    } catch (error) {
        console.error('Error retrieving waiting_queue from database', error);
    }
}

export const fetchCustomer = async (setData: (data: Customer) => void, customerId: number) => {
    try {
        const data: PostgrestResponse<Customer> = await supabase.from(TABLE_CUSTOMERS).select('*').eq('id', customerId);
        if (data.data !== null) {
            const result = data.data[0];
            setData(result);
        }
    } catch (error) {
        console.error('Error retrieving waiting_queue from database', error);
    }
}

export const updateCustomer = async (customer: Customer) => {
    try {
        const data: PostgrestResponse<undefined> = await supabase.from(TABLE_CUSTOMERS).update(customer).eq('id', customer.id);
        if (data.error !== null) {
            console.error('Error updating customer', customer, data.error);
        }
    } catch (error) {
        console.error('Error updating waiting_queue from database', error);
    }
}


export const saveCustomer = async (customer: Customer) => {
    try {
        const data: PostgrestResponse<Customer> = await supabase.from(TABLE_CUSTOMERS).select('*').eq('name', customer.name);
        if (data.data == null) {
            const data: PostgrestResponse<undefined> = await supabase
                .from(TABLE_CUSTOMERS)
                .insert(customer);

            if (data.error !== null) {
                console.error('Error saving customer', customer, data.error);
            }
        }

    } catch (error) {
        console.error('Error saving customer to database', error);
    }
};

