import React, {useContext, useEffect, useState} from "react";
import checkInPage from "../CheckinPopup";
import {Language} from "../../models/Language";
import QueueViewer from "./QueueViewer";
import {StoreContext} from "../../lib/store";

const Dashboard = () => {
    const [time, setTime] = useState(new Date());
    const {organisation, updateOrganisation} = useContext(StoreContext);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 30000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    //todo connect "Verwaltungsrechner" to database
    return (
        <div className='flex flex-row justify-center'>
            <div className="flex select-none text-center min-h-screen flex-col justify-center py-2">
                <div className='flex flex-row justify-between font-bold blue-color px-8'>
                    <div className='text-start basis-1/2'>
                        <h2>{organisation.name}</h2>
                        <h2>Verwaltungsrechner</h2>
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
                        <QueueViewer/>
                    </div>
                    <div className="items-center">
                        {checkInPage()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

