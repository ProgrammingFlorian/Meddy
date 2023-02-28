import {ActionIcon, Button, Card, Group, Modal, Text, TextInput} from "@mantine/core";
import {IconX} from "@tabler/icons-react";
import {useForm} from "@mantine/form";
import {useEffect, useState} from "react";
import {Queue} from "../models/Queue";
import {User} from "@supabase/auth-helpers-react";
import {fetchQueues} from "../services/QueueService";

interface QueueManagementProps {
    isOpen: boolean,
    onClose: () => void,
    user: User
}

export const QueueManagement = (props: QueueManagementProps) => {
    const form = useForm({
        initialValues: {name: ""},
        validate: {
            name: (value) => (value.length < 3 ? "Der Name muss mindestens 3 Zeichen besitzen" : null)
        }
    });

    const [queues, setQueues] = useState([] as Queue[])

    const onDelete = (queue_id: number) => {

    };

    const onAdd = (name: string) => {

    };

    useEffect(() => {
        fetchQueues(setQueues, props.user.id);
    }, []);

    return (
        <Modal opened={props.isOpen} onClose={props.onClose} size={"lg"} title={"Warteschlangen verwalten"}>
            {queues.map((queue) => (
                <Card shadow="sm" p="lg" radius="md" withBorder key={queue.id}>
                    <Group position="apart">
                        <Text weight={500}>{queue.name}</Text>
                        <ActionIcon onClick={() => {
                            onDelete(queue.id)
                        }}>
                            <IconX size={32}/>
                        </ActionIcon>
                    </Group>
                </Card>
            ))}
            <Group>
                <form onSubmit={form.onSubmit((val) => onAdd(val.name))}>
                    <TextInput placeholder="Neue Warteschlange" {...form.getInputProps("name")}/>
                    <Button type="submit">Hinzufügen</Button>
                </form>
            </Group>
        </Modal>
    );
};