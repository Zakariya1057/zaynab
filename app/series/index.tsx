import React, {useEffect} from "react";
import {StyleSheet, FlatList, TouchableOpacity} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router, Stack, useLocalSearchParams} from "expo-router";
import Navigation from "../../components/Navigation/Navigation";
import Series from "../../components/Series/Series";
import CompactAudioPlayer from "../../components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import {Theme} from "../../constants";
import {getPodcastById} from "@/utils/data/getPodcastById";
import TrackPlayer, {State, Track} from "react-native-track-player";
import {Episode} from "@/interfaces/episode";

export default function () {
    const {id} = useLocalSearchParams<{ id: string }>()
    const podcast = getPodcastById(id)

    const play = async () => {
        try {
            await TrackPlayer.setupPlayer();
            await TrackPlayer.reset()
        } catch {
        }

        const track = await TrackPlayer.getActiveTrack()
        if (track) {
            const [ podcastId ] = (track?.description?.split('|') ?? [])
            if (podcastId === podcast.id) {
                TrackPlayer.play()
                return
            }
        }

        const tracks = Object.values(podcast.episodes).map((episode: Episode): Track => {
            return {
                id: episode.id,
                url: episode.url,
                title: `${episode.number}. ${episode.description}`,
                description: `${podcast.id}|${episode.id}`,
                artist: podcast.name
            }
        })

        await TrackPlayer.setQueue(tracks);
        await TrackPlayer.play()
    }

    return (
        <SafeAreaView style={styles.container} edges={[]}>
            <Stack.Screen options={{
                headerShown: false
            }}/>

            <Navigation goBack={() => router.back()}/>

            <Series podcast={podcast} play={play}/>

            <CompactAudioPlayer/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: Theme.colors.white,
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
