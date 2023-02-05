import type {NextPage} from 'next'

import React from "react";
import {QRCodeSVG} from "qrcode.react";
import {v4 as uuidv4} from 'uuid';

const id = uuidv4();

const generateRandomId = () => Math.random().toString(36).substr(2, 9);


const qrCodePage: NextPage = () => {

    const greeting = "Herzlichen Willkommen in der TUM Praxis, Florian!";
    const id1 = uuidv4()
    const id2 = uuidv4()
    const url = "http://10.181.134.159:3000/waitingPage";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-2">
            <div className='p-10 bg-gray-100 justify-center flex-1'>
                <div className="text-center" style={{width: "400px"}}>
                    <br/>
                    <h1 className="font-bold text-blue-800">{greeting}</h1>
                    <br/>
                    <br/>
                    <h3 className="font-bold text-blue-800">Scannen Sie den QR-Code um über Ihre Wartezeit informiert zu
                        bleiben</h3>
                    <br/>
                    <br/>
                </div>
                <div className='justify-center flex'>
                    <QRCodeSVG className='' value={`${url}`} width={256} height={256}/>
                </div>
            </div>
        </div>
    );
}

export default qrCodePage;