import {Grid, Text, Center} from "@mantine/core";
import MeddyTextComponent from "./WebsiteComponents/meddyTextComponent";
import {router} from "next/client";

const FooterComponent = () => (
    <footer className="relative h-24 w-full items-center justify-center border-t p-5">
        <MeddyTextComponent/>
        <Center>
            <Grid className="underline">
                <Grid.Col span={"auto"}>
                    <a href="https://meddy.me/">Home</a>
                </Grid.Col>
                <Grid.Col span={"auto"}>
                    <a href="https://meddy.me/imprint">Impressum</a>
                </Grid.Col>
                <Grid.Col span={"auto"}>
                    <a href="https://meddy.me/privacy">Datenschutz</a>
                </Grid.Col>
                <Grid.Col span={"auto"}>
                    <a href="mailto:info@meddy.me">Kontakt</a>
                </Grid.Col>
            </Grid>
        </Center>
    </footer>
);

export default FooterComponent;