import React, {useCallback, useEffect, useState} from 'react';
import {H4, Image, Paragraph, YStack, View, Button,ScrollView } from 'tamagui';
import TrackPlayer, {
    Event,
    State, useActiveTrack,
    usePlaybackState,
    useProgress,
    useTrackPlayerEvents
} from 'react-native-track-player';
import MediaPlayerControls from '../../MediaPlayerControls/MediaPlayerControls';
import MediaProgressSlider from '../../MediaPlayerControls/MediaProgressSlider';
import MediaImage from '../../MediaPlayerControls/MediaImage';
import {Theme} from "../../../../constants";
import {Podcast} from "@/interfaces/podcast";
import {Episode} from "@/interfaces/episode";
import Toast from "react-native-toast-message";
import {RefreshControl} from "react-native";
import useDownloadManager2 from "@/hooks/useDownloadManager2";
import {getDownloadById} from "@/utils/database/download/get-download-by-id";

export default function EpisodePlayer({podcast, episode }: { podcast: Podcast, episode: Episode }) {
    const track = useActiveTrack()
    const { state } = usePlaybackState()

    const { downloadAudio } = useDownloadManager2()

    const {position, duration} = useProgress(1000); // Updates every 1000 ms
    const [loading, setLoading] = useState(false)
    const [buffering, setBuffering] = useState<boolean>(false);
    const [audioLoaded, setAudioLoaded] = useState(state === State.Playing);
    const [refreshing, setRefreshing] = useState(false);
    const [audioFailedToLoad, setAudioFailedToLoad] = useState(false);

    const episodes = Object.values(podcast.episodes)
    const firstEpisode = episodes.at(0)
    const lastEpisode = episodes.at(-1)

    const timerRef = React.useRef(0)

    React.useEffect(() => {
        return () => clearTimeout(timerRef.current)
    }, [])

    useTrackPlayerEvents([Event.PlaybackState], (event) => {
        console.log(event)

        if ('error' in event) {
            setAudioFailedToLoad(true)
            showToast()
        } else {
            setAudioFailedToLoad(false)
        }

        // Handle the loading state directly
        setLoading(event.state === State.Loading);

        // Handle the playing and buffering states
        if (event.state === State.Buffering) {
            setBuffering(true);
        } else {
            setBuffering(false);
        }

        // Simplify ready state handling
        if (event.state === State.Ready) {
            setAudioLoaded(true)
            setLoading(false);
        }
    });

    const togglePlayPause = async () => {
        if (Math.ceil(position) === Math.ceil(duration)) {
            await TrackPlayer.seekTo(0)
        }

        if (state !== State.Playing) {
            TrackPlayer.play();
        } else {
            TrackPlayer.pause();
        }
    };

    const playNext = async () => {
        setAudioLoaded(false)

        if (audioFailedToLoad) {
            const currentPosition = await TrackPlayer.getActiveTrackIndex()
            await replaceFailedTrack(currentPosition ?? 0)
        } else {
            await TrackPlayer.skipToNext()
        }
    }

    const replaceFailedTrack = async (newTrackPosition: number) => {
        // Remove the current track from the queue and play next one
        const tracks = await TrackPlayer.getQueue()
        const activeTrack = await TrackPlayer.getActiveTrack()
        const newTracks = tracks.filter( (track) => track.id !== activeTrack?.id )
        await TrackPlayer.setQueue(newTracks)
        await TrackPlayer.skip(newTrackPosition)
        await TrackPlayer.play()
    }

    const playPrev = async () => {
        setAudioLoaded(false)

        if (audioFailedToLoad) {
            const currentPosition = await TrackPlayer.getActiveTrackIndex()
            let newPosition = currentPosition ? currentPosition - 1 : 0
            await replaceFailedTrack(newPosition)
        } else {
            await TrackPlayer.skipToPrevious()
        }
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await replaceTrack()
        } catch (error) {
            console.error('Error during refresh:', error);
        }
        setRefreshing(false);
    }, []);


    const showToast = () => {
        Toast.show({
            type: 'error', // Indicates that this toast is for an error message
            text1: 'Audio Load Failed', // A clear, concise title for the error
            text2: 'Pull down page to refresh and try again.', // Specific instructions for the user
            position: 'bottom', // Position at the bottom so it does not block other UI elements
            visibilityTime: 4000, // Duration in milliseconds the toast should be visible
            autoHide: true, // The toast will disappear after the visibilityTime
            topOffset: 30, // Spacing from the top, when position is 'top'
            bottomOffset: 40, // Spacing from the bottom, useful when position is 'bottom'
        });
    }

    const replaceTrack = async () => {
        const { duration: audioDuration } = await TrackPlayer.getProgress()

        if (audioLoaded || audioDuration > 0){
            return
        }

        setAudioLoaded(false)
        await TrackPlayer.load({
            id: episode.id,
            url: episode.url,
            title: `${episode.number}. ${episode.description}`,
            description: `${podcast.id}|${episode.id}`,
            artist: podcast.name
        });

        await TrackPlayer.seekTo(position)
    }


    const download = async () => {
        const track = await TrackPlayer.getActiveTrack()

        if (track && track.url) {
            const [ podcastId, episodeId ] = (track.description?.split('|') ?? [])

            const { downloaded } = await getDownloadById(episodeId) ?? {}

            if (downloaded) {
                Toast.show({
                    type: 'success', // Indicates a successful outcome
                    text1: 'Download Complete', // More precise text
                    text2: 'The episode is now ready for offline playback.', // Additional detail can be helpful
                    position: 'bottom', // Keeps it out of the way of primary interactions
                    visibilityTime: 4000, // Long enough to read comfortably
                    autoHide: true, // Disappears after the set time
                    bottomOffset: 40, // Spacing from the bottom
                });
            } else {
                Toast.show({
                    type: 'info', // Change type if 'info' is available, to differentiate from complete success
                    text1: 'Download Started', // Clear indication of action initiation
                    text2: 'Your episode is now downloading.', // Provides a bit more context
                    position: 'bottom', // Consistent positioning
                    visibilityTime: 4000, // Matching visibility duration
                    autoHide: true, // Ensures it doesn't stay around too long
                    bottomOffset: 40, // Consistent placement
                });
            }

            await downloadAudio({
                ...track,
                podcastId,
                episodeId,
            })
        }
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <YStack f={1} p={Theme.spacing.large} pt={Theme.spacing.normal} space="$4">
                <YStack position="absolute" t={0} b={0} r={0} l={0}>
                    <Image src={episode.background ?? podcast.background} width="100%" aspectRatio={1} position="absolute" top={0} bottom={0}
                           right={0} left={0} resizeMode={'cover'} />
                    <YStack position="absolute" t={0} b={0} r={0} l={0} opacity={0.85}
                            backgroundColor="$background" width={'100%'}></YStack>
                </YStack>

                <MediaImage image={episode.image ?? podcast.image}/>

                <YStack mt="$2" space="$1">
                    <H4 textAlign="center" color={'$color'} numberOfLines={1}>
                        { track?.title }
                    </H4>
                    <Paragraph textAlign="center" color={'$color'} numberOfLines={1}>
                        { track?.artist }
                    </Paragraph>
                </YStack>

                <MediaProgressSlider
                    currentTime={position}
                    endTime={duration}
                    minimumTrackColor={Theme.colors.vividPurple}
                    maximumTrackColor={'white'}
                    loading={duration === 0}
                    onValueChange={(value) => TrackPlayer.seekTo(value)}
                />

                <MediaPlayerControls
                    variant="large"
                    togglePlayPause={togglePlayPause}
                    playNext={playNext}
                    playPrev={playPrev}
                    buffering={audioLoaded && buffering}
                    isPlaying={state === State.Playing}
                    isFirst={track?.id === firstEpisode?.id}
                    isLast={track?.id === lastEpisode?.id}
                    download={download}
                    episodeId={track?.description?.split('|')[1]}
                />

                {/*<AboutEpisodeSheet*/}
                {/*    about={'The life of the Muslim Ummah is solely dependent on the ink of its scholars and the blood of its Martyrs." - Shaykh Abdullah Azzam (May the Mercy of Allah be with him) Indeed history is written in the colours, black - the ink of its scholars, red - the blood of the martyrs. Maktabah Sound Studio is proud to introduce "Heroes of Islam" a series of lectures exploring the lives of some of the greatest men in the history of Islam'}*/}
                {/*/>*/}

            </YStack>
         </ScrollView>
    );
}
