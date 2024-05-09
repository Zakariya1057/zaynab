import React, {useCallback, useEffect, useState} from 'react';
import {H4, Image, Paragraph, YStack, ScrollView} from 'tamagui';
import TrackPlayer, {
    State, useActiveTrack,
    usePlaybackState,
    useProgress,
} from 'react-native-track-player';
import MediaPlayerControls from '../../MediaPlayerControls/MediaPlayerControls';
import MediaProgressSlider from '../../MediaPlayerControls/MediaProgressSlider';
import MediaImage from '../../MediaPlayerControls/MediaImage';
import {Theme} from "@/constants";
import {Podcast} from "@/interfaces/podcast";
import {Episode} from "@/interfaces/episode";
import {RefreshControl} from "react-native";
import {useTrackManager} from "@/hooks/useTrackManager";
import {showToast} from "@/utils/toast/show-toast";
import {playNextTrack} from "@/utils/track/play-next-track";
import {playPrevTrack} from "@/utils/track/play-prev-track";
import useDownloadEpisode from "@/hooks/useDownloadEpisode";
import {TrackTitle} from "@/components/Media/MediaPlayerControls/TrackTitle";

export default function EpisodePlayer({podcast, episode}: { podcast: Podcast, episode: Episode }) {
    const track = useActiveTrack()
    const {state} = usePlaybackState()

    const [refreshing, setRefreshing] = useState(false);
    const {position, duration} = useProgress(1000);

    const {togglePlayPause, audioLoaded, buffering, audioFailedToLoad, setAudioFailedToLoad} = useTrackManager();

    const downloadEpisode = useDownloadEpisode();

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await replaceTrack();
        } catch (error) {
            showToast('error', 'Refresh Failed', 'Could not refresh the track.');
        }
        setRefreshing(false);
    }, [showToast]);

    useEffect(() => {
        if (audioFailedToLoad) {
            showToast('error', 'Audio Failed To Load', 'Pull down the page to refresh the track.');
        }
    }, [audioFailedToLoad]);

    const episodes = Object.values(podcast.episodes)
    const firstEpisode = episodes.at(0)
    const lastEpisode = episodes.at(-1)

    const [isFirstEpisode, setIsFirstEpisode] = useState(episode.id === firstEpisode?.id)
    const [isLastEpisode, setIsLastEpisode] = useState(episode.id === lastEpisode?.id)

    // Get the queue and determine the position of the current episode
    useEffect(() => {
        const checkQueuePosition = async () => {
            const queue = await TrackPlayer.getQueue();
            const track = await TrackPlayer.getActiveTrack()

            if (queue.length !== episodes.length) {
                return
            }

            const description = track?.description

            const firstEpisode = queue.at(0);
            const lastEpisode = queue.at(-1);
            const isCurrentFirst = description === firstEpisode?.description;
            const isCurrentLast = description === lastEpisode?.description;

            setIsFirstEpisode(isCurrentFirst)
            setIsLastEpisode(isCurrentLast)
        };

        checkQueuePosition();
    }, [track]);


    const replaceTrack = async () => {
        const {duration: audioDuration} = await TrackPlayer.getProgress()

        if (audioLoaded || audioDuration > 0) {
            return
        }

        setAudioFailedToLoad(true)

        await TrackPlayer.retry()
    }

    return (
        <ScrollView
            refreshControl={
                audioFailedToLoad ?
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    /> : undefined
            }
            style={{flex: 1}}
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}
        >
            <YStack f={1} p={Theme.spacing.large} pt={Theme.spacing.normal} space="$4">
                <YStack position="absolute" t={0} b={0} r={0} l={0}>
                    <Image src={episode.background ?? podcast.background} width="100%" aspectRatio={1}
                           position="absolute" top={0} bottom={0}
                           right={0} left={0} resizeMode={'cover'}/>
                    <YStack position="absolute" t={0} b={0} r={0} l={0} opacity={0.85}
                            backgroundColor="$background" width={'100%'}></YStack>
                </YStack>

                <MediaImage image={episode.image ?? podcast.image}/>

                <YStack mt="$2" space="$1" height={60}>
                    <TrackTitle title={track?.title ?? ''} />
                    <Paragraph textAlign="center" color={'$color'} numberOfLines={1}>
                        {track?.artist}
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
                    playNext={() => playNextTrack(audioFailedToLoad)}
                    playPrev={() => playPrevTrack(audioFailedToLoad)}
                    buffering={audioLoaded && buffering}
                    isPlaying={state === State.Playing}
                    isFirst={isFirstEpisode}
                    isLast={isLastEpisode}
                    download={() => downloadEpisode()}
                    episodeId={track?.description?.split('|')[1]}
                    loading={duration !== 0 && (state === State.Loading || state === State.Buffering)}
                />

                {/*<AboutEpisodeSheet*/}
                {/*    about={'The life of the Muslim Ummah is solely dependent on the ink of its scholars and the blood of its Martyrs." - Shaykh Abdullah Azzam (May the Mercy of Allah be with him) Indeed history is written in the colours, black - the ink of its scholars, red - the blood of the martyrs. Maktabah Sound Studio is proud to introduce "Heroes of Islam" a series of lectures exploring the lives of some of the greatest men in the history of Islam'}*/}
                {/*/>*/}

            </YStack>
        </ScrollView>
    );
}
