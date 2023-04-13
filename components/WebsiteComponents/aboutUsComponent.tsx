import {Button, Card, Col, Grid, Group, Image, Space, Text} from "@mantine/core";

const AboutUsComponent = () => {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{fontSize: 25}}>
            <Text size={30} weight={500}>Über die Gründer von Meddy</Text>
            <Space h={20}/>

            <Group className="m-5">

                <Grid className="text-start">
                    <Col span="content">
                        <Image height={80} width={80} radius={40} src="./images/florian.jpeg"/>
                    </Col>
                    <Col span={"auto"}>
                        <Grid justify={"space-evenly"}>
                            <Grid.Col span={12} lg={8}>
                                <Text weight={700}>Florian Koller</Text>
                                <Text color="dimmed">florian.koller@meddy.me</Text>
                            </Grid.Col>
                            <Grid.Col span={12} lg={4} style={{display: 'flex', alignItems: 'center'}}>
                                <Button size={"lg"} onClick={() => window.open( "https://de.linkedin.com/in/florian-koller-837902243", '_blank')}>LinkedIn</Button>
                            </Grid.Col>
                        </Grid>
                        <Text className="pt-4">Informatik Student der Technische Universität München.</Text>
                    </Col>
                </Grid>
                <Grid className="text-start">
                    <Col span="content">
                        <Image height={80} width={80} radius={40} src="./images/marius.jpeg"/>
                    </Col>
                    <Col span={"auto"}>
                        <Grid justify={"space-evenly"}>
                            <Grid.Col span={12} xl={8}>
                                <Text weight={700}>Marius Weigt</Text>
                                <Text color="dimmed">marius.weigt@meddy.me</Text>
                            </Grid.Col>
                            <Grid.Col span={12} xl={4} style={{display: 'flex', alignItems: 'center'}}>
                                <Button size={"lg"} onClick={() => window.open( "https://de.linkedin.com/in/marius-weigt-919a4b213", '_blank')}>LinkedIn</Button>
                            </Grid.Col>
                        </Grid>
                        <Text className="pt-4">Wirtschaftsinformatik Student der Technischen Universität München.</Text>
                    </Col>
                </Grid>
            </Group>
        </Card>
    )



}

export default AboutUsComponent;