import {YStack, Text, Spinner} from 'tamagui';
import {Theme} from '@/constants';
import {Platform} from "react-native";
import Slider from "@react-native-community/slider";

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
    // Helper function to format time in HH:MM:SS or MM:SS
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

    // Helper function to format remaining time
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
                value={currentTime}
                minimumTrackTintColor={minimumTrackColor}
                maximumTrackTintColor={maximumTrackColor}
                onValueChange={onValueChange}
                tapToSeek={true}
            />
            <YStack flexDirection="row" justifyContent="space-between" mt={'$2'}>
                <Text fontSize={Theme.fontSizes.small}
                      mt={Platform.OS === 'android' ? 5 : 0}>
                    {formatTime(currentTime)}
                </Text>
                <Text fontSize={Theme.fontSizes.small}
                      mt={Platform.OS === 'android' ? 5 : 0}>
                    {
                        loading ? <Spinner size="small" color="$color.purple" height={10}/> : formatRemainingTime(currentTime, endTime)
                    }
                </Text>
            </YStack>
        </YStack>
    );
};

export default MediaProgressSlider;
