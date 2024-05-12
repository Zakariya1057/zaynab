import {Text, View, YStack} from "tamagui";
import React from "react";

export default function ({title, children}) {
    return (
        <View backgroundColor="$backgroundContrast" borderRadius="$4">
            <Text fontSize="$6" px="$4" py={'$3'} fontWeight="bold" backgroundColor={'$background'}>{title}</Text>

            <YStack gap="$4" px="$4" my={'$5'}>
                {children}
            </YStack>
        </View>
    )
}