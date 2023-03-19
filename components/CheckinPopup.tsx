import {Box, Button, createStyles, Group, Modal, Select, Space, Textarea, TextInput} from "@mantine/core";
import {useContext, useEffect, useState} from "react";
import {Language} from "../models/Language";
import {customLabel} from "../helpers/Functions";
import {useForm} from "@mantine/form";
import {Customer} from "../models/Customer";
import QRCodePopup from "./overview/QRCodePopup";
import CustomerService from "../services/CustomerService";
import {StoreContext} from "../lib/Store";
import {useTranslation} from "next-i18next";

const CheckinPopup = () => {
    const {t} = useTranslation();

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


    const {classes} = useStyles();
    const [isLoading, setLoading] = useState(false);
    const [customer, setCustomer] = useState(null as null | Customer);

    const form = useForm({
        initialValues: {
            name: '',
            duration: 5,
            queue: '',
            notes: ''
        },

        // functions will be used to validate values at corresponding key
        validate: {
            name: value => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            duration: value => value < 0 ? "Bitte wähle eine positive Dauer" : null,
            queue: value => queues.find(queue => queue.name == value) === undefined ? 'Bitte wähle ein Element' : null
        },
    });

    const {queues} = useContext(StoreContext);

    useEffect(() => {
        if (queues.length > 0) {
            form.setFieldValue('queue', queues[0].name);
        }
    }, [queues]);

    return (
        <>
            {customer ?
                <QRCodePopup visible={true} customer={customer} onClose={() => {
                    setOpened(false);
                    setCustomer(null);
                }}/> : <></>}
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
                                <form onSubmit={form.onSubmit((values) => {
                                    const queueId = queues.find(queue => queue.name === values.queue)?.id;
                                    if (queueId) {
                                        // @ts-ignore TODO
                                        const customer: Customer = {
                                            duration: values.duration,
                                            name: values.name,
                                            notes: values.notes,
                                            position: 0,
                                            queue_id: queueId
                                        }
                                        CustomerService.saveCustomer(customer).then(createdCustomer => {
                                            setCustomer(createdCustomer);
                                            setLoading(false);
                                        });
                                        setLoading(true);
                                        setTimeout(()=> form.reset(), 500);
                                    }
                                })}>
                                    <TextInput
                                        label={customLabel(t('customer.customerName'), true)}
                                        placeholder={`${t('customer.name')}`}
                                        {...form.getInputProps('name')} />
                                    <br/>
                                    <TextInput
                                        label={customLabel(t('customer.approximateAppointmentDuration')+":")}
                                        placeholder={"5"}
                                        classNames={{input: classes.textColor}}
                                        {...form.getInputProps('duration')}
                                    />
                                    <div className="grid grid-cols-4 gap-0.5 pt-1 place-items-stretch">
                                        <Button color="gray"
                                                onClick={() => form.setFieldValue('duration', 10)}>
                                            10 {t('minutesAbbreviation')}
                                        </Button>
                                        <Button color="gray"
                                                onClick={() => form.setFieldValue('duration', 15)}>
                                            15 {t('minutesAbbreviation')}
                                        </Button>
                                        <Button color="gray"
                                                onClick={() => form.setFieldValue('duration', 20)}>
                                            20 {t('minutesAbbreviation')}
                                        </Button>
                                        <Button color="gray"
                                                onClick={() => form.setFieldValue('duration', 30)}>
                                            30 {t('minutesAbbreviation')}
                                        </Button>

                                    </div>
                                    <br/>
                                    <Select
                                        data={queues.map(queue => queue.name)}
                                        label={customLabel(t('checkIn.assignedDoctor'))}
                                        {...form.getInputProps('queue')}
                                    />
                                    <br/>
                                    <Textarea
                                        label={customLabel(t('customer.notes'))}
                                        placeholder={`${t('customer.notesPlaceholder')}`}
                                        minRows={3}
                                        maxRows={10}
                                        autosize
                                    />
                                    <br/>
                                    <br/>
                                    <div className="flex flex-col items-center justify-content-center">
                                        <Button type="submit"
                                                loading={isLoading}>
                                            {t('customer.createCostumer')}
                                        </Button>
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
                <Button size={"md"} onClick={() => setOpened(true)}>Neuen Patienten einchecken</Button>
            </Group>
        </>
    );
};

export default CheckinPopup;
