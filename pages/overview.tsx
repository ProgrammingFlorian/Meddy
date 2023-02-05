import type {NextPage} from 'next'
import {useEffect, useState} from 'react';
import {DndList} from '../components/DnDList'
import {Customer} from "../models/customer";
import {useStore} from "../lib/store";
import {useListState} from "@mantine/hooks";

const TextArea: React.FC = () => {
    const [text, setText] = useState('Text');
    const [isEditing, setIsEditing] = useState(false);

    const handleClick = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div onClick={handleClick} style={{textDecoration: isEditing ? 'underline' : 'none', backgroundColor: 'blue'}}>
            {isEditing ? <input value={text} onChange={(e) => setText(e.target.value)}/> : text}
        </div>
    );
};


const Overview: NextPage = () => {
    const praxisName = "TUM Praxis"
    const computerName = "Empfangsrechner"
    const time = "10:10"

    const [text, setText] = useState('Task List');
    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(text);

    const handleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        if (newText !== text) {
            const confirmChange = window.confirm(`Do you want to change the text from "${text}" to "${newText}"?`);
            if (confirmChange) {
                setText(newText);
            } else {
                setNewText(text);
            }
        }
        setIsEditing(false);
    };

    const {customers, sendUpdate} = useStore();
    const [listItems, listHandler] = useListState([] as Customer[]);

    useEffect(() => {
        listHandler.setState(customers);
    }, [customers]);


    return (
        <div className=''>
            <div
                className="notranslate"
                placeholder="Untitled"
                data-content-editable-leaf="true"
                contentEditable={isEditing}
                style={{
                    maxWidth: '100%',
                    width: '100%',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    textOverflow: 'ellipsis',
                    caretColor: 'rgba(255, 255, 255, 0.81)',
                    padding: '3px 2px',
                    outline: 'none',
                    textDecoration: isEditing ? 'underline' : 'none'
                }}
                data-dashlane-rid="5558833215360365"
                data-form-type=""
                onClick={handleClick}
                onBlur={handleBlur}
                onInput={(e) => setNewText(e.currentTarget.innerText)}
            >
                ffff
            </div>
            <div className=" flex select-none text-center min-h-screen flex-col justify-center py-2 max-w-max">
                <div className='flex flex-row justify-between font-bold blue-color px-8'>
                    <div className='text-start basis-1/2'>
                        <h2>{praxisName}</h2>
                        <h2>{computerName}</h2>
                    </div>
                    <div className=' text-end basis-1/2'>
                        <h1>{time} Uhr</h1>
                    </div>

                </div>
                <br/>
                <br/>
                <div className='columns-3'>
                    <div className='flex-col'>
                        <h3>Arzt 1</h3>
                        <main className="flex w-full flex-1  items-center justify-center px-20 text-center">

                            <DndList items={listItems} handler={listHandler} sendUpdate={sendUpdate}></DndList>
                        </main>
                    </div>

                    <div className='flex-col col-1'>
                        <h3>Arzt 2</h3>
                        <main className="flex w-full flex-1 items-center justify-center px-20 text-center">

                            <DndList items={listItems} handler={listHandler} sendUpdate={sendUpdate}></DndList>
                        </main>
                    </div>
                    <div className='flex-col'>
                        <h3>Arzt 3</h3>
                        <main className="flex w-full flex-1  items-center justify-center px-20 text-center">

                            <DndList items={listItems} handler={listHandler} sendUpdate={sendUpdate}></DndList>
                        </main>
                    </div>
                    <div className="w-full flex justify-center">
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


                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
            </div>
        </div>
    );
}

export default Overview;
