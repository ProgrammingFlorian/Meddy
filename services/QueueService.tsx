import {PostgrestResponse} from "@supabase/supabase-js";
import {Customer} from "../models/Customer";
import {supabase} from "../lib/store";
import {Queue} from "../models/Queue";


const TABLE_QUEUES = 'queues';

export const fetchQueues = async (setData: (data: Queue[]) => void, organisation_id: number) => {
    try {
        const data: PostgrestResponse<Queue> = await supabase.from(TABLE_QUEUES).select('*').eq("organisation_id", organisation_id);
        if (data.data !== null) {
            const result = [...data.data];
            result.sort((a, b) => a.name.localeCompare(b.name));
            setData(result);
        }
    } catch (error) {
        console.error('Error retrieving waiting_queues from database', error);
    }
}


//todo
export const saveQueue = async (setData: (data: Queue[]) => void, organisation_id: number) => {
    try {
        const data: PostgrestResponse<Queue> = await supabase.from(TABLE_QUEUES).select('*').eq("organisation_id", organisation_id);
        if (data.data !== null) {
            const result = [...data.data];
            result.sort((a, b) => a.name.localeCompare(b.name));
            setData(result);
        }
    } catch (error) {
        console.error('Error retrieving waiting_queues from database', error);
    }
}

