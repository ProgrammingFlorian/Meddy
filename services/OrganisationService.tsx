import {PostgrestResponse} from "@supabase/supabase-js";
import {supabase} from "../lib/store";
import {Organisation} from "../models/Organisation";



const TABLE_ORGANISATIONS = 'organisations';

export const fetchOrganisation = async (setData: (data: Organisation) => void, id: number) => {
    try {
        const data: PostgrestResponse<Organisation> = await supabase.from(TABLE_ORGANISATIONS).select('*').eq("id", id);
        if (data.data !== null) {
            const result = data.data[0];
            setData(result);
        }
    } catch (error) {
        console.error('Error retrieving waiting_queues from database', error);
    }
}



export const saveOrganisation = async (organisation: Organisation) => {
    try {
        const data: PostgrestResponse<Organisation> = await supabase.from(TABLE_ORGANISATIONS).select('*').eq('name', organisation.name);
        if (data.data == null) {
            const data: PostgrestResponse<undefined> = await supabase
                .from(TABLE_ORGANISATIONS)
                .insert(organisation);

            if (data.error !== null) {
                console.error('Error saving organisation', organisation, data.error);
            }
        }

    } catch (error) {
        console.error('Error saving organisation to database', error);
    }
};




export const updateOrganisation = async (organisation: Organisation) => {
    try {
        const data: PostgrestResponse<Organisation> = await supabase.from(TABLE_ORGANISATIONS).update(organisation).eq('id', organisation.id);
        if (data.error !== null) {
            console.error('Error saving organisation', organisation, data.error);
        }

    } catch (error) {
        console.error('Error saving organisation to database', error);
    }
};