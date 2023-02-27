import React, {useState} from 'react';
import {Button, Popover, Select, TextInput, CloseButton} from "@mantine/core";
import {Language} from "../models/Language";


interface SideBarComponentProps {
    nameOfClient: string,
    setNameOfClient: (newName: string) => void,
    nameOfComputer: string,
    setNameOfComputer: (newName: string) => void,
    language: Language,
    setLanguage: (lan: Language) => void;
}


const SideBarComponent = (props: SideBarComponentProps) => {
    const [newNameOfComputer, setNewNameOfComputer] = useState(props.nameOfComputer);
    const [newNameOfClient, setNewNameOfClient] = useState(props.nameOfClient);

    const [openedComputerName, setOpenedComputerName] = useState(false);
    const [openedClientName, setOpenedClientName] = useState(false);
    const [openedSignOut, setOpenedSignOut] = useState(false);

    const closeAllPopovers = () => {
        setOpenedSignOut(false);
        setOpenedComputerName(false);
        setOpenedClientName(false);
    }
    return (
        <div>
            <div className="h-12 bg-blue"></div>
            <nav className="flex-1 flex flex-col text-gray-500  text-center font-bold bg-white"
                 style={{position: "relative"}}>

                {/*change client name button*/}
                <Popover width={300}
                         trapFocus
                         position="bottom"
                         withArrow
                         opened={openedClientName}
                         shadow="md">
                    <Popover.Target>
                        <Button className="m-2 mt-4"
                                onClick={() => {
                                    closeAllPopovers();
                                    setOpenedClientName(!openedClientName)}}
                                color="gray">
                            Praxisname ändern
                        </Button>
                    </Popover.Target>
                    <Popover.Dropdown sx={(theme) => ({background: theme.white})}>
                        <TextInput label="Praxisname"
                                   defaultValue={props.nameOfClient}
                                   size="sm"
                                   onChange={(e) => setNewNameOfClient(e.target.value)}/>
                        <div className="grid grid-cols-2 gap-1 pt-1 place-items-stretch">
                            <Button color="green"
                                    onClick={() => {
                                        props.setNameOfClient(newNameOfClient)
                                        setOpenedClientName(false)
                                    }}>
                                Ändern
                            </Button>
                            <Button color="red"
                                    onClick={() => setOpenedClientName(false)}>
                                Abbrechen
                            </Button>
                        </div>
                    </Popover.Dropdown>
                </Popover>

                {/*change computer name button*/}
                <Popover width={300}
                         trapFocus
                         position="bottom"
                         withArrow
                         opened={openedComputerName}
                         shadow="md">
                    <Popover.Target>
                        <Button className="m-2"
                                color="gray"
                                onClick={() => {
                                    closeAllPopovers();
                                    setOpenedComputerName(!openedComputerName)}}>
                            Computername ändern
                        </Button>
                    </Popover.Target>
                    <Popover.Dropdown sx={(theme) => ({background: theme.white})}>
                        <TextInput
                            label="Name"
                            defaultValue={props.nameOfComputer}
                            size="sm"
                            onChange={(e) => setNewNameOfComputer(e.target.value)}/>
                        <div className="grid grid-cols-2 gap-1 pt-1 place-items-stretch">
                            <Button color="green"
                                    onClick={() => {
                                        props.setNameOfComputer(newNameOfComputer)
                                        setOpenedComputerName(false)
                                    }}>
                                Ändern
                            </Button>
                            <Button color="red"
                                    onClick={() => setOpenedComputerName(false)}>
                                Abbrechen
                            </Button>
                        </div>
                    </Popover.Dropdown>
                </Popover>



                {/*Change language selection */}
                <Select
                    className="m-2 text-center"
                    data={['English', 'Deutsch']}
                    defaultValue={Language.GERMAN == props.language ? "Deutsch" : "English"}
                    variant="filled"
                    onClick={() => closeAllPopovers()}
                    onChange={(selectedLanguage) => {
                        const newLanguage = selectedLanguage === 'Deutsch' ? Language.GERMAN : Language.ENGLISH;
                        props.setLanguage(newLanguage);
                    }}
                    styles={() => ({
                        input: {
                            background: "#878e95",
                            color: "white",
                            textAlign: "center"
                        }
                    })}
                />

                {/*Sign out button*/}
                <Popover width={300}
                         trapFocus
                         position="bottom"
                         withArrow
                         opened={openedSignOut}
                         shadow="md">
                    <Popover.Target>
                        <Button className="m-2"
                                color="gray"
                                onClick={()=> {
                                    closeAllPopovers();
                                    setOpenedSignOut(!openedSignOut)}}>
                            Sign Out
                        </Button>
                    </Popover.Target>
                    <Popover.Dropdown sx={(theme) => ({background: theme.white})}>
                        <div className="grid grid-cols-2 gap-1 pt-1 place-items-stretch">
                            <Button
                                onClick={() => {
                                    setOpenedSignOut(false);
                                    window.location.href = "loginPage";
                                }}
                                color="green">
                                Ok
                            </Button>
                            <Button color="red"
                                    onClick={()=> setOpenedSignOut(false)}>
                                Abbrechen
                            </Button>
                        </div>
                    </Popover.Dropdown>
                </Popover>
            </nav>
        </div>
    )

}

export default SideBarComponent;

