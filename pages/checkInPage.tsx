import {Box, Button, Modal, Group, createStyles, NumberInput, Select, Textarea, TextInput} from "@mantine/core";
import {useState} from "react";
import {Language} from "../models/Language";
import {customLabel} from "../models/Functions";
import {useForm} from "@mantine/form";
import qrCodePage from "./qrCodePage";
import {Customer} from "../models/Customer";
import {saveCustomer} from "../services/CustomerService";


const checkInPage = () => {

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


    const language = Language.GERMAN
    const employees = ['Arzt 1', 'Arzt 2', 'Arzt 3', 'Arzt 4']
    const {classes} = useStyles();
    const [approxWaitingTime, setApproxWaitingTime] = useState(5);
    const [inputName, setInputName] = useState("")
    const [employee, setEmployee] = useState(employees[0])
    const [comment, setComment] = useState("")

    const form = useForm({
        initialValues: {
            name: '', email: '', password: '',
            confirmPassword: ''
        },

        // functions will be used to validate values at corresponding key
        validate: {
            name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            email: (value) => value.length > 0 ? (/^\S+@\S+$/.test(value) ? null : 'Invalid email') : null,
        },
    });
    return (
        <>
            <Modal
                size="lg"
                opened={opened}
                onClose={() => setOpened(false)}
                className="my-modal"
            >
                <div className="flex flex-col items-center justify-center">
                    <div className="relative inline-block text-left" style={{minWidth: 500}}>
                        <div className=" p-10 justify-center">
                            <label htmlFor="select"
                                   className=" text-center font-semibold text text-2xl text-blue-500 block py-2">
                                Neuer Kund*in
                            </label>
                            <br/>
                            <Box sx={{maxWidth: 340}} mx="auto">
                                <form onSubmit={form.onSubmit((values) => console.log(values))}>
                                    <TextInput
                                        label={customLabel("Patienten Name", true)}
                                        placeholder="Name"
                                        {...form.getInputProps('name')} />
                                    <br/>
                                    <NumberInput
                                        label={customLabel(language == Language.GERMAN ? "Geschätze Termindauer in Minuten:" : "Approximate duration of appointment:")}
                                        hideControls
                                        placeholder={String(approxWaitingTime)}
                                        classNames={{input: classes.textColor}}
                                        value={approxWaitingTime}
                                        onChange={() => setApproxWaitingTime}
                                    />
                                    <div className="grid grid-cols-4 gap-0.5 pt-1 place-items-stretch">
                                        <Button color="gray"
                                                onClick={() => setApproxWaitingTime(10)}>
                                            10 min
                                        </Button>
                                        <Button color="gray"
                                                onClick={() => setApproxWaitingTime(15)}>
                                            15 min
                                        </Button>
                                        <Button color="gray"
                                                onClick={() => setApproxWaitingTime(20)}>
                                            20 min
                                        </Button>
                                        <Button color="gray"
                                                onClick={() => setApproxWaitingTime(30)}>
                                            30 min
                                        </Button>

                                    </div>
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
                                    <br/>
                                    <div className="flex flex-col items-center justify-content-center">
                                        <Button type="submit" onClick={() => {
                                            const randomID = Math.random();

                                            const customer: Customer = {
                                                duration: 0, id: randomID, name: "", position: 0, queue_id: 0
                                            }
                                            //saveCustomer(customer)


                                        }
                                        }>
                                        </Button>
                                        {form.isValid() ? qrCodePage(false) : qrCodePage(true)}
                                        <br/>
                                    </div>
                                </form>
                            </Box>
                        </div>
                    </div>
                </div>
                <br/>
                <br/>

            </Modal>

            <Group position="center">
                <Button onClick={() => setOpened(true)}>Neuen Patienten einchecken</Button>
            </Group>
        </>


    )
}
export default checkInPage;
