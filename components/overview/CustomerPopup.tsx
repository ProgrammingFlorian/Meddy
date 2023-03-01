import React, {useContext, useState} from 'react';
import {Box, Button, createStyles, Group, Modal, NumberInput, Popover, Select, Textarea} from '@mantine/core';
import {customLabel} from "../../helpers/Functions";
import {Language} from "../../models/Language";
import {Customer} from "../../models/Customer";
import QRCodePopup from "../QRCodePopup";
import {Queue} from "../../models/Queue";
import {StoreContext} from "../../lib/store";

interface CustomerPopupProps {
    customer: Customer;
    queues: Queue[];
    updateCustomer: (customer: Customer) => void;
    onClose: () => void;
}

const CustomerPopup = (props: CustomerPopupProps) => {
    const [propertiesChanged, setPropertiesChanged] = useState(false);
    const {deleteCustomer} = useContext(StoreContext);
    const useStyles = createStyles((theme) => ({
        backgroundColor: {
            backgroundColor:
                theme.fn.rgba("#ffffff", 1)
        },
        textColor: {
            color: "black"
        }
    }));
    const language = Language.GERMAN;
    const {classes} = useStyles();
    const [approxWaitingTime, setApproxWaitingTime] = useState(20);
    const [inputName, setInputName] = useState("");
    const [queue, setQueue] = useState(props.queues.find(queue => props.customer.queue_id === queue.id)?.name ?? null);
    const [notes, setNotes] = useState(props.customer.notes);
    const [durationOfAppointment, setDurationOfAppointment] = useState(props.customer.duration)

    const [qrCodeShown, showQRCode] = useState(false);
    const [opened, setOpened] = useState(true);


    return (
        <div>
            <Modal
                opened={opened}
                onClose={props.onClose}
                size={"lg"}
            >
                <div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative inline-block text-left">
                            <div className=" p-10 justify-center">
                                <label htmlFor="select"
                                       className=" text-center font-semibold text text-2xl text-blue-500 block py-2">
                                    {props.customer.name}
                                </label>
                                <br/>
                                <div className="grid grid-cols-2 gap-1" style={{fontWeight: "bold"}}>
                                    <h2>Aktuelle Wartezeit:&nbsp;</h2>
                                    <h2>{approxWaitingTime}&nbsp;{approxWaitingTime == 1 ? "Minute" : "Minuten"} </h2>
                                </div>
                                <div className="grid grid-cols-2 gap-1 mt-2 place-items-stretch">
                                    <Popover trapFocus position="bottom" withArrow shadow="md">
                                        <Popover.Target>
                                            <Button color="green">
                                                Aufrufen
                                            </Button>
                                        </Popover.Target>
                                        <Popover.Dropdown sx={(theme) => ({background: theme.white})}>
                                            <Button color="gray"
                                                    onClick={() => setOpened(false)}>
                                                Bestätigen
                                            </Button>
                                        </Popover.Dropdown>
                                    </Popover>
                                    <Popover trapFocus position="bottom" withArrow shadow="md">
                                        <Popover.Target>
                                            <Button color="red">
                                                Check Out
                                            </Button>
                                        </Popover.Target>
                                        <Popover.Dropdown sx={(theme) => ({background: theme.white})}>
                                            <Button color="gray"
                                                    onClick={() => {
                                                        setOpened(false);
                                                        deleteCustomer(props.customer.id);
                                                    }}>
                                                Bestätigen
                                            </Button>
                                        </Popover.Dropdown>
                                    </Popover>
                                </div>
                                <br/>
                                <br/>
                                <div className="grid grid-cols-2 gap-1 place-items-stretch">
                                    <h2 style={{fontWeight: "bold"}}>Termindauer:</h2>
                                    <h2 style={{fontWeight: "bold"}}>{durationOfAppointment}&nbsp;{approxWaitingTime == 1 ? "Minute" : "Minuten"}</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-1 place-items-stretch pb-1 pt-2">
                                    <Button color="gray"
                                            onClick={() => {
                                                setPropertiesChanged(true);
                                                setDurationOfAppointment(durationOfAppointment > 4 ? durationOfAppointment - 5 : 0)
                                            }}>
                                        - 5 min
                                    </Button>
                                    <Button color="gray"
                                            onClick={() => {
                                                setPropertiesChanged(true);
                                                setDurationOfAppointment(durationOfAppointment + 5)
                                            }}>
                                        + 5 min
                                    </Button>
                                    <Button color="gray"
                                            onClick={() => {
                                                setPropertiesChanged(true);
                                                setDurationOfAppointment(durationOfAppointment + 10)
                                            }}>
                                        + 10 min
                                    </Button>
                                    <NumberInput
                                        placeholder={String(approxWaitingTime)}
                                        value={durationOfAppointment}
                                        step={5}
                                        min={15}
                                        max={120}
                                        onChange={(value: number) => {
                                            setPropertiesChanged(true);
                                            setDurationOfAppointment(value)
                                        }}
                                        styles={() => ({
                                            input: {
                                                background: "#878e95",
                                                textAlign: "center",
                                                fontWeight: "bold",
                                                color: "white",
                                            }
                                        })}
                                    />
                                </div>

                                <br/>
                                <Box sx={{minWidth: 340}} mx="auto">
                                    <form>
                                        <br/>
                                        {/* TODO: Handle no existing queues */}
                                        <Select
                                            data={props.queues.map(queue => queue.name)}
                                            defaultValue={queue}
                                            label={customLabel(language == Language.GERMAN ? "Behandelnde/r Ärztin/Arzt" : "Doctor:")}
                                            onChange={setQueue}
                                        />
                                        <br/>
                                        <Textarea
                                            label={customLabel(language == Language.GERMAN ? "Notizen:" : "Notes")}
                                            defaultValue={notes}
                                            onChange={event => {
                                                setPropertiesChanged(true);
                                                setNotes(event.target.value)
                                            }}
                                            placeholder="Nur interne Informationen"
                                            minRows={3}
                                            maxRows={10}
                                            autosize
                                        />
                                        <br/>
                                        <div className="flex flex-col items-center justify-content-center">
                                            <div className="flex flex-row gap-2">
                                                <Button
                                                    disabled={!propertiesChanged}>
                                                    Änderungen speichern
                                                </Button>
                                                <QRCodePopup visible={qrCodeShown} onClose={() => showQRCode(false)}
                                                             customer={props.customer}/>
                                                <Group position="center">
                                                    <Button
                                                        style={{width: "100%"}}
                                                        onClick={() => showQRCode(true)}>{"QR Code anzeigen"}</Button>
                                                </Group>
                                            </div>

                                        </div>
                                    </form>
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CustomerPopup;