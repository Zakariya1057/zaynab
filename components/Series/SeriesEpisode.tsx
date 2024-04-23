import React, {useRef} from 'react';
import {YStack, Text, Separator} from 'tamagui';
import LottieView from 'lottie-react-native';

export default function SeriesEpisode({title, description, openEpisode}: SeriesEpisodeProps) {
    const animation = useRef(null);

    return (
        <>
            <YStack
                onPress={openEpisode}
                borderBottomWidth={1}
                paddingHorizontal="$4" // Assuming '$4' is equivalent to Theme.spacing.large in your theme
                paddingVertical="$3" // Assuming '$2' is equivalent to Theme.spacing.normal in your theme
            >
                <Text fontSize={17} fontWeight="bold" mb={'$1.5'}>{title}</Text>
                <Text fontSize={15} color="$charcoal">{description}</Text>

                <LottieView
                    autoPlay
                    ref={animation}
                    style={{
                        width: 200,
                        height: 200,
                        backgroundColor: '#eee',
                    }}
                    // Find more Lottie files at https://lottiefiles.com/featured
                    source={require('@/assets/animation/sound.json')}
                />

            </YStack>

            <Separator alignSelf="stretch" vertical={false}/>
        </>

    )
        ;
}

// You may need to define SeriesEpisodeProps if not already defined elsewhere
interface SeriesEpisodeProps {
    title: string;
    description: string;
    openEpisode: () => void;
}
