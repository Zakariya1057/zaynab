import React from 'react';
import {Button, H2, H3, Image, Text, useTheme, YStack} from 'tamagui';
import EpisodeHeader from './EpisodeHeader';
import {State, useActiveTrack, usePlaybackState} from "react-native-track-player";
import {FontAwesome5} from "@expo/vector-icons"; // Ensure you have the correct icon import

export default function SeriesHeader({ image, title, author, description, continuePlaying, play }: SeriesHeaderProps) {
    const track = useActiveTrack()
    const { state } = usePlaybackState()
    const theme = useTheme();
    const purple = theme.purple.get()

    // TODO: Use Something ELSE
    const currentPodcastPlaying = track?.artist === title

    return (
        <>
            <YStack>
                <YStack width="100%" aspectRatio={1}>
                    <Image src={image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    <YStack
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        justifyContent="center"
                        alignItems="center"
                        backgroundColor="rgba(0,0,0,0.6)"
                    />
                </YStack>
                <YStack
                    position="absolute"
                    justifyContent="flex-end"
                    paddingHorizontal={'$4'} // Assuming $4 matches Theme.spacing.large in your theme
                    paddingBottom={'$4'}
                    space="$4" // Assuming you want to maintain a 20px gap similar to 'rowGap: 20'
                    bottom={0}
                    width={'100%'}
                    top={0}
                >
                    <H3
                        color="white"
                        textAlign="center"
                    >
                        {title}
                    </H3>

                    <Button
                        icon={
                            <FontAwesome5 name={currentPodcastPlaying && (state === State.Playing) ? 'pause' : 'play'} size={20} color={purple} />
                    } // Adjust the color according to your theme
                        onPress={play}
                        size="$4"
                        fontSize="$6" // Adjust based on your theme
                        width={'$12'}
                        alignSelf="center"
                        backgroundColor="rgba(0,0,0,0.60)"
                        borderColor={purple}
                        borderWidth={1.8}
                    >
                        {
                            currentPodcastPlaying ? (  state === State.Playing ? 'Pause' :  ( continuePlaying ? 'Resume' : 'Play' ) ) : ( continuePlaying ? 'Resume' : 'Play')
                        }
                    </Button>

                    <Text
                        color="white"
                        fontSize={16} // Adjust based on your theme or use a direct value
                        numberOfLines={5}
                    >
                        {description}
                    </Text>

                    <Text
                        color="white"
                        fontSize={16} // Adjust based on your theme or use a direct value
                    >
                        By: {author}
                    </Text>
                </YStack>
            </YStack>
            <EpisodeHeader />
        </>
    );
}

// Define the props interface if not already done
interface SeriesHeaderProps {
    image: any; // Adjust the type to match your image source type, e.g., string for URI
    title: string;
    author: string;
    description: string;
    continuePlaying: boolean;
    play: () => void;
}
