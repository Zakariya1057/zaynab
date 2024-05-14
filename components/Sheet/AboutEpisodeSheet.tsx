import React, { useMemo } from 'react';
import {YStack, Text, useTheme, Paragraph, H3, H4, H5} from 'tamagui';
import { Theme } from '../../constants';
import BottomSheet from "@gorhom/bottom-sheet";

interface AboutEpisodeSheetProps {
    about: string;
}

export default function AboutEpisodeSheet({ about }: AboutEpisodeSheetProps) {
    const snapPoints = useMemo(() => ['10%', '75%', '100%'], []);

    const theme = useTheme()

    return (
        <BottomSheet
            index={0}
            snapPoints={snapPoints}
            style={{
                backgroundColor: "#FFFFFF",
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
            }}
            handleIndicatorStyle={{
                backgroundColor: theme.color.get(),
            }}
            backgroundStyle={{ backgroundColor: theme.background.get() }}
        >
            <YStack f={1} px={Theme.spacing.large}>
                <H5 color={'$color'} my={10}>
                    About Episode
                </H5>
                <Paragraph color={'$color'} mb={10}>
                    {about}
                </Paragraph>
            </YStack>
        </BottomSheet>
    );
}
