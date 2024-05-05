import React, {useEffect} from "react";
import {Platform} from "react-native";
import {router, Stack, useLocalSearchParams} from "expo-router";
import Navigation from "../../components/Navigation/Navigation";
import Series from "../../components/Series/Series";
import CompactAudioPlayer from "../../components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import {getPodcastById} from "@/utils/data/getPodcastById";
import TrackPlayer, {State, Track, useActiveTrack} from "react-native-track-player";
import {SafeAreaView} from "react-native-safe-area-context";
import {setupPlayer} from "@/utils/track/setup-player";
import {playingCurrentPodcast} from "@/utils/track/playing-current-podcast";
import {getTracksWithDownloads} from "@/utils/track/get-tracks-with-downloads";
import {useDownloadPodcastEpisodes} from "@/hooks/useDownloadPodcastEpisodes";
import {fetchShuffleStatus} from "@/utils/shuffle/fetch-shuffle-status";
import {shuffleArray} from "@/utils/shuffle/shuffle-array";
import {fetchLastListenedEpisodeByPodcastId} from "@/utils/database/episode/fetch-last-listened-episode-by-podcast-id";
import {generateTrackFromEpisode} from "@/utils/track/generate-track-from-episode";
import {getEpisodeNumberFromTitle} from "@/utils/episode/get-episode-number-from-title";

export default function () {
    const {id, play: playAudio} = useLocalSearchParams<{ id: string, play?: string }>()
    const podcast = getPodcastById(id)

    const track = useActiveTrack()

    const downloadEpisodes = useDownloadPodcastEpisodes();

    const play = async () => {
        await setupPlayer();
        const {state} = await TrackPlayer.getPlaybackState();
        const playingPodcast = await playingCurrentPodcast(podcast.id);

        if (playingPodcast) {
            if (state !== State.Playing) {
                await TrackPlayer.play();
            }
            return;
        }

        const tracks = await getTracksWithDownloads(podcast);
        const lastEpisode = await fetchLastListenedEpisodeByPodcastId(podcast.id);

        const shuffleOn = await fetchShuffleStatus();
        if (shuffleOn) {
            shuffleArray(tracks);
        }
        await TrackPlayer.setQueue(tracks);

        if (lastEpisode) {
            await TrackPlayer.skip(lastEpisode.number-1)
        }

        await TrackPlayer.play();
    }

    const download = async () => {
        await downloadEpisodes(podcast)
    }

    useEffect(() => {
        if (playAudio) {
            play()
        }
    }, []);

    return (
        <SafeAreaView style={{flex: 1}} edges={[]}>
            <Stack.Screen options={{
                headerShown: false
            }}/>

            <Navigation goBack={() => router.back()} download={download}/>

            <Series podcast={podcast} play={play} playingEpisodeId={track?.id}/>

            <CompactAudioPlayer edges={Platform.OS === 'android' ? [] : ['bottom']}/>
        </SafeAreaView>
    );
};
