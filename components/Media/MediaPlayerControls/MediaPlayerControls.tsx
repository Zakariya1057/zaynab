import {Spinner, useTheme, View, YStack, Text} from 'tamagui';
import {FontAwesome, FontAwesome5, Ionicons, MaterialIcons} from '@expo/vector-icons';
import {TouchableOpacity} from "react-native";
import {FastForward, Rewind} from '@tamagui/lucide-icons'
import useShuffle from "@/hooks/useShuffle";
import {usePlaybackSpeed} from "@/hooks/usePlaybackSpeed";

interface Props {
    isPlaying: boolean;
    togglePlayPause: () => void;
    playNext?: () => void;
    playPrev?: () => void;
    loading?: boolean;
    buffering?: boolean;
    variant: 'small' | 'medium' | 'large';
    isFirst?: boolean; // Indicates if the current track is the first one
    isLast?: boolean;  // Indicates if the current track is the last one
}

const MediaPlayerControls: React.FC<Props> = ({
                                                  isPlaying,
                                                  togglePlayPause,
                                                  playNext,
                                                  playPrev,
                                                  isFirst,
                                                  isLast,
                                                  variant,
                                                  loading,
                                                  buffering
                                              }) => {
    const size = variant === 'small' ? 37 : 35;
    const theme = useTheme()

    const color = theme.color.get()
    const purple = theme.purple.get()

    const strokeWidth = 1.7

    const {speed, cycleSpeed} = usePlaybackSpeed();

    const {shuffleOn, toggleShuffle} = useShuffle()

    return (
        <YStack flexDirection="row" alignItems="center" justifyContent="space-between">
            {variant === 'small' ? (
                <TouchableOpacity onPress={togglePlayPause} style={{padding: 5, width: 40}}>
                    {
                        !loading ? (
                                <FontAwesome5 name={isPlaying ? 'pause' : 'play'} size={size-10} color={purple} />
                            ) :
                            (
                                <Spinner size="small" color={purple}/>
                            )
                    }

                </TouchableOpacity>
            ) : (
                <YStack f={1} flexDirection="row" alignItems="center" justifyContent="space-between">
                    <TouchableOpacity onPress={toggleShuffle}>
                        <FontAwesome5 name="random" size={size} color={!shuffleOn ? color : purple} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={playPrev} disabled={isFirst}>
                        <FontAwesome5 size={size} name="backward" color={isFirst ? 'grey' : color} strokeWidth={strokeWidth} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={togglePlayPause}
                        disabled={buffering}
                    >

                        <View
                            borderRadius={100}
                            height={80}
                            aspectRatio={1}
                            backgroundColor={purple}
                            padding={variant === 'large' ? 20 : 5}
                            justifyContent={'center'}
                            alignItems={'center'}
                        >
                            {
                                buffering || loading ?
                                    (
                                        <Spinner size="large" color={'white'}/>
                                    ) : (
                                        <FontAwesome5 name={isPlaying ? 'pause' : 'play'} size={size} color={'white'} />
                                    )
                            }

                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={playNext} disabled={isLast}>
                        <FontAwesome5 name="forward" size={size} color={isLast ? 'grey' : color} strokeWidth={strokeWidth} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={cycleSpeed}>
                        <YStack alignItems="center">
                            <FontAwesome5 name="tachometer-alt" size={size} color={color} />
                            <Text mt={'$1'}>{`${speed}x`}</Text>
                        </YStack>
                    </TouchableOpacity>
                </YStack>
            )}
        </YStack>
    );
};

export default MediaPlayerControls