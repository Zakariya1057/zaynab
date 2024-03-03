import React from 'react';
import {useTheme, View, YStack} from 'tamagui';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {Pressable, TouchableOpacity} from "react-native";
import { Download, FastForward, Rewind } from '@tamagui/lucide-icons'

interface Props {
    isPlaying: boolean;
    togglePlayPause: () => void;
    variant: 'small' | 'medium' | 'large';
}

const MediaPlayerControls: React.FC<Props> = ({ isPlaying, togglePlayPause, variant }) => {
    const size = variant === 'small' ? 37 : 35;
    const theme = useTheme()

    const color = theme.color.get()
    const purple = theme.purple.get()

    const strokeWidth = 1.7

    return (
        <YStack flexDirection="row" alignItems="center" justifyContent="space-between">
            {variant === 'small' ? (
                <TouchableOpacity onPress={togglePlayPause}>
                    <Ionicons name={isPlaying ? 'pause' : 'play'} size={size} color={purple} />
                </TouchableOpacity>
            ) : (
                <>
                    <TouchableOpacity onPress={() => {}}>
                        <Ionicons name="shuffle" size={size+5} color={color} strokeWidth={strokeWidth} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {}}>
                        <Rewind size={size} color={color} strokeWidth={strokeWidth} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={togglePlayPause}
                    >
                        <View
                            borderRadius={100}
                            backgroundColor={purple}
                            padding={variant === 'large' ? 20 : 5}
                        >
                            <Ionicons name={isPlaying ? 'pause' : 'play'} size={size + 3} color={'white'} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {}}>
                        <FastForward size={size} color={color} strokeWidth={strokeWidth} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {}}>
                        <Download size={size} color={color} strokeWidth={strokeWidth}/>
                    </TouchableOpacity>
                </>
            )}
        </YStack>
    );
};

export default MediaPlayerControls;
