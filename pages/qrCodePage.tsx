import type {NextPage} from 'next'

import React, {useState} from "react";
import {QRCodeSVG} from "qrcode.react";
import {v4 as uuidv4} from 'uuid';
import {Button, Group, Modal, useMantineTheme} from "@mantine/core";

const id = uuidv4();
const generateRandomId = () => Math.random().toString(36).substr(2, 9);


const qrCodePage = (disabled: boolean) => {
    const [opened, setOpened] = useState(false);

    const greeting = "Herzlichen Willkommen in der TUM Praxis, Florian!";
    const id1 = uuidv4()
    const id2 = uuidv4()
    const url = "http://192.168.178.63:3000/waitingPage";
    const theme = useMantineTheme();

    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                overlayOpacity={0.55}
                overlayBlur={3}
                size={"lg"}
            >

                <div className="min-h-screen flex flex-col items-center justify-center py-2">
                    <div className='p-10 justify-center flex-1'>
                        <div className="text-center">
                            <br/>
                            <h1 className="font-bold text-blue-800">{greeting}</h1>
                            <br/>
                            <br/>
                        </div>
                        <div className='justify-center flex'>
                            <QRCodeSVG className='' value={`${url}`} width={256} height={256}/>
                        </div>
                        <br/>
                        <br/>
                        <div className="font-bold text-center text-blue-800" style={{fontSize: 25}}>Scannen Sie den
                            QR-Code um über Ihre Wartezeit informiert zu
                            bleiben
                        </div>
                    </div>
                </div>

            </Modal>
            <Group position="center">
                <Button
                    style={{width: "100%"}}
                    onClick={() => {
                        if (!disabled) {
                            setOpened(true)
                        }
                    }}>QR Code generieren</Button>
            </Group>
        </>
    );
}

export default qrCodePage;