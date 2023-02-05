import {useCallback, useEffect, useState} from 'react'
import {createClient, PostgrestResponse} from '@supabase/supabase-js'
import {Customer} from '../models/customer'
import {RealtimeChannel} from "@supabase/realtime-js";

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const BROADCAST_CHANNEL = 'waiting_queue_updated';
const CHANNEL_NAME = 'waiting_updates';

export const useStore = () => {
    const [customers, setCustomers] = useState([] as Customer[]);

    let channel: RealtimeChannel | null = null;

    useEffect(() => {
        // Fetch current state of customers
        fetchList(setCustomers);

        // Listen to state changes of customers
        channel = supabase.channel(CHANNEL_NAME)
            .on(
                'broadcast',
                {
                    event: BROADCAST_CHANNEL
                    // TODO: Find out type
                }, (payload) => {
                    // TODO: Only update single queue
                    fetchList(setCustomers);
                }
            )
            .subscribe();

        // On unmount clean subscribed channels
        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        }
    }, []);

    const sendUpdate = useCallback((queue_id: number) => {
        if (channel) {
            // TODO: Send only the customers that should be updated
            channel.send({
                type: 'broadcast',
                event: BROADCAST_CHANNEL,
                payload: queue_id
            });
        }
    }, [channel]);

    return {customers: customers, sendUpdate: sendUpdate}
}

export const fetchList = async (setData: (data: Customer[]) => void) => {
    try {
        const data: PostgrestResponse<Customer> = await supabase.from('waiting_queue').select('*');
        if (data.data !== null) {
            const result = [...data.data];
            result.sort((a, b) => (a.position - b.position));
            setData(result);
        }
    } catch (error) {
        console.error('Error retrieving waiting_queue from database', error);
    }
}

export const updateUser = async (customer: Customer) => {
    try {
        const data: PostgrestResponse<undefined> = await supabase.from('waiting_queue').update(customer).eq('id', customer.id);
        if (data.error !== null) {
            console.error('Error updating customer', customer, data.error);
        }
    } catch (error) {
        console.error('Error updating waiting_queue from database', error);
    }
}