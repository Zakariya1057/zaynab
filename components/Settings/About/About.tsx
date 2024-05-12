import SettingsSection from "@/components/Settings/Section";
import { Text } from "tamagui";
import React from "react";
import * as Application from 'expo-application';

export default function About() {
    const appVersion = Application.nativeApplicationVersion || 'N/A';

    return (
        <SettingsSection title="About">
            <Text fontSize="$5">App Version: {appVersion}</Text>
            <Text fontSize="$5">Developed by: Zakariya Mohummed</Text>
        </SettingsSection>
    );
}
