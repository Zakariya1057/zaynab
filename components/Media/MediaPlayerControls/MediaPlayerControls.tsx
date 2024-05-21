import {Spinner, useTheme, View, YStack, Text} from 'tamagui';
import {FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import {TouchableOpacity} from "react-native";
import {FastForward, Rewind} from '@tamagui/lucide-icons'
import useShuffle from "@/hooks/useShuffle";
import {usePlaybackSpeed} from "@/hooks/usePlaybackSpeed";
import {useProgress} from "react-native-track-player";

interface Props {
    isPlaying: boolean;
    togglePlayPause: () => void;
    playNext?: () => void;
    playPrev?: () => void;
    loading?: boolean;
    buffering?: boolean;
    variant: 'small' | 'medium' | 'large';
    seek: (time: number) => void; // Function to seek to a specific time in the playback.
    isFirst?: boolean; // Indicates if the current track is the first one
    isLast?: boolean;  // Indicates if the current track is the last one
}

const MediaPlayerControls: React.FC<Props> = ({
                                                  isPlaying,
                                                  togglePlayPause,
                                                  playNext,
                                                  playPrev,
                                                  seek,
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

    // const {speed, cycleSpeed} = usePlaybackSpeed();
    // const {shuffleOn, toggleShuffle} = useShuffle()

    const {position} = useProgress();

    // Skip forward by 15 seconds
    const skipForward = () => {
        seek(position + 15);
    }

    // Skip backward by 15 seconds
    const skipBackward = () => {
        seek(Math.max(0, position - 15)); // Ensure we don't go below 0.
    }

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
                    <TouchableOpacity onPress={playPrev} disabled={isFirst} style={{ padding: 10 }}>
                        <FontAwesome5 size={size} name="backward" color={isFirst ? 'grey' : color} strokeWidth={strokeWidth} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={skipBackward} style={{ padding: 10 }}>
                        <MaterialCommunityIcons name="rewind-15" size={size} color={color} strokeWidth={strokeWidth} />
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
                                    <Spinner size="large" color={'white'}/>
                                    :
                                    <FontAwesome5 name={isPlaying ? 'pause' : 'play'} size={size} color={'white'} />
                            }
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={skipForward} style={{ padding: 10 }}>
                        <MaterialCommunityIcons name="fast-forward-15" size={size} color={color} strokeWidth={strokeWidth} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={playNext} disabled={isLast} style={{ padding: 10 }}>
                        <FontAwesome5 name="forward" size={size} color={isLast ? 'grey' : color} strokeWidth={strokeWidth} />
                    </TouchableOpacity>
                </YStack>
            )}
        </YStack>
    );
};

export default MediaPlayerControls