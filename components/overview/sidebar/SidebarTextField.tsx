import {Button, Popover, TextInput} from "@mantine/core";
import React, {useState} from "react";
import SidebarButton from "./SidebarButton";

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
                {SidebarButton({
                    icon: props.icon, iconColor: props.iconColor, label: props.label,
                    onClick: () => setPopupOpen(!isPopupOpen)
                })}
            </Popover.Target>
            <Popover.Dropdown sx={(theme) => ({background: theme.white})}>
                <TextInput label={props.editLabel}
                           defaultValue={text}
                           size="sm"
                           onChange={(e) => {
                               setText(e.target.value)
                           }}/>
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