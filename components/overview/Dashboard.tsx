import React, {useContext, useEffect, useState} from "react";
import QueueViewer from "./QueueViewer";
import {StoreContext} from "../../lib/store";
import {Container, Flex, Group, Space, Title} from "@mantine/core";
import CheckinPopup from "../CheckinPopup";

const Dashboard = () => {
    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Berlin'
        });
    }

    const [time, setTime] = useState(getCurrentTime());
    const {organisation} = useContext(StoreContext);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(getCurrentTime());
        }, 30000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    // TODO: connect "Verwaltungsrechner" to database
    return (
        <Container className="h-screen" fluid>
            <Group position="apart">
                <Flex direction="column">
                    {/* TODO: Integrate color into mantine theme and use theme color */}
                    <Title order={4} color="#0099ff">{organisation.name}</Title>
                    <Title order={4} color="#0099ff">Verwaltungsrechner</Title>
                </Flex>
                <Flex>
                    <Title order={4} color="#0099ff">{time} Uhr</Title>
                </Flex>
            </Group>
            <Space h={20}/>
            <Container fluid>
                <QueueViewer/>
            </Container>
            <Space h={40}/>
            <Container>
                <CheckinPopup/>
            </Container>
        </Container>
    );
}

export default Dashboard;

