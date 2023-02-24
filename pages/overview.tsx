import type {NextPage} from 'next'
import React, {useEffect, useState} from 'react';
import {DndList} from '../components/DnDList'
import {Customer} from "../models/customer";
import {useStore} from "../lib/store";
import {useListState} from "@mantine/hooks";
import {Text} from "@mantine/core";
import DropDownMenuLanguage from "../components/DropDownMenuLanguage";
import DropDownMenu from "../components/DropDownMenu";
import DropDownMenuComputername from "../components/DropDownMenuComputername";


const Overview: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex overflow-x-hidden h-screen">
            <aside
                className={`flex-shrink-0 w-64 flex flex-col border-r transition-all duration-300 ${!sidebarOpen ? '-ml-64' : ''}`}>
                <div className="h-12 bg-blue"></div>
                <nav className="flex-1 flex flex-col text-gray-500  text-center font-bold bg-white">
                    <div className="flex h-screen justify-center items-center m-2 h-8 bg-gray-300 rounded">
                        <a href="#" className="  p-2">Praxisname bearbeiten</a>
                    </div>
                    <div className="flex h-screen justify-center items-center m-2 h-8 bg-gray-300 rounded">
                        <button className="  p-2" >Computername bearbeiten</button>
                    </div>
                    <div className="flex h-screen justify-center items-center m-2 h-8 bg-gray-300 rounded">
                        <DropDownMenuComputername></DropDownMenuComputername>
                    </div>
                    <div className="flex h-screen justify-center items-center m-2 h-8 bg-gray-300 rounded">

                        <DropDownMenuLanguage/>
                    </div>


                </nav>
            </aside>
            <div className="flex-1">
                <header className="flex items-center p-2 text-semibold text-gray-100 bg-blue">
                    <button className="p-1 mr-4" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                             className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </button>
                </header>
                <main className="p-4">
                    <Overview2/>
                </main>
            </div>
        </div>
    );
};

export default Overview


interface TextFieldProps {
    initialText: string;
}


const EditableTextField: React.FC<TextFieldProps> = ({initialText}) => {
    const [isEditing, setIsEditing] = useState(true);
    const [value, setValue] = useState(initialText);
    const [tempValue, setTempValue] = useState(value);

    const handleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        if (value !== tempValue) {
            const confirmation = window.confirm(`Do you want to change the text from "${value}" to "${tempValue}"?`);
            if (confirmation) {
                setValue(tempValue);
            }
        }
        setIsEditing(false);
    };

    return (
        <div style={{display: 'inline-block', position: 'relative'}}>
            {isEditing && (
                <span style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: "gray"

                }}
                >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               className="bi bi-pencil-square" viewBox="0 0 16 16">
  <path
      d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fillRule="evenodd"
        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg>
        </span>
            )}
            {isEditing ? (
                <input

                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={handleBlur}
                    style={{
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        width: '100%',
                        padding: 0,
                        margin: 0,
                        color: "gray"

                    }}
                />
            ) : (
                <div
                    style={{cursor: 'pointer'}}
                    onClick={handleClick}
                >
                    {value || initialText}
                </div>
            )}

        </div>
    );
};


const Overview2: NextPage = () => {
    const praxisName = "TUM Praxis";
    const computerName = "Empfangsrechner";
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
                        <h2><EditableTextField initialText="Praxis Name"/></h2>
                        <h2><EditableTextField initialText="Name des Computers"/></h2>
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
                        <button
                            className="bg-blue-500 w-50 hover:bg-blue-700 text-white justify-self-center border border-transparent font-bold py-2 px-4 rounded"
                            onClick={() => {
                                window.location.href = "checkInPage";
                            }}>
                            Neuen Patient einchecken
                        </button>
                    </div>
                </div>


            </div>

        </div>
    );
}


