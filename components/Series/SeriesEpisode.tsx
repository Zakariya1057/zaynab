import React, {useEffect, useRef} from 'react';
import {YStack, Text, Separator, XStack, useTheme} from 'tamagui';
import LottieView from 'lottie-react-native';
import {State, usePlaybackState} from "react-native-track-player";
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function SeriesEpisode({title, description, openEpisode, playing, percentage}: SeriesEpisodeProps) {
    const animation = useRef(null);

    const {state} = usePlaybackState()

    const theme = useTheme();
    const purple = theme.purple.get()

    return (
        <>
            <XStack
                onPress={openEpisode}
                borderBottomWidth={1}
                paddingHorizontal="$4"
                paddingTop="$3"
                paddingBottom={'$2'}
            >
                <YStack f={1}>
                    <Text fontSize={17} fontWeight="bold" mb={'$1.5'}
                          color={playing ? '$color.purple' : '$color'}>{title}</Text>
                    <Text fontSize={15} color={playing ? '$color.purple2' : '$charcoal'}>{description}</Text>
                </YStack>

                <YStack opacity={(playing && state !== State.Paused) ? 1 : 0} justifyContent={'center'}>
                    <LottieView
                        autoPlay
                        ref={animation}
                        style={{
                            width: 70,
                            height: 50,
                        }}
                        source={require('@/assets/animation/sound.json')}
                    />
                </YStack>

                {
                    percentage ?
                        <Text justifyContent={'center'} ml={'$5'}>
                            <AnimatedCircularProgress
                                size={50}
                                width={5}
                                fill={(percentage * 100)}
                                tintColor={purple}
                                backgroundColor={'rgba(111,67,241,0.47)'}
                                rotation={0}
                                 >
                                {
                                    (fill) => (
                                        <Text>
                                            {Math.ceil(percentage * 100)}%
                                        </Text>
                                    )
                                }
                            </AnimatedCircularProgress>
                        </Text>
                        : <></>
                }

            </XStack>

            <Separator alignSelf="stretch" vertical={false}/>
        </>

    )
        ;
}

interface SeriesEpisodeProps {
    title: string;
    description: string;
    playing: boolean;
    percentage: number | null;
    openEpisode: () => void;
}
