import {useCallback, useEffect, useState} from 'react'
import {createClient} from '@supabase/supabase-js'
import {Customer} from '../models/Customer'
import {RealtimeChannel} from "@supabase/realtime-js";
import {fetchCustomers} from "../services/CustomerService";

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

const BROADCAST_CHANNEL = 'waiting_queue_updated';
const CHANNEL_NAME = 'waiting_updates';

export const useStore = () => {
    const [customers, setCustomers] = useState([] as Customer[]);

    let channel: RealtimeChannel | null = null;

    useEffect(() => {
        // Fetch current state of customers
        fetchCustomers(setCustomers);

        // Listen to state changes of customers
        channel = supabase.channel(CHANNEL_NAME)
            .on(
                'broadcast',
                {
                    event: BROADCAST_CHANNEL
                    // TODO: Find out type
                }, (payload) => {
                    // TODO: Only update single queue
                    fetchCustomers(setCustomers);
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