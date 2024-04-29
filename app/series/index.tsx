import React, {useEffect, useState} from "react";
import {Platform, StyleSheet} from "react-native";
import {router, Stack, useLocalSearchParams} from "expo-router";
import Navigation from "../../components/Navigation/Navigation";
import Series from "../../components/Series/Series";
import CompactAudioPlayer from "../../components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import {Theme} from "../../constants";
import {getPodcastById} from "@/utils/data/getPodcastById";
import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Capability,
    State,
    Track,
    useActiveTrack,
    usePlaybackState,
    useProgress
} from "react-native-track-player";
import {Episode} from "@/interfaces/episode";
import useDownloadManager2 from "@/hooks/useDownloadManager2";
import Toast from "react-native-toast-message";
import {getDownloadsByPodcastId} from "@/utils/database/download/get-downloads-by-podcast-id";
import {SafeAreaView} from "react-native-safe-area-context";

export default function () {
    const {id, play: playAudio} = useLocalSearchParams<{ id: string, play?: string }>()
    const podcast = getPodcastById(id)

    const track = useActiveTrack()

    const {downloadAudios} = useDownloadManager2()

    const play = async () => {
        try {
            await TrackPlayer.setupPlayer();
            await TrackPlayer.reset()
            await TrackPlayer.updateOptions({
                    // Media controls capabilities
                    capabilities: [
                        Capability.Play,
                        Capability.Pause,
                        Capability.SkipToNext,
                        Capability.SkipToPrevious,
                        Capability.Stop,
                    ],
                    android: {
                        // This is the default behavior
                        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification
                    },
                    // Capabilities that will show up when the notification.click is in the compact form on Android
                    compactCapabilities: [Capability.Play, Capability.Pause],
                }
            )
        } catch {
        }

        const track = await TrackPlayer.getActiveTrack()
        if (track) {
            const [podcastId] = (track?.description?.split('|') ?? [])
            if (podcastId === podcast.id) {
                TrackPlayer.play()
                return
            }
        }

        const downloads = await getDownloadsByPodcastId(podcast.id)
        const downloadsById: Record<string, string> = downloads.reduce((acc: Record<string, string>, download) => {
            console.log(download)
            acc[download.episodeId] = download.uri;
            return acc;
        }, {});

        const tracks = Object.values(podcast.episodes).map((episode: Episode): Track => {
            return {
                id: episode.id,
                url: downloadsById[episode.id] || episode.url,
                title: `${episode.number}. ${episode.description}`,
                description: `${podcast.id}|${episode.id}`,
                artist: podcast.name,
                artwork: 'https://drive.usercontent.google.com/uc?id=1O3c70KmqV9znxyU-pZuSB84E9rvMu9Mf&export=download',
            }
        })

        console.log(tracks.map((track) => track.url))

        await TrackPlayer.setQueue(tracks);
        await TrackPlayer.play()
    }

    const download = async () => {
        const episodes = Object.values(podcast.episodes)

        Toast.show({
            type: 'info', // Appropriate for informational messages
            text1: 'Downloading Episodes', // A clear, concise title for the action
            text2: 'Attempting to download all episodes in this series.', // More specific details about the action
            position: 'bottom', // Position at the bottom so it does not block other UI elements
            visibilityTime: 4000, // Duration in milliseconds the toast should be visible
            autoHide: true, // The toast will disappear after the visibilityTime
            bottomOffset: 40, // Spacing from the bottom, adjusted for visibility
        });

        await downloadAudios(
            episodes.map((episode) => ({
                    url: episode.url,
                    episodeId: episode.id,
                    podcastId: podcast.id,
                })
            )
        )
    }

    useEffect(() => {
        if (playAudio) {
            play()
        }
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={[]}>
            <Stack.Screen options={{
                headerShown: false
            }}/>

            <Navigation goBack={() => router.back()} download={download}/>

            <Series podcast={podcast} play={play} playingEpisodeId={track?.id}/>

            <CompactAudioPlayer edges={Platform.OS === 'android' ? [] : ['bottom']}/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
    },
    heading: {
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: Theme.spacing.large,
        paddingBottom: 20,
        rowGap: 20,
        bottom: 0,
        top: 0,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageCover: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    playButton: {
        backgroundColor: 'rgba(255,255,255,0.92)',
        alignSelf: 'center',
        width: '60%',
        borderRadius: 10,
        paddingHorizontal: 25,
        paddingVertical: 9,
    },
    playButtonText: {
        color: Theme.colors.vividPurple,
        fontWeight: '500'
    },
    title: {
        marginTop: 20,
        color: Theme.colors.white,
        textAlign: 'center',
        fontSize: 30,
        // fontFamily: Theme.fonts.Nunito.SemiBold,
    },
    description: {
        color: Theme.colors.white,
        fontSize: 16,
        // fontFamily: Theme.fonts.Nunito.Regular,
        paddingTop: Theme.spacing.small,
    },
    episodesTitleContainer: {
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.platinumGrey,
        paddingVertical: Theme.spacing.small,
        paddingHorizontal: Theme.spacing.large,
    },
    episodesTitle: {
        alignSelf: 'flex-start',
        color: Theme.colors.black,
        fontSize: 20,
        // fontFamily: Theme.fonts.Nunito.Bold,
    },
    episodesList: {
        width: '100%',
    },
    episodeItem: {
        borderBottomWidth: 1,
        paddingHorizontal: Theme.spacing.large,
        paddingVertical: Theme.spacing.normal,
        borderBottomColor: Theme.colors.platinumGrey,
    },
    episodeTitle: {
        fontSize: 17,
        // fontFamily: Theme.fonts.Nunito.SemiBold,
    },
    episodeDescription: {
        fontSize: 14,
        // fontFamily: Theme.fonts.Nunito.Regular,
        color: Theme.colors.charcoal, // Adjust this color as needed
    },
});
