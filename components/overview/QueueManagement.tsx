import {ActionIcon, Button, Card, Group, Modal, Text, TextInput} from "@mantine/core";
import {IconX} from "@tabler/icons-react";
import {useForm} from "@mantine/form";
import {Queue} from "../../models/Queue";
import {StoreContext} from "../../lib/Store";
import React, {useContext, useState} from "react";


interface QueueManagementProps {
    isOpen: boolean,
    onClose: () => void
}

export const QueueManagement = (props: QueueManagementProps) => {
    const form = useForm({
        initialValues: {name: ""},
        validate: {
            name: (value) => (value.length < 3 ? "Der Name muss mindestens 3 Zeichen besitzen" : null)
        }
    });
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleDeleteQueue = (queue: Queue) => {
        deleteQueue(queue.id);
        setShowConfirmation(false);
    };

    const {queues, createQueue, deleteQueue} = useContext(StoreContext);

    return (
        <Modal opened={props.isOpen} onClose={props.onClose} size={"sm"} title={"Warteschlangen verwalten"}>
            {queues.sort((q1, q2) => q1.name.localeCompare(q2.name)).map((queue) => (
                <Card className="mt-1" p="xs" radius="sm" withBorder key={queue.id}>
                    <Group position="apart">
                        <Text style={{ userSelect: "none" }} weight={500}>{queue.name}</Text>
                        <ActionIcon onClick={() => setShowConfirmation(true)}>
                            <IconX size={32}/>
                        </ActionIcon>
                        <Modal
                            title="Löschen bestätigen"
                            opened={showConfirmation}
                            onClose={() => setShowConfirmation(false)}>
                            <Text>Soll {queue.name} mit allen Kundendaten gelöscht werden? Diese Aktion kann nicht Rückgängig gemacht werden</Text>
                            <Group className="pt-4" position="center">
                                <Button color="green" onClick={() => handleDeleteQueue(queue)}>Bestätigen</Button>
                                <Button color="red" onClick={() => setShowConfirmation(false)}>Abbrechen</Button>
                            </Group>
                        </Modal>
                    </Group>
                </Card>
            ))}
            <Group>
                <form onSubmit={form.onSubmit((val) => createQueue(val.name))}>
                    <div className="flex-row flex gap-2 mt-3">
                        <TextInput
                            style={{width: 220}}
                            placeholder="Neue Warteschlange"
                            {...form.getInputProps("name")}
                        />
                        <Button type="submit">Hinzufügen</Button>
                    </div>
                </form>
            </Group>
        </Modal>
    );
};