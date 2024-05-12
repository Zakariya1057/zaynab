import {Slot, Stack} from "expo-router";
import React from "react";
import {useActiveTrack} from "react-native-track-player";
import EpisodeDownload from "@/components/Episode/EpisodeDownload";
import useDownloadEpisode from "@/hooks/useDownloadEpisode";

export default function () {
    const track = useActiveTrack()
    const [_, episodeId] = track?.description?.split('|') ?? []

    const downloadEpisode = useDownloadEpisode();

    return (
        <>
            <Stack.Screen options={{
                headerRight: () => <EpisodeDownload episodeId={episodeId}  download={() => downloadEpisode()} />
            }}/>
            <Slot />
        </>
    )
}