import {Slot, Stack} from "expo-router";
import React from "react";
import {useActiveTrack} from "react-native-track-player";
import EpisodeDownload from "@/components/Episode/EpisodeDownload";
import useDownloadEpisode from "@/hooks/useDownloadEpisode";
import {getAllowDownload} from "@/utils/cache/download-status-cache";

export default function () {
    const track = useActiveTrack()
    const [_, episodeId] = track?.description?.split('|') ?? []

    const downloadEpisode = useDownloadEpisode();

    const allowDownload = getAllowDownload()

    return (
        <>
            <Stack.Screen options={{
                headerRight: () => allowDownload ? <EpisodeDownload episodeId={episodeId}  download={() => downloadEpisode()} /> : <></>
            }}/>
            <Slot />
        </>
    )
}