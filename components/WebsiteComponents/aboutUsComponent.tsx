import {Card, Col, Grid, Group, Space, Text} from "@mantine/core";
import { IconUser} from "@tabler/icons-react";

const AboutUsComponent = () => {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{maxWidth: 700, fontSize: 25}}>
            <Text size={30} weight={500}>Über die Gründer von Meddy</Text>
            <Space h={20}/>

            <Group className="m-5">
                <Grid className="text-start">
                    <Col span="content">
                        <IconUser size={80} style={{color: "gray"}}/>
                    </Col>
                    <Col span={"auto"}>
                        <Text weight={700}>Florian Koller</Text>
                        <Text>Informatik Student der Technische Universität München.  ...</Text>
                    </Col>
                </Grid>
                <Grid className="text-start">
                    <Col span="content">
                        <IconUser size={80} style={{color: "gray"}}/>
                    </Col>
                    <Col span={"auto"}>
                        <Text weight={700}>Marius Weigt</Text>
                        <Text>Wirtschaftsinformatik Student der Technischen Universität München. ...</Text>
                    </Col>
                </Grid>
            </Group>
        </Card>
    )



}

export default AboutUsComponent;