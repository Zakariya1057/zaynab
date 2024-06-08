import React, {useCallback, useMemo, useState} from 'react';
import {RefreshControl, TouchableOpacity} from 'react-native';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import {withObservables} from '@nozbe/watermelondb/react';
import {Q} from '@nozbe/watermelondb';
import {DownloadModel} from "@/utils/database/models/download-model";
import {database} from "@/utils/database/setup";
import {Separator, Text, useTheme, View, XStack, YStack} from "tamagui";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import {getPodcastById} from "@/utils/data/getPodcastById";
import {getEpisodeById} from "@/utils/data/getEpisodeById";
import {router, Stack} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {DownloadStatus} from "@/interfaces/download-status";
import useDownloadManager from "@/hooks/useDownloadManager";
import {ArrowLeft, Download} from "@tamagui/lucide-icons";
import {confirmDeleteDownloads} from "@/utils/download/confirm-delete-downloads";
import {setAutoPlay} from "@/utils/track/auto-play";
import {FlashList} from '@shopify/flash-list';

interface DownloadItemProps {
    download: DownloadModel;
    status: DownloadStatus;
}

const DownloadItem: React.FC<DownloadItemProps> = ({download, status}) => {
    const {podcastId, episodeId, totalBytesWritten, totalBytesExpectedToWrite} = download;
    const {downloadAudio} = useDownloadManager();

    if (!podcastId || !episodeId) {
        return null;
    }

    const podcast = getPodcastById(podcastId);
    const episode = getEpisodeById(podcast, episodeId);
    const theme = useTheme();
    const color = theme.color.get();

    const downloadEpisode = async (download: DownloadModel) => {
        await downloadAudio(download);
    };

    const percentage = (totalBytesWritten / totalBytesExpectedToWrite);
    const percentageCompleted = download.downloaded ? 100 : (Number.isNaN(percentage) ? 0 : Math.round(percentage * 100));

    const now = new Date();
    const lastUpdated = new Date(download.downloadUpdatedAt * 1000);
    const timeDifference = (now.getTime() - lastUpdated.getTime()) / 1000;

    return (
        <View>
            <XStack
                borderBottomWidth={1}
                paddingLeft="$4"
                paddingRight="$2"
                paddingTop="$3"
                paddingBottom="$2"
                alignItems="center"
            >
                <YStack>
                    <AnimatedCircularProgress
                        size={50}
                        width={3}
                        fill={percentageCompleted}
                        tintColor={'rgb(189,0,0)'}
                        backgroundColor={'rgba(154,0,0,0.47)'}
                        rotation={0}
                        animationDuration={percentageCompleted === 100 ? 0 : 1000}
                    >
                        {(fill) => (
                            <Text>{percentageCompleted}%</Text>
                        )}
                    </AnimatedCircularProgress>
                </YStack>

                <YStack f={1} mx={'$3'} gap={'$1'}>
                    <Text fontSize={16} fontWeight="bold" mb="$1.5" color={'$charcoal'} numberOfLines={1}>
                        {episode.number}. {episode.description}
                    </Text>
                    <Text fontSize={15} color={'$charcoal'} numberOfLines={1}>
                        {podcast.name}
                    </Text>
                </YStack>

                {((timeDifference > 10) && (status === DownloadStatus.InProgress || status === DownloadStatus.WaitingToDownload)) && (
                    <TouchableOpacity onPress={() => downloadEpisode(download)} style={{padding: 10}}>
                        <Download size={25} color={'white'} strokeWidth={2}/>
                    </TouchableOpacity>
                )}

                {status === DownloadStatus.DownloadFailed && (
                    <TouchableOpacity onPress={() => downloadEpisode(download)} style={{padding: 10}}>
                        <Ionicons name="reload" size={25} color={color}/>
                    </TouchableOpacity>
                )}
            </XStack>

            <Separator alignSelf="stretch" vertical={false}/>
        </View>
    );
};

