import {Button, Group, Popover, Text, TextInput, ThemeIcon, UnstyledButton} from "@mantine/core";
import React, {useState} from "react";

interface SidebarButtonProps {
    icon: JSX.Element;
    iconColor: string;
    initialText: string;
    label: string;
    editLabel: string;
    onConfirm: (text: string) => void;
}

export const SidebarTextField = (props: SidebarButtonProps) => {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [text, setText] = useState(props.initialText);

    return (
        <Popover trapFocus
                 position="bottom"
                 withArrow
                 opened={isPopupOpen}
                 onClose={() => setPopupOpen(false)}
                 shadow="md">
            <Popover.Target>
                <UnstyledButton
                    sx={(theme) => ({
                        display: 'block',
                        width: '100%',
                        padding: theme.spacing.xs,
                        borderRadius: theme.radius.sm,
                        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                        '&:hover': {
                            backgroundColor:
                                theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                        },
                    })}
                    onClick={() => setPopupOpen(!isPopupOpen)}
                >
                    <Group>
                        <ThemeIcon color={props.iconColor} variant="light">{props.icon}</ThemeIcon>
                        <Text size="sm">{props.label}</Text>
                    </Group>
                </UnstyledButton>
            </Popover.Target>
            <Popover.Dropdown sx={(theme) => ({background: theme.white})}>
                <TextInput label={props.editLabel}
                           defaultValue={text}
                           size="sm"
                           onChange={(e) => {setText(e.target.value)}}/>
                <div className="grid grid-cols-2 gap-1 pt-1 place-items-stretch">
                    <Button color="green" onClick={() => {
                        props.onConfirm(text);
                        setPopupOpen(false);
                    }}>
                        Ändern
                    </Button>
                    <Button color="red" onClick={() => setPopupOpen(false)}>
                        Abbrechen
                    </Button>
                </div>
            </Popover.Dropdown>
        </Popover>
    );
};