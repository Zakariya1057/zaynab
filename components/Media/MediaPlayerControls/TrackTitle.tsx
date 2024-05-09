import type {LayoutChangeEvent} from "react-native";
import { useState } from 'react'
import { Marquee } from '@animatereactnative/marquee';
import {H4, YStack} from "tamagui";
import {NativeSyntheticEvent, TextLayoutEventData} from "react-native/Libraries/Types/CoreEventTypes";

export const TrackTitle = ({ title }: { title: string }) => {
    const [isMarqueeNeeded, setIsMarqueeNeeded] = useState(false);
    const [textWidth, setTextWidth] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const checkIfMarqueeNeeded = (textWidth: number, containerWidth: number) => {
        setIsMarqueeNeeded(textWidth > containerWidth);
    };

    const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
        console.log('Lines', event.nativeEvent.lines)

        if (event.nativeEvent.lines.length === 0) {
            return
        }

        const {width} = event.nativeEvent.lines[0];
        const percentage = (width/containerWidth)*100

        setIsMarqueeNeeded(percentage > 98)
    };

    const onContainerLayout = (event: LayoutChangeEvent) => {
        const {width} = event.nativeEvent.layout;
        console.log('Layout', event.nativeEvent.layout)
        setContainerWidth(width);
        checkIfMarqueeNeeded(textWidth, width);
    };

    return (
        <YStack onLayout={onContainerLayout} f={1} ai='center' jc='center' width="100%">
            {isMarqueeNeeded ? (
                <Marquee spacing={50} speed={0.7}>
                    <H4 textAlign="center" color={'$color'} numberOfLines={1} on onTextLayout={onTextLayout}>
                        {title}
                    </H4>
                </Marquee>
            ) : (
                <H4 textAlign="center" color={'$color'} numberOfLines={1} onTextLayout={onTextLayout}>
                    {title}
                </H4>
            )}
        </YStack>
    );
};