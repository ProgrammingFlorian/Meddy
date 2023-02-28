import {ActionIcon, Button, Card, Group, Modal, Text, TextInput} from "@mantine/core";
import {IconX} from "@tabler/icons-react";
import {useForm} from "@mantine/form";
import {User} from "@supabase/auth-helpers-react";
import {useStore} from "../lib/store";



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

    const {queues, createQueue, deleteQueue} = useStore();

    return (
        <Modal opened={props.isOpen} onClose={props.onClose} size={"sm"} title={"Warteschlangen verwalten"}>
            {queues.map((queue) => (
                <Card className="mt-1" p="sm" radius="md" withBorder key={queue.id}>
                    <Group position="apart">
                        <Text weight={500}>{queue.name}</Text>
                        <ActionIcon onClick={() => {
                            deleteQueue(queue.id);
                        }}>
                            <IconX size={32}/>
                        </ActionIcon>
                    </Group>
                </Card>
            ))}
            <Group>
                <form onSubmit={form.onSubmit((val) => createQueue(val.name))}>
                    <div className="flex-row flex gap-2 mt-1">
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