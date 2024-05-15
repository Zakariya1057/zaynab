import type {LayoutChangeEvent} from "react-native";
import { useState } from 'react'
import { Marquee } from '@animatereactnative/marquee';
import {H4, YStack} from "tamagui";
import {NativeSyntheticEvent, TextLayoutEventData} from "react-native/Libraries/Types/CoreEventTypes";

export const TrackTitle = ({ title }: { title: string }) => {
    const [isMarqueeNeeded, setIsMarqueeNeeded] = useState(true);
    const [containerWidth, setContainerWidth] = useState(0);

    const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
        if (event.nativeEvent.lines.length === 0) {
            return
        }

        const {width} = event.nativeEvent.lines[0];
        const percentage = Math.round((width/containerWidth)*100)

        setIsMarqueeNeeded(percentage >= 97)
    };

    const onHeadingTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
        const lines = event.nativeEvent.lines.length
        if (lines === 0) {
            return
        }

        setIsMarqueeNeeded(lines === 2)
    };

    const onContainerLayout = (event: LayoutChangeEvent) => {
        const {width} = event.nativeEvent.layout;
        setContainerWidth(width);
    };

    return (
        <YStack onLayout={onContainerLayout} f={1} width="100%">
            {isMarqueeNeeded ? (
                <Marquee spacing={50} speed={0.6}>
                    <H4 textAlign="center" color={'$color'} numberOfLines={1} onTextLayout={onTextLayout}>
                        {title}
                    </H4>
                </Marquee>
            ) : (
                <H4
                    alignSelf={'center'}
                    justifyContent={'center'}
                    textAlign="center"
                    color={'$color'}
                    onTextLayout={onTextLayout}
                    numberOfLines={1}
                >
                    {title}
                </H4>
            )}
        </YStack>
    );
};