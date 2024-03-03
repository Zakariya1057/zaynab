import React from 'react';
import {YStack, Text} from 'tamagui';
import {Theme} from '../../../constants';
import {Platform} from "react-native";
import Slider from "@react-native-community/slider";

interface MediaProgressSliderProps {
    minimumTrackColor: string;
    maximumTrackColor: string;
    showTime?: boolean;
    currentTime: string;
    endTime: string;
    value: number;
    onSlidingStart: (value: number) => void;
    onSlidingComplete: (value: number) => void;
    onValueChange: (value: number) => void;
}

const MediaProgressSlider: React.FC<MediaProgressSliderProps> = ({
                                                                     minimumTrackColor,
                                                                     maximumTrackColor,
                                                                     currentTime,
                                                                     endTime,
                                                                     value,
                                                                     onValueChange,
                                                                     onSlidingStart,
                                                                     onSlidingComplete,
                                                                     showTime = false,
                                                                 }) => {
    return (
        <YStack width={'100%'}>
            <Slider
                style={{width: '100%'}}
                minimumValue={0}
                maximumValue={1}
                value={value}
                minimumTrackTintColor={minimumTrackColor}
                maximumTrackTintColor={maximumTrackColor}
                onSlidingStart={onSlidingStart}
                onSlidingComplete={onSlidingComplete}
                onValueChange={onValueChange}
                tapToSeek={true}
            />

            {showTime && (
                <YStack flexDirection="row" justifyContent="space-between" mt={'$2'}>
                    <Text color="$color" fontSize={Theme.fontSizes.normal} mt={Platform.OS === 'android' ? 5 : 0}>
                        {currentTime}
                    </Text>
                    <Text color="$color" fontSize={Theme.fontSizes.normal} mt={Platform.OS === 'android' ? 5 : 0}>
                        -{endTime}
                    </Text>
                </YStack>
            )}
        </YStack>
    );
};

export default MediaProgressSlider;
