import React from 'react';
import {Image, Text, useTheme, XStack, YStack} from 'tamagui';
import MediaPlayerControls from '../../MediaPlayerControls/MediaPlayerControls';
import PlaceholderImage from '../../../../assets/images/img_3.png';
import {Edges, SafeAreaView} from "react-native-safe-area-context";
import TrackPlayer, {State, useActiveTrack, usePlaybackState, useProgress} from "react-native-track-player";
import {TouchableOpacity} from "react-native";
import {router} from "expo-router";

export default function EpisodePlayer({ edges = ['bottom'] }: { edges?: Edges }) {
    const {position, duration} = useProgress(1000);
    const { state } = usePlaybackState();
    const isPlaying = state === State.Playing
    const track = useActiveTrack()

    const isLoading = (state === State.Loading || state === State.Buffering)

    const theme = useTheme()
    const background = theme.background.get()

    const togglePlayPause = async () => {
        if (Math.ceil(position) === Math.ceil(duration)) {
            await TrackPlayer.seekTo(0)
        }

        if (!isPlaying) {
            TrackPlayer.play();
        } else {
            TrackPlayer.pause();
        }
    };

    const [ podcastId, episodeId ] = (track?.description?.split('|') ?? [])

    if (!podcastId || !episodeId) return null

    const openEpisode = () => router.push({ pathname: "/episode/", params: { podcastId, episodeId } })

    return (
        <SafeAreaView edges={edges} style={{ backgroundColor: background }}>
            <TouchableOpacity onPress={openEpisode} activeOpacity={0.9}>
                <YStack backgroundColor={background} alignItems="center">
                    <YStack height={4} width="100%" borderRadius={10} backgroundColor="rgba(0,0,0,0.1)">
                        <YStack height={'100%'} backgroundColor="$color.purple" borderTopRightRadius={10} borderBottomRightRadius={10} width={`${(position / duration) * 100}%`} />
                    </YStack>

                    <XStack flexDirection="row" paddingHorizontal={16} paddingVertical={10} alignItems="center">
                        <Image src={PlaceholderImage} width={45} height={40} borderRadius={5} resizeMode="cover" />
                        <YStack marginLeft={12} justifyContent="center" f={1}>
                            <Text fontSize={16} fontWeight="600" numberOfLines={1}>
                                { track?.title }
                            </Text>
                            <Text fontSize={15}>
                                { track?.artist }
                            </Text>
                        </YStack>
                        <MediaPlayerControls
                            variant="small"
                            togglePlayPause={togglePlayPause}
                            isPlaying={isPlaying}
                            loading={isLoading}
                            episodeId={track?.description?.split('|')[1]}
                        />
                    </XStack>
                </YStack>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
