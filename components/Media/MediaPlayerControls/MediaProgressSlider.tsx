import React, {useState, useEffect} from 'react';
import {YStack, Text, Spinner} from 'tamagui';
import {Platform} from "react-native";
import Slider from "@react-native-community/slider";
import {Theme} from "@/constants";
import TrackPlayer, {State, usePlaybackState} from "react-native-track-player";

interface MediaProgressSliderProps {
    minimumTrackColor: string;
    maximumTrackColor: string;
    currentTime: number;
    endTime: number;
    loading: boolean;
    onValueChange: (value: number) => void;
}

const MediaProgressSlider: React.FC<MediaProgressSliderProps> = ({
                                                                     minimumTrackColor,
                                                                     maximumTrackColor,
                                                                     currentTime,
                                                                     endTime,
                                                                     loading,
                                                                     onValueChange,
                                                                 }) => {
    const [sliderValue, setSliderValue] = useState(currentTime);
    const [wasPlaying, setWasPlaying] = useState(false);
    const [time, setCurrentTime] = useState(currentTime)

    const [newValue, setNewValue] = useState<number|null>(null)
    const [canUpdate, setCanUpdate] = useState(true)

    const {state} = usePlaybackState()

    useEffect(() => {
        if ((canUpdate || newValue === currentTime)) {
            setCanUpdate(true)
            setSliderValue(currentTime);
            setCurrentTime(currentTime)
        }
    }, [currentTime]);

    const handleSliderChange = async (value: number) => {
        setCurrentTime(value)
    };

    const handleSlidingStart = async () => {
        setWasPlaying(state === State.Playing);

        if (state === State.Playing) {
            await TrackPlayer.pause()
        }
    };

    const handleSlidingComplete = async (value: number) => {
        setCanUpdate(false)
        setNewValue(value)
        setCurrentTime(value)

        onValueChange(value);

        if (wasPlaying) {
            await TrackPlayer.play()
        }

        await new Promise(resolve => setTimeout(() => setCanUpdate(true), 500));
    };

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        let result = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (hrs > 0) {
            result = `${hrs}:${result}`;
        }
        return result;
    };

    const formatRemainingTime = (currentTime: number, endTime: number) => {
        const remaining = endTime - currentTime;
        return "-" + formatTime(Math.abs(remaining));
    };

    return (
        <YStack width={'100%'}>
            <Slider
                style={{width: '100%'}}
                minimumValue={0}
                maximumValue={endTime}
                value={sliderValue}
                minimumTrackTintColor={minimumTrackColor}
                maximumTrackTintColor={maximumTrackColor}
                onValueChange={handleSliderChange}
                onSlidingStart={handleSlidingStart}
                onSlidingComplete={handleSlidingComplete}
                tapToSeek={false}
            />
            <YStack flexDirection="row" justifyContent="space-between" mt={'$2'}>
                <Text fontSize={Theme.fontSizes.small}
                      mt={Platform.OS === 'android' ? 5 : 0}>
                    {formatTime(time)}
                </Text>
                <Text fontSize={Theme.fontSizes.small}
                      mt={Platform.OS === 'android' ? 5 : 0}>
                    {
                        loading ? <Spinner size="small" color="$color.purple"
                                           height={10}/> : formatRemainingTime(time, endTime)
                    }
                </Text>
            </YStack>
        </YStack>
    );
};

export default MediaProgressSlider;
