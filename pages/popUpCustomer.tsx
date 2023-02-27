import React, {useState} from 'react';
import {Box, Button, createStyles, Group, Modal, NumberInput, Popover, Select, Text, Textarea} from '@mantine/core';
import {customLabel} from "../models/Functions";
import {Language} from "../models/Language";
import {Customer} from "../models/Customer";
import qrCodePage from "./qrCodePage";

interface popUpCustomerProps {
    name: string,
    duration: number,
}


const popUpCustomer = (item: Customer) => {
    const [opened, setOpened] = useState(false);
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
    const employees = ['Arzt 1', 'Arzt 2', 'Arzt 3', 'Arzt 4'];
    const {classes} = useStyles();
    const [approxWaitingTime, setApproxWaitingTime] = useState(20);
    const [inputName, setInputName] = useState("");
    const [employee, setEmployee] = useState(employees[0]);
    const [comment, setComment] = useState("");
    const [durationOfAppointment, setDurationOfAppointment] = useState(item.duration)


    return (
        <div>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                size={"lg"}
            >

                <div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative inline-block text-left">
                            <div className=" p-10 justify-center">
                                <label htmlFor="select"
                                       className=" text-center font-semibold text text-2xl text-blue-500 block py-2">
                                    {item.name}
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
                                            <Button color="gray">
                                                OK
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
                                            <Button color="gray">
                                                OK
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
                                            onClick={() => setDurationOfAppointment(durationOfAppointment > 4 ? durationOfAppointment - 5 : 0)}>
                                        - 5 min
                                    </Button>
                                    <Button color="gray"
                                            onClick={() => setDurationOfAppointment(durationOfAppointment + 5)}>
                                        + 5 min
                                    </Button>
                                    <Button color="gray"
                                            onClick={() => setDurationOfAppointment(durationOfAppointment + 10)}>
                                        +10 min
                                    </Button>
                                    <NumberInput

                                        placeholder={String(approxWaitingTime)}
                                        value={durationOfAppointment}
                                        step={5}
                                        min={15}
                                        max={120}
                                        onChange={(value: number) => setDurationOfAppointment(value)}
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
                                        <Select
                                            data={employees}
                                            defaultValue={employees.length > 0 ? employees[0] : "no selection possible"}
                                            label={customLabel(language == Language.GERMAN ? "Behandelnde/r Ärztin/Arzt" : "Doctor:")}
                                            onChange={() => setEmployee}
                                        />
                                        <br/>
                                        <Textarea
                                            label={customLabel(language == Language.GERMAN ? "Notizen:" : "Notes")}
                                            placeholder="only internal information"
                                            minRows={3}
                                            maxRows={10}
                                            autosize
                                        />
                                        <br/>
                                        <div className="flex flex-col items-center justify-content-center">
                                            {qrCodePage()}
                                        </div>
                                    </form>
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>

            </Modal>

            <Group position="center" style={{width: '100%', height: '100%', margin: 0, padding: 0}}>
                <div className="text-gray-500 font-bold m-2"
                     onClick={() => setOpened(true)}>
                    <Text>{item.name}</Text>
                    <Text size="sm">
                        Dauer: {item.duration} Minuten
                    </Text>
                </div>
            </Group>
        </div>
    );
}

export default popUpCustomer;