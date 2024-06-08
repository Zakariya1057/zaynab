import type {LayoutChangeEvent} from "react-native";
import {useEffect, useState} from 'react'
import { Marquee } from '@animatereactnative/marquee';
import {H4, YStack} from "tamagui";
import {NativeSyntheticEvent, TextLayoutEventData} from "react-native/Libraries/Types/CoreEventTypes";

export const TrackTitle = ({ title }: { title: string }) => {
    const [isMarqueeNeeded, setIsMarqueeNeeded] = useState(true);
    const [containerWidth, setContainerWidth] = useState(0);
    const [display, setDisplay] = useState(false)

    useEffect(() => {
        setDisplay(false)
    }, [title]);

    const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
        if (event.nativeEvent.lines.length === 0) {
            return
        }

        // console.log(event.nativeEvent.lines[0].text, title, event.nativeEvent.lines[0].text !== title)
        setIsMarqueeNeeded(event.nativeEvent.lines[0].text !== title)

        setDisplay(true)
    };

    const onMarqueTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
        if (event.nativeEvent.lines.length === 0) {
            return
        }

        const {width} = event.nativeEvent.lines[0];
        const percentage = Math.round((width/containerWidth)*100)

        setIsMarqueeNeeded(percentage >= 97)
        setDisplay(true)
    };

    const onContainerLayout = (event: LayoutChangeEvent) => {
        const {width} = event.nativeEvent.layout;
        setContainerWidth(width);
    };

    return (
        <YStack onLayout={onContainerLayout} f={1} width="100%" opacity={display ? 1 : 0}>
            {isMarqueeNeeded ? (
                <Marquee spacing={50} speed={0.6}>
                    <H4 textAlign="center" color={'$color'} numberOfLines={1} onTextLayout={onMarqueTextLayout}>
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