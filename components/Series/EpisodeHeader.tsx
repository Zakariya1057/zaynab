import React from 'react';
import {YStack, Text, H4, Separator} from 'tamagui';

export default function EpisodesHeader() {
    return (
        <YStack>
            <Text fontSize={'$6'} fontWeight="bold" py="$2" px="$4">Episodes</Text>
            <Separator />
        </YStack>
    );
}
