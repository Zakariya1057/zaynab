import React, {useRef} from 'react';
import {YStack, Text, Separator, XStack} from 'tamagui';
import LottieView from 'lottie-react-native';

export default function SeriesEpisode({title, description, openEpisode, playing}: SeriesEpisodeProps) {
    const animation = useRef(null);

    return (
        <>
            <XStack
                onPress={openEpisode}
                borderBottomWidth={1}

                paddingHorizontal="$4" // Assuming '$4' is equivalent to Theme.spacing.large in your theme
                paddingTop="$3" // Assuming '$2' is equivalent to Theme.spacing.normal in your theme
                paddingBottom={'$2'}
            >
                <YStack f={1}>
                    <Text fontSize={17} fontWeight="bold" mb={'$1.5'} color={playing ? '$color.purple' : '$color'}>{title}</Text>
                    <Text fontSize={15} color={playing ? '$color.purple2' : '$charcoal'} >{description}</Text>
                </YStack>

                <YStack opacity={playing ? 1 : 0}>
                    <LottieView
                        autoPlay
                        ref={animation}
                        style={{
                            width: 70,
                            height: 50,
                        }}
                        // Find more Lottie files at https://lottiefiles.com/featured
                        source={require('@/assets/animation/sound.json')}
                    />
                </YStack>

            </XStack>

            <Separator alignSelf="stretch" vertical={false}/>
        </>

    )
        ;
}

// You may need to define SeriesEpisodeProps if not already defined elsewhere
interface SeriesEpisodeProps {
    title: string;
    description: string;
    playing: boolean;
    openEpisode: () => void;
}
