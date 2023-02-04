import { useListState } from '@mantine/hooks';
import type { NextPage } from 'next'
import { useEffect } from 'react';
import { DndList } from '../components/DnDList'
import { updateUser, useStore } from '../lib/store';
import { Customer } from '../models/customer';

const Overview: NextPage = () => {
    const customers = useStore();
    const [listItems, listHandler] = useListState([] as Customer[]);

    const onReorder = () => {
        for(const c of customers) {
            updateUser(c);
        }
    }

    useEffect(() => {
        console.log('customers', customers);
        listHandler.setState(customers);
    }, [customers]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
                <div>
                    <h1 className="my-5">Dr. Proman</h1>
                    <DndList items={listItems} handler={listHandler} onReorder={onReorder}></DndList>
                </div>
            </main>
        </div>
    )
}

export default Overview
