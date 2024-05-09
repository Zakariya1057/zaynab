import React, {useEffect} from "react";
import FullScreenAudioPlayer from "../../components/Media/AudioPlayer/FullScreenAudioPlayer/FullScreenAudioPlayer";
import {getPodcastById} from "@/utils/data/getPodcastById";
import {getEpisodeById} from "@/utils/data/getEpisodeById";
import TrackPlayer from "react-native-track-player";
import {setupPlayer} from "@/utils/track/setup-player";
import {getEpisodeDownloadsById} from "@/utils/download/get-episodes-with-download-ids";
import {updateExistingTracks} from "@/utils/track/update-existing-tracks";
import {setupNewQueue} from "@/utils/track/setup-new-queue";
import {useTheme} from "tamagui";
import {Download} from "@tamagui/lucide-icons";
import { Stack } from 'expo-router'

export default function ({podcastId, episodeId}: { podcastId: string, episodeId: string }) {
    const podcast = getPodcastById(podcastId)
    const episode = getEpisodeById(podcast, episodeId)

    const description = [podcastId, episodeId].join('|')

    useEffect(() => {
        async function setup() {
            await setupPlayer();

            const activeTrack = await TrackPlayer.getActiveTrack()

            if (activeTrack && activeTrack.description === description) {
                return
            }

            const downloadsById = await getEpisodeDownloadsById(podcastId);

            const episode = podcast.episodes[episodeId];

            const existingTracks = await TrackPlayer.getQueue();

            if (await updateExistingTracks(existingTracks, episodeId)) {
                return;
            }

            await setupNewQueue(podcast, episode, downloadsById);

            await TrackPlayer.pause()

        }

        setup();
    }, []);

    const theme = useTheme()
    const color = theme.color.get()

    return (
        <>
            <Stack.Screen options={{ headerShown: true, headerRight: () => <Download size={35} color={'white'} strokeWidth={1.7}/>  }}/>
            <FullScreenAudioPlayer podcast={podcast} episode={episode}/>
        </>
    )
}