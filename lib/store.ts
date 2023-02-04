import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { createClient, PostgrestResponse } from '@supabase/supabase-js'
import { Customer } from '../models/customer'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export const useStore = () => {
  const [customers, setCustomers] = useState([] as Customer[]);
  const [changedCustomers, setChangedCustomers] = useState(null as Customer | null);

  useEffect(() => {
    // Fetch current state of customers
    fetchList(setCustomers);

    const CHANNEL_NAME = 'waiting_updates';
    // Listen to state changes of customers
    const channel = supabase.channel(CHANNEL_NAME)
      .on(
        'postgres_changes',
        {
          event: '*', schema: 'public', table: 'waiting_queue'
        }, (payload: any) => {
          if (payload.errors === null) {
            setChangedCustomers(payload.new);
          } else {
            console.log('error receiving database change', payload.errors)
          }
        }
      )
      .subscribe();

    // On unmount clean subscribed channels
    return () => {
      supabase.removeChannel(channel);
    }
  }, []);

  useEffect(() => {
    if (changedCustomers !== null) {
      const existingIndex = customers.findIndex((e) => e.id === changedCustomers.id);
      if (existingIndex !== -1) {
        const result = [...customers.filter((c) => c.id !== changedCustomers.id), changedCustomers];
        result.sort((a, b) => (a.position - b.position));
        setCustomers(result);
      } else {
        const result = [...customers, changedCustomers];
        result.sort((a, b) => (a.position - b.position));
        setCustomers(result);
      }
    }
  }, [changedCustomers]);

  return customers;
}

export const fetchList = async (setData: (data: Customer[]) => void) => {
  try {
    const data: PostgrestResponse<Customer> = await supabase.from('waiting_queue').select('*');
    if (data.data !== null) {
      const result = [...data.data];
      result.sort((a, b) => (a.position - b.position));
      console.log('sort', result);
      setData(result);
    }
  } catch (error) {
    console.log('Error retrieving waiting_queue from database', error);
  }
}

export const updateUser = async (customer: Customer) => {
  try {
    const data: PostgrestResponse<undefined> = await supabase.from('waiting_queue').update(customer).eq('id', customer.id);
    if (data.error !== null) {
      console.log('Error updating customer', customer, data.error);
    }
  } catch (error) {
    console.log('Error retrieving waiting_queue from database', error);
  }
}