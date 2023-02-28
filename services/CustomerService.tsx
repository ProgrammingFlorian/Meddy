import {Customer} from "../models/Customer";
import {PostgrestResponse} from "@supabase/supabase-js";
import {supabase} from "../lib/store";
import {PostgrestResponseFailure, PostgrestResponseSuccess} from "@supabase/postgrest-js";

const TABLE_CUSTOMERS = 'customers';

export const fetchCustomers = async (setData: (data: Customer[]) => void) => {
    try {
        const data: PostgrestResponse<Customer> = await supabase.from(TABLE_CUSTOMERS).select('*');
        if (data.data !== null) {
            const result = [...data.data];
            result.sort((a, b) => (a.position - b.position));
            setData(result);
        }
    } catch (error) {
        console.error('Error retrieving waiting_queue from database', error);
    }
}

export const deleteCustomer = async (id: number) => {
    try {
        // Remove the customer from the database
        await supabase.from(TABLE_CUSTOMERS).delete().eq('id', id);

    } catch (error) {
        console.error(`Error deleting customer with ID ${id} from database`, error);
    }
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
        const data: PostgrestResponseSuccess<null> | PostgrestResponseFailure = await supabase.from(TABLE_CUSTOMERS).update(customer).eq('id', customer.id);
        if (data.error !== null) {
            console.error('Error updating customer', customer, data.error);
        }
    } catch (error) {
        console.error('Error updating waiting_queue from database', error);
    }
}


export const saveCustomer = async (customer: Customer) => {
    try {
        const data = await supabase.from(TABLE_CUSTOMERS).select('*').eq('name', customer.name);
        if (data.data == null) {
            const data: PostgrestResponseSuccess<null> | PostgrestResponseFailure = await supabase
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

