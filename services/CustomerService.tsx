import {Customer} from "../models/Customer";
import {PostgrestResponse} from "@supabase/supabase-js";
import {supabase} from "../lib/store";
import {PostgrestResponseFailure, PostgrestResponseSuccess} from "@supabase/postgrest-js";
import {TABLE_ACCOUNT_TO_ORGANISATION} from "./AccountService";
import {Organisation} from "../models/Organisation";

const TABLE_CUSTOMERS = 'customers';

interface CustomersInSameQueue extends Customer {
    queues: {
        customers: Customer[],
        organisations: Organisation
    }
}

const fetchCustomersInSameQueue = async (customerId: number): Promise<[Customer, Customer[], Organisation]> => {
    try {
        // @ts-ignore ignore type not perfect
        const response: PostgrestResponse<CustomersInSameQueue> = await supabase.from(TABLE_CUSTOMERS).select(`
        *, queues(customers(*), organisations(*))`).eq('id', customerId);
        console.log(response);
        if (response.data && response.data.length > 0) {
            const customer = response.data[0] as Customer;
            const otherCustomers = response.data[0].queues.customers.filter(c => c.id !== customerId);
            const organisation = response.data[0].queues.organisations;
            return Promise.resolve([customer, otherCustomers, organisation]);
        }
    } catch (error) {
        console.error('Error retrieving waiting_queue from database', error);
    }
    return Promise.reject();
}

interface QueuesForAccount {
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

const fetchCustomersFromAccountOrganisationGroupedByQueue = async (accountId: string): Promise<QueuesForAccount> => {
    try {
        // @ts-ignore ignore type not perfect
        const response: PostgrestResponse<QueuesForAccount> = await supabase.from(TABLE_ACCOUNT_TO_ORGANISATION).select(`
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

const saveCustomer = async (customer: Customer): Promise<Customer> => {
    try {
        // @ts-ignore
        const response: PostgrestResponse<Customer> = await supabase.from(TABLE_CUSTOMERS).insert(customer).select();

        if (!response.error) {
            return Promise.resolve(response.data[0]);
        } else {
            console.error('Error saving customer', customer, response.error);
        }

    } catch (error) {
        console.error('Error saving customer to database', error);
    }
    return Promise.reject();
};

export default {
    fetchCustomersInSameQueue,
    fetchCustomersFromAccountOrganisationGroupedByQueue,
    updateCustomer,
    saveCustomer,
    deleteCustomer
}

