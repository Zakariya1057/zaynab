import React from 'react';
import {YStack, Text, H4, Separator} from 'tamagui';

export default function EpisodesHeader() {
    return (
        <YStack
            paddingTop="$2" // Use your theme's spacing token for small
            paddingHorizontal="$4" // Use your theme's spacing token for large
        >
            <H4
                alignSelf="flex-start"
                color="$black" // Use your theme's color token
                fontSize={20}
            >
                Episodes
            </H4>
        </YStack>
    );
}
