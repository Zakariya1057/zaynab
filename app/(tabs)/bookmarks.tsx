import {View, YStack} from 'tamagui'
import DownloadsList from "@/components/Download/DownloadList";
import CompactAudioPlayer from "@/components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import React from "react";

export default function () {
    return (
        <YStack f={1}>
            <View f={1}>
            </View>
            <CompactAudioPlayer edges={[]} />
        </YStack>
    );
}
