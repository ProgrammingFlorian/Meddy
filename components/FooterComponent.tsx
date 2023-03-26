import {Text} from "@mantine/core";
import {useTranslation} from "next-i18next";

const FooterComponent = () => {
    const {t} = useTranslation();

    return (
        <footer className="relative h-24 w-full items-center justify-center border-t">
            <Text className="mt-5 mb-2" variant="gradient"
                  gradient={{from: 'indigo', to: 'cyan', deg: 45}}
                  sx={{fontFamily: 'Greycliff CF, sans-serif'}}
                  ta="center" fw={700}>{t('appName')}</Text>
            <Text align="center">
                Webseite erstellt von{' '}
                <span className="font-bold">
                Florian Koller & Marius Weigt
            </span>
            </Text>
        </footer>
    );
};

export default FooterComponent;