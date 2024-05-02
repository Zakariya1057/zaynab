import React, {useEffect, useRef} from 'react';
import {Spinner, useTheme, View, YStack, Text} from 'tamagui';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {Pressable, TouchableOpacity} from "react-native";
import {Download, FastForward, Rewind} from '@tamagui/lucide-icons'
import {withObservables} from "@nozbe/watermelondb/react";
import {database} from "@/utils/database/setup";
import {DownloadModel} from "@/utils/database/models/download-model";
import {catchError, map, of} from "rxjs";
import {Q} from "@nozbe/watermelondb";
import LottieView from "lottie-react-native";
import {useDownloads} from "@/contexts/download-context";
import episode from "@/app/episode";
import {useActiveTrack} from "react-native-track-player";

interface Props {
    isPlaying: boolean;
    togglePlayPause: () => void;
    playNext?: () => void;
    playPrev?: () => void;
    download?: () => void;

    downloadModel?: DownloadModel | null;

    loading?: boolean;
    buffering?: boolean;
    variant: 'small' | 'medium' | 'large';
    isFirst?: boolean; // Indicates if the current track is the first one
    isLast?: boolean;  // Indicates if the current track is the last one
}

const ConditionalLottie = ({ isDownloading }) => {
    const animationRef = useRef(null);

    useEffect(() => {
        if (isDownloading) {
            animationRef.current?.play();
        } else {
            animationRef.current?.reset();
        }
    }, [isDownloading]);

    if (!isDownloading) return null;

    return (
        <LottieView
            ref={animationRef}
            style={{ width: 100, height: 100 }}
            source={require('@/assets/animation/download.json')}
            loop
        />
    );
};

const MediaPlayerControls: React.FC<Props> = ({
                                                  isPlaying,
                                                  togglePlayPause,
                                                  playNext,
                                                  playPrev,
                                                  download,
                                                  downloadModel,
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

    const downloadProgress = downloadModel ? (downloadModel.totalBytesWritten / downloadModel.totalBytesExpectedToWrite * 100) : 0

    const downloaded = downloadModel?.downloaded

    const currentlyDownloading = downloadModel?.downloadUpdatedAt &&
        (Date.now() - (downloadModel.downloadUpdatedAt*1000) <= 3000)

    let downloadIcon;
    if (downloaded) {
        downloadIcon = <Ionicons name="cloud-done" size={size+6} color={color} strokeWidth={strokeWidth}/>;
    } else if (currentlyDownloading) {
        downloadIcon = <Ionicons name="cloud-download-outline" size={size+4} color={color} strokeWidth={strokeWidth} />
    } else {
        downloadIcon = <Download size={size} color={color} strokeWidth={strokeWidth}/>;
    }


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
                                buffering || loading ?
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
                        <YStack alignItems="center">
                            {downloadIcon}
                            { (currentlyDownloading && !downloaded && downloadProgress) ? <Text mt={'$2'}>{Math.floor(downloadProgress)}%</Text> : undefined }
                        </YStack>
                    </TouchableOpacity>
                </>
            )}
        </YStack>
    );
};

// Continue using the enhanced function as it was
const enhance = withObservables(['episodeId'], ({ episodeId }) => ({
    downloadModel: episodeId ? database.get<DownloadModel>('downloads').query(
        Q.where('episodeId', episodeId)
    ).observeWithColumns(['totalBytesWritten', 'downloaded']).pipe(
        map(downloads => downloads.length > 0 ? downloads[0] : null),
        catchError(() => of(null))
    ) : of(null) // Return null immediately if episodeId is undefined
}));

export default enhance(MediaPlayerControls);