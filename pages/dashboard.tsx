import React, {useEffect, useState} from "react";
import {useStore} from "../lib/store";
import {useListState} from "@mantine/hooks";
import {Customer} from "../models/Customer";
import {DndList} from "../components/DnDList";
import checkInPage from "./checkInPage";
import {Language} from "../models/Language";


interface DashboardProps {
    nameOfClient: string,
    nameOfComputer: string,
    language: Language,
}

const dashboard = (props: DashboardProps) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 30000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);


    const {customers, sendUpdate} = useStore();
    const [listItems, listHandler] = useListState([] as Customer[]);

    useEffect(() => {
        listHandler.setState(customers);
    }, [customers]);


    return (
        <div className='flex flex-row justify-center'>
            <div className="flex select-none text-center min-h-screen flex-col justify-center py-2">
                <div className='flex flex-row justify-between font-bold blue-color px-8'>
                    <div className='text-start basis-1/2'>
                        <h2>{props.nameOfClient}</h2>
                        <h2>{props.nameOfComputer}</h2>
                    </div>
                    <div className=' text-end basis-1/2'>
                        <h1> {time.toLocaleTimeString('de-DE', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Europe/Berlin'
                        })} Uhr</h1>
                    </div>

                </div>
                <br/>
                <br/>
                <div className=''>
                    <div className="flex flex-row">
                        <div className=''>
                            <h3>Arzt 1</h3>
                            <main className="flex w-full flex-1 items-center justify-center px-20 text-center">
                                <DndList items={listItems} handler={listHandler} sendUpdate={sendUpdate}></DndList>
                            </main>
                        </div>
                        <div className=''>
                            <h3>Arzt 2</h3>
                            <main className="flex w-full flex-1 items-center justify-center px-20 text-center">
                                <DndList items={listItems} handler={listHandler} sendUpdate={sendUpdate}></DndList>
                            </main>
                        </div>
                        <div className=''>
                            <h3>Arzt 3</h3>
                            <main className="flex w-full flex-1 items-center justify-center px-20 text-center">
                                <DndList items={listItems} handler={listHandler} sendUpdate={sendUpdate}></DndList>
                            </main>
                        </div>


                    </div>

                    <div className="items-center">
                        {checkInPage()}
                    </div>
                </div>


            </div>

        </div>
    );
}

export default dashboard;

