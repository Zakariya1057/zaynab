import React from 'react';
import {YStack, XStack, Text, Image, useTheme} from 'tamagui';
import MediaPlayerControls from '../../MediaPlayerControls/MediaPlayerControls';
import { useAudio } from '../../../../contexts/AudioContext';
import PlaceholderImage from '../../../../assets/images/img_3.png';
import {Edges, SafeAreaView} from "react-native-safe-area-context";

export default function EpisodePlayer({ edges = ['bottom'] }: { edges?: Edges }) {
    const { isPlaying, togglePlayPause, sliderValue, endTime } = useAudio();

    const theme = useTheme()
    const color = theme.color.get()
    const background = theme.background.get()

    return (
        <SafeAreaView edges={edges} style={{ backgroundColor: background }}>
            <YStack backgroundColor={background} alignItems="center">
                <YStack height={4} width="100%" borderRadius={10} backgroundColor="rgba(0,0,0,0.1)">
                    <YStack backgroundColor="vividPurple" borderTopRightRadius={10} borderBottomRightRadius={10} width={`${sliderValue * 100}%`} />
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
