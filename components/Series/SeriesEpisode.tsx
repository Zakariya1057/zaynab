import React from 'react';
import {YStack, Text, Separator} from 'tamagui';

export default function SeriesEpisode({title, description, openEpisode}: SeriesEpisodeProps) {
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
