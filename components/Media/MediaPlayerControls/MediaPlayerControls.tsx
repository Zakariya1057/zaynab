import React from 'react';
import {Spinner, useTheme, View, YStack} from 'tamagui';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {Pressable, TouchableOpacity} from "react-native";
import {Download, FastForward, Rewind} from '@tamagui/lucide-icons'

interface Props {
    isPlaying: boolean;
    togglePlayPause: () => void;
    playNext?: () => void;
    playPrev?: () => void;
    download?: () => void;

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
                                                  download,
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

    return (
        <YStack flexDirection="row" alignItems="center" justifyContent="space-between">
            {variant === 'small' ? (
                <TouchableOpacity onPress={togglePlayPause}>
                    {
                        !loading ? (
                                <Ionicons name={isPlaying ? 'pause' : 'play'} size={size} color={purple}/>
                            ) :
                            (
                                <Spinner size="small" color={purple}/>
                            )
                    }

                </TouchableOpacity>
            ) : (
                <>
                    <TouchableOpacity onPress={() => {
                    }}>
                        <Ionicons name="shuffle" size={size + 5} color={color} strokeWidth={strokeWidth}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={playPrev} disabled={isFirst}>
                        <Rewind size={size} color={isFirst ? 'grey' : color} strokeWidth={strokeWidth}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={togglePlayPause}
                        disabled={buffering}
                    >

                        <View
                            borderRadius={100}
                            backgroundColor={purple}
                            padding={variant === 'large' ? 20 : 5}
                        >
                            {
                                buffering ?
                                    (
                                        <Spinner size="large" color={'white'}/>
                                    ) : (
                                        <Ionicons name={isPlaying ? 'pause' : 'play'} size={size + 3} color={'white'}/>
                                    )
                            }

                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={playNext} disabled={isLast}>
                        <FastForward size={size} color={isLast ? 'grey' : color} strokeWidth={strokeWidth}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={download}>
                        <Download size={size} color={color} strokeWidth={strokeWidth}/>
                    </TouchableOpacity>
                </>
            )}
        </YStack>
    );
};

export default MediaPlayerControls;