const DownloadsList = ({downloads}) => {
    const theme = useTheme();
    const purple = theme.purple.get();

    const [refreshing, setRefreshing] = useState(false);
    const [highlighted, setHighlighted] = useState({});

    const getDownloadStatus = (download: DownloadModel): DownloadStatus => {
        if (!download.error && !download.downloaded && download.totalBytesWritten === 0) {
            return DownloadStatus.WaitingToDownload
        } else if (!download.error && !download.downloaded && download.totalBytesWritten > 0 && download.totalBytesExpectedToWrite > download.totalBytesWritten) {
            return DownloadStatus.InProgress
        } else if (download.error) {
            return DownloadStatus.DownloadFailed
        } else if (download.downloaded) {
            return DownloadStatus.CompletedDownload
        }

        return DownloadStatus.InProgress
    }

    const combinedData = useMemo(() => {
        const waitingToDownload = downloads.filter(d => !d.error && !d.downloaded && d.totalBytesWritten === 0);
        const inProgressPaused = downloads.filter(d => !d.error && !d.downloaded && d.totalBytesWritten > 0 && d.totalBytesExpectedToWrite > d.totalBytesWritten);
        const failedToDownload = downloads.filter(d => d.error);
        const completedDownloads = downloads.filter(d => d.downloaded);

        const sections = [
            {title: DownloadStatus.InProgress, data: inProgressPaused},
            {title: DownloadStatus.CompletedDownload, data: completedDownloads},
            {title: DownloadStatus.DownloadFailed, data: failedToDownload},
            {title: DownloadStatus.WaitingToDownload, data: waitingToDownload},
        ].filter(section => section.data.length > 0);

        return sections.reduce((acc, section) => {
            acc.push(section.title);
            acc.push(...section.data);
            return acc;
        }, []);
    }, [downloads]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    const updateHighlighted = (download: DownloadModel) => {
        setHighlighted(prev => ({...prev, [download.id]: download ? download : undefined}));
    };

    const highlightedItemsFound = Object.values(highlighted).some(download => download !== undefined);

    const {startNextDownload} = useDownloadManager();

    const deleteHighlighted = async () => {
        const validDownloads = Object.values(highlighted).filter((download): download is DownloadModel => download !== undefined);

        console.log(validDownloads)
        confirmDeleteDownloads(validDownloads, async () => {
            cancelHighlighted();
            await startNextDownload();
            setAutoPlay(true);
        });
    };

    const cancelHighlighted = () => {
        setHighlighted({});
    };

    const headerRight = () => highlightedItemsFound ? (
        <TouchableOpacity onPress={deleteHighlighted}>
            <Ionicons name="trash-outline" size={28} color={'white'} style={{paddingRight: 15}}/>
        </TouchableOpacity>
    ) : null;

    const headerLeft = () => highlightedItemsFound ? (
        <TouchableOpacity onPress={cancelHighlighted}>
            <ArrowLeft size={28} color="white" style={{paddingLeft: 55}}/>
        </TouchableOpacity>
    ) : null;

    const headerTitle = highlightedItemsFound ? '' : 'Downloads';

    const onPress = (download: DownloadModel) => {
        const {podcastId, episodeId} = download;

        if (highlightedItemsFound) {
            updateHighlighted(download)
        } else {
            router.push({pathname: "/notification.click/", params: {podcastId, episodeId}});
        }
    };

    return (
        <>
            <Stack.Screen options={{
                headerTitle,
                headerRight,
                headerLeft,
            }}/>
            <FlashList
                data={combinedData}
                renderItem={({item}: { item: DownloadModel | string }) => {
                    if (typeof item === 'string') {
                        return (
                            <YStack width="100%">
                                <XStack justifyContent="space-between" alignItems="center"
                                        backgroundColor={'$background'} py={'$3'}>
                                    <Text fontSize={'$6'} fontWeight="bold" pl={'$4'}>{item}</Text>
                                </XStack>
                            </YStack>
                        );
                    }

                    return (
                        <TouchableOpacity
                            onPress={() => onPress(item)}
                            delayLongPress={100}
                            onLongPress={() => updateHighlighted(item)}
                            style={{backgroundColor: highlighted[item.id] ? 'rgba(189, 0, 0, 0.5)' : 'transparent'}}
                            activeOpacity={0.93}
                        >
                            <DownloadItem
                                download={item}
                                status={getDownloadStatus(item)}
                            />
                        </TouchableOpacity>
                    );
                }}
                keyExtractor={(item, index) => {
                    return typeof item === 'string' ? item : item.id
                }}
                extraData={highlighted}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[purple]}
                        tintColor={purple}
                    />
                }
                estimatedItemSize={60}
            />
        </>
    );
};

export default withDatabase(withObservables(['downloads'], () => ({
    downloads: database.collections
        .get('downloads').query(
            Q.sortBy('downloadUpdatedAt', Q.desc)
        ).observeWithColumns(
            ['totalBytesWritten']
        )
}))(DownloadsList));
