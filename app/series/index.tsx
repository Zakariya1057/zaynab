import React, {useEffect, useState} from "react";
import {Platform} from "react-native";
import {router, Stack, useFocusEffect, useLocalSearchParams} from "expo-router";
import Navigation from "../../components/Navigation/Navigation";
import Series from "../../components/Series/Series";
import CompactAudioPlayer from "../../components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import {getPodcastById} from "@/utils/data/getPodcastById";
import {useActiveTrack} from "react-native-track-player";
import {SafeAreaView} from "react-native-safe-area-context";
import {setupPlayer} from "@/utils/track/setup-player";
import {useDownloadPodcastEpisodes} from "@/hooks/useDownloadPodcastEpisodes";
import {DownloadStatus} from "@/interfaces/download-status";
import {getDownloadsByPodcastId} from "@/utils/database/download/get-downloads-by-podcast-id";
import {setPodcastTracks} from "@/utils/track/set-podcast-tracks";

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
