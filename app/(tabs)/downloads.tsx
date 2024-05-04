import {YStack, Text} from 'tamagui'
import DownloadsList from "@/components/Download/DownloadList";
import CompactAudioPlayer from "@/components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import React from "react";
import {useRestartDownloadsOnBoot} from "@/hooks/useRestartDownloadOnBoot";

export default function () {
    return (
        <YStack f={1}>
            <DownloadsList></DownloadsList>
            <CompactAudioPlayer />
        </YStack>
    );
}
