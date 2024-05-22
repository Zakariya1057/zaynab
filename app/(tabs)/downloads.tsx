import {YStack} from 'tamagui'
import DownloadsList from "@/components/Download/DownloadList";
import CompactAudioPlayer from "@/components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import React from "react";

export default function () {
    return (
        <YStack f={1}>
            <DownloadsList></DownloadsList>
            <CompactAudioPlayer />
        </YStack>
    );
}
