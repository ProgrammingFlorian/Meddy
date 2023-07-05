import {
    ActionIcon,
    Button,
    Text,
    Card,
    Group,
    Menu,
    Modal,
    ScrollArea,
    Textarea,
    TextInput,
    rem,
    Popover, Container, Space
} from "@mantine/core";
import React, {useContext, useEffect, useState} from "react";
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import {StoreContext} from "../../lib/Store";
import {useTranslation} from "next-i18next";


interface FeedbackModalProps{
    feedbackOpen: boolean,
    setFeedbackOpen(open: boolean): void;
}

const FeedbackModal = (props: FeedbackModalProps) => {
    const [inputText, setInputText] = useState("");
    const { feedback, addFeedback, deleteFeedback, updateFeedback } = useContext(StoreContext);
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);


    const formatDate = (date: Date) => {
        const d = new Date(date),
            day = '' + d.getDate(),
            month = '' + (d.getMonth() + 1),
            year = d.getFullYear();

        const hours = '' + d.getHours(),
            minutes = '' + d.getMinutes();

        return [
            (day.length < 2 ? '0' : '') + day,
            (month.length < 2 ? '0' : '') + month,
            year
        ].join('.') + ', ' + [
            (hours.length < 2 ? '0' : '') + hours,
            (minutes.length < 2 ? '0' : '') + minutes
        ].join(':');
    }
    const [editId, setEditId] = useState<number>();
    const [editText, setEditText] = useState("");



    return (<Modal
        size={600}
        opened={props.feedbackOpen}
        onClose={() => props.setFeedbackOpen(false)}
        title="Feedback"
    >
        <ScrollArea> {/* Add a maxHeight style to limit the height of the scroll area */}
            {feedback.sort((f1, f2) => new Date(f2.date).getDate() - new Date(f1.date).getDate()).sort((f1, f2) => new Date(f1.date).getTime() - new Date(f2.date).getTime()).map((f) => {

                const isEditing = editId === f.id;


                return(
                <Card shadow="sm" padding="lg" radius="md" withBorder style={{marginBottom: 20}} key={f.id}>
                    <Card.Section withBorder inheritPadding py="xs">
                    <Group position="apart">
                        <Text weight={500}>Feedback vom {formatDate(f.date)}</Text>
                        <Menu withinPortal position="bottom-end" shadow="sm">
                            <Menu.Target>
                                <ActionIcon>
                                    <IconDots size="1rem" />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item icon={<IconEdit size={rem(14)}/>} onClick={() => {
                                    setEditId(f.id);
                                    setEditText(f.content);
                                }}>Bearbeiten</Menu.Item>
                                <Menu.Item icon={<IconTrash size={rem(14)} />} color="red" onClick={() => deleteFeedback(f.id)}>
                                   Löschen
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Card.Section>{
                    isEditing ?  <>
                        <Group style={{marginTop: 20}}>
                        <Textarea minRows={4} maxRows={8} value={editText}  onChange={e => {
                            setEditText(e.target.value);
                        }} placeholder="Feedback" sx={{ flex: 1 }} />
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                                <Button loading={loading} color={"green"} style={{ marginBottom: 10}} onClick={async () => {
                                    setLoading(true);
                                    await updateFeedback(f.id, editText);
                                    setLoading(false);
                                    setEditId(0)
                                }}>OK</Button>
                                <Button color={"red"} onClick={() => {
                                    setEditText('');
                                    setEditId(-1);
                                }}>Cancel</Button>
                            </div>

                    </Group></>: <Text style={{marginTop: 20}}>{f.content}</Text>
                }
                </Card>
                )})}
        </ScrollArea>


        <Group>
            <Textarea minRows={4} maxRows={8} value={inputText} onChange={e => {
                setInputText(e.target.value)
            }} placeholder="Feedback" sx={{ flex: 1 }} />
            <Button loading={loading} style={{alignItems: "end"}} onClick={async () => {
                setEditId(0);
                setLoading(true);
                await addFeedback(inputText);
                setLoading(false);
                setInputText('');
            }}>Senden</Button>
        </Group>
    </Modal>)
}

export default FeedbackModal;