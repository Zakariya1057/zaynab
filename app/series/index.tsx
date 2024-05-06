import React, {useEffect, useState} from "react";
import {Platform} from "react-native";
import {router, Stack, useFocusEffect, useLocalSearchParams} from "expo-router";
import Navigation from "../../components/Navigation/Navigation";
import Series from "../../components/Series/Series";
import CompactAudioPlayer from "../../components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import {getPodcastById} from "@/utils/data/getPodcastById";
import TrackPlayer, {State, useActiveTrack} from "react-native-track-player";
import {SafeAreaView} from "react-native-safe-area-context";
import {setupPlayer} from "@/utils/track/setup-player";
import {playingCurrentPodcast} from "@/utils/track/playing-current-podcast";
import {getTracksWithDownloads} from "@/utils/track/get-tracks-with-downloads";
import {useDownloadPodcastEpisodes} from "@/hooks/useDownloadPodcastEpisodes";
import {fetchShuffleStatus} from "@/utils/shuffle/fetch-shuffle-status";
import {shuffleArray} from "@/utils/shuffle/shuffle-array";
import {fetchLastListenedEpisodeByPodcastId} from "@/utils/database/episode/fetch-last-listened-episode-by-podcast-id";
import {checkAndShowDownloadMessage} from "@/utils/notify/check-and-show-download-message";
import {DownloadStatus} from "@/interfaces/download-status";
import {getDownloadsByPodcastId} from "@/utils/database/download/get-downloads-by-podcast-id";
import {setPodcastTracks} from "@/utils/track/set-podcast-tracks";
import {prefetchPodcastTracks} from "@/utils/track/prefetch-podcast-tracks";

export default function () {
    const {id, play: playAudio} = useLocalSearchParams<{ id: string, play?: string }>()
    const podcast = getPodcastById(id)
    const episodes = Object.values(podcast.episodes)

    const track = useActiveTrack()

    const downloadEpisodes = useDownloadPodcastEpisodes();

    const [downloadStatus, setDownloadStatus] = useState<DownloadStatus|undefined>(DownloadStatus.WaitingToDownload)

    const play = async () => {
        await setupPlayer();
        await setPodcastTracks(id)
    }

    const updateDownloadIcon = async () => {
        const downloads = await getDownloadsByPodcastId(podcast.id)
        if (downloads.length === episodes.length) {
            setDownloadStatus(DownloadStatus.CompletedDownload)
        } else if (downloads.length > 0) {
            setDownloadStatus(DownloadStatus.InProgress)
        } else {
            setDownloadStatus(DownloadStatus.WaitingToDownload)
        }
    }

    const download = async () => {
        await downloadEpisodes(podcast)
    }

    useFocusEffect(() => {
        updateDownloadIcon()
    });

    useEffect(() => {
        checkAndShowDownloadMessage()
        updateDownloadIcon()

        if (playAudio) {
            play()
        }
    }, []);

    return (
        <SafeAreaView style={{flex: 1}} edges={[]}>
            <Stack.Screen options={{
                headerShown: false
            }}/>

            <Navigation goBack={() => router.back()} download={download} downloadStatus={downloadStatus}/>

            <Series podcast={podcast} play={play} playingEpisodeId={track?.id}/>

            <CompactAudioPlayer edges={Platform.OS === 'android' ? [] : ['bottom']}/>
        </SafeAreaView>
    );
};
