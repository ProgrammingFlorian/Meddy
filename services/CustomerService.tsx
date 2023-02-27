import {Customer} from "../models/Customer";
import {PostgrestResponse} from "@supabase/supabase-js";
import {supabase} from "../lib/store";

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