import {Customer} from "../models/Customer";
import {PostgrestResponse} from "@supabase/supabase-js";
import {supabase} from "../lib/store";
import {QueuesForAccountDTO} from "../models/QueuesForAccountDTO";
import {PostgrestResponseFailure, PostgrestResponseSuccess} from "@supabase/postgrest-js";

const TABLE_CUSTOMERS = 'customers';

const fetchCustomersFromAccountOrganisationGroupedByQueue = async (accountId: string): Promise<QueuesForAccountDTO> => {
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

const deleteCustomer = async (id: number) => {
    try {
        // Remove the customer from the database
        await supabase.from(TABLE_CUSTOMERS).delete().eq('id', id);

    } catch (error) {
        console.error(`Error deleting customer with ID ${id} from database`, error);
    }
}

const updateCustomer = async (customer: Customer) => {
    try {
        const data: PostgrestResponseSuccess<null> | PostgrestResponseFailure = await supabase.from(TABLE_CUSTOMERS).update(customer).eq('id', customer.id);
        if (data.error !== null) {
            console.error('Error updating customer', customer, data.error);
        }
    } catch (error) {
        console.error('Error updating waiting_queue from database', error);
    }
}


const saveCustomer = async (customer: Customer) => {
    console.log(customer);
    try {
        const data: PostgrestResponseSuccess<null> | PostgrestResponseFailure = await supabase.from(TABLE_CUSTOMERS).insert(customer);
        console.log(data);

        if (data.error !== null) {
            console.error('Error saving customer', customer, data.error);
        }

    } catch (error) {
        console.error('Error saving customer to database', error);
    }
};

export default {
    fetchCustomersFromAccountOrganisationGroupedByQueue,
    updateCustomer,
    saveCustomer,
    deleteCustomer
}

