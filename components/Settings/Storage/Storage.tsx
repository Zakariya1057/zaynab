import SettingsSection from "@/components/Settings/Section";
import SettingsInfo from "@/components/Settings/Info/Info";
import {Button} from "tamagui";
import React, {useState} from "react";

export default function () {
    const [totalDownloadsSize, setTotalDownloadsSize] = useState('0 MB');

    const clearDownloads = () => {
        // Replace with actual logic to clear all downloads
        console.log('Downloads cleared');
        setTotalDownloadsSize('0 MB');
    };

    return (
        <SettingsSection title="Storage">
            <SettingsInfo label="Total Downloads Size" value={totalDownloadsSize}/>
            <Button onPress={clearDownloads} fontSize={'$4'}>Delete Downloads</Button>
        </SettingsSection>
    )
}