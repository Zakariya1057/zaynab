import React, {useEffect, useState} from 'react';
import {YStack, XStack, Text, Image, useTheme} from 'tamagui';
import MediaPlayerControls from '../../MediaPlayerControls/MediaPlayerControls';
import PlaceholderImage from '../../../../assets/images/img_3.png';
import {Edges, SafeAreaView} from "react-native-safe-area-context";
import TrackPlayer, {State, usePlaybackState, useProgress} from "react-native-track-player";

export default function EpisodePlayer({ edges = ['bottom'] }: { edges?: Edges }) {
    const {position, duration} = useProgress(1000);
    const { state } = usePlaybackState();
    const isPlaying = state === State.Playing

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

    return (
        <SafeAreaView edges={edges} style={{ backgroundColor: background }}>
            <YStack backgroundColor={background} alignItems="center">
                <YStack height={4} width="100%" borderRadius={10} backgroundColor="rgba(0,0,0,0.1)">
                    <YStack height={'100%'} backgroundColor="$color.purple" borderTopRightRadius={10} borderBottomRightRadius={10} width={`${(position / duration) * 100}%`} />
                </YStack>

                <XStack flexDirection="row" paddingHorizontal={16} paddingVertical={8} alignItems="center">
                    <Image src={PlaceholderImage} width={45} height={40} borderRadius={5} resizeMode="cover" />
                    <YStack marginLeft={12} justifyContent="center" f={1}>
                        <Text fontSize={16} fontWeight="600">
                            Imam Abu Hanifah [702-772 CE]
                        </Text>
                        <Text fontSize={15}>
                            Heroes of Islam
                        </Text>
                    </YStack>
                    <MediaPlayerControls variant="small" togglePlayPause={togglePlayPause} isPlaying={isPlaying} />
                </XStack>
            </YStack>
        </SafeAreaView>
    );
}
