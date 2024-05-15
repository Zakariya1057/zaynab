import React, { useCallback, useEffect, useState } from 'react';
import { Modal, RefreshControl, SectionList, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import { DownloadModel } from "@/utils/database/models/download-model";
import { database } from "@/utils/database/setup";
import { Button, Separator, Text, useTheme, XStack, YStack } from "tamagui";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { getPodcastById } from "@/utils/data/getPodcastById";
import { getEpisodeById } from "@/utils/data/getEpisodeById";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DownloadStatus } from "@/interfaces/download-status";
import useDownloadManager from "@/hooks/useDownloadManager";
import { ArrowLeft, Download } from "@tamagui/lucide-icons";
import { confirmDeleteDownloads } from "@/utils/download/confirm-delete-downloads";
import { setAutoPlay } from "@/utils/track/auto-play";

const PAGE_SIZE = 20; // Number of items to load per page

interface DownloadItemProps {
    download: DownloadModel
    status: DownloadStatus
    highlight: boolean
    setHighlightedId: (id: string, download: DownloadModel) => void
    highlightedItemsFound: boolean
}

const DownloadItem: React.FC<DownloadItemProps> = ({ download, status, highlight, setHighlightedId, highlightedItemsFound }) => {
    const { podcastId, episodeId, totalBytesWritten, totalBytesExpectedToWrite, downloaded, error } = download

    const { downloadAudio } = useDownloadManager();

    if (!podcastId || !episodeId) {
        return null;
    }

    const podcast = getPodcastById(podcastId);
    const episode = getEpisodeById(podcast, episodeId);

    const theme = useTheme();
    const color = theme.color.get();

    const downloadEpisode = async (download: DownloadModel) => {
        await downloadAudio(download);
    }

    const onPress = () => {
        if (highlightedItemsFound) {
            handleLongPress();
        } else {
            router.push({ pathname: "/notification.click/", params: { podcastId, episodeId } });
        }
    }

    const handleLongPress = () => {
        setHighlightedId(download.id, highlight ? null : download);  // Toggle the highlighted state
    };

    const percentage = (totalBytesWritten / totalBytesExpectedToWrite);
    const percentageCompleted = download.downloaded ? 100 : (Number.isNaN(percentage) ? 0 : Math.round((percentage) * 100))

    const backgroundColor = highlight ? 'rgba(189, 0, 0, 0.5)' : 'transparent';

    // Calculate time since last update
    const now = new Date();
    const lastUpdated = new Date(download.downloadUpdatedAt * 1000);
    const timeDifference = (now.getTime() - lastUpdated.getTime()) / 1000; // Time difference in seconds

    return (
        <TouchableOpacity
            onPress={onPress}
            delayLongPress={200}
            onLongPress={handleLongPress}
            style={{ backgroundColor: backgroundColor }}
            activeOpacity={0.93}
        >
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
                        {/*{percentage} - {totalBytesWritten} / {totalBytesExpectedToWrite}*/}
                    </Text>
                </YStack>

                {((timeDifference > 10) && (status === DownloadStatus.InProgress || status === DownloadStatus.WaitingToDownload)) && (
                    <TouchableOpacity onPress={() => downloadEpisode(download)} style={{ padding: 10 }}>
                        <Download size={25} color={'white'} strokeWidth={2} />
                    </TouchableOpacity>
                )}

                {status === DownloadStatus.DownloadFailed && (
                    <TouchableOpacity onPress={() => downloadEpisode(download)} style={{ padding: 10 }}>
                        <Ionicons name="reload" size={25} color={color} />
                    </TouchableOpacity>
                )}

            </XStack>

            <Separator alignSelf="stretch" vertical={false} />

        </TouchableOpacity>
    );
}

// Main component to display the list of downloads
const DownloadsList = ({ downloads }) => {
    const theme = useTheme();
    const purple = theme.purple.get();

    const [refreshing, setRefreshing] = useState(false);
    const [highlighted, setHighlighted] = useState({});
    const [page, setPage] = useState(1);
    const [data, setData] = useState(downloads.slice(0, PAGE_SIZE));
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        setData(downloads.slice(0, page * PAGE_SIZE));
    }, [downloads, page]);

    const loadMore = () => {
        if (!isLoadingMore && data.length < downloads.length) {
            setIsLoadingMore(true);
            setPage(prevPage => prevPage + 1);
            setIsLoadingMore(false);
        }
    };

    const sections = () => {
        const waitingToDownload = data.filter(d => !d.error && !d.downloaded && d.totalBytesWritten === 0);
        const inProgressPaused = data
            .filter(d => !d.error && !d.downloaded && d.totalBytesWritten > 0 && d.totalBytesExpectedToWrite > d.totalBytesWritten)

        const failedToDownload = data.filter(d => d.error);
        const completedDownloads = data.filter(d => d.downloaded);

        return [
            { title: DownloadStatus.InProgress, data: inProgressPaused },
            { title: DownloadStatus.CompletedDownload, data: completedDownloads },
            { title: DownloadStatus.DownloadFailed, data: failedToDownload },
            { title: DownloadStatus.WaitingToDownload, data: waitingToDownload },
        ].filter(section => section.data.length > 0);
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        console.log('Refresh action triggered');
        // Simulation of a fetch request
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    const updateHighlighted = (id: string, download: DownloadModel) => {
        setHighlighted(prev => ({ ...prev, [id]: download ? download : undefined }));
    }

    const highlightedItemsFound = Object.values(highlighted).some(download => download !== null);

    const { startNextDownload } = useDownloadManager();

    const deleteHighlighted = async () => {
        const validDownloads = Object.values(highlighted).filter((download): download is DownloadModel => download !== null);

        confirmDeleteDownloads(validDownloads, async () => {
            cancelHighlighted();
            await startNextDownload();
            setAutoPlay(true);
        });
    }

    const cancelHighlighted = () => {
        setHighlighted({});
    }

    const headerRight = () => highlightedItemsFound ?
        <TouchableOpacity onPress={deleteHighlighted}>
            <Ionicons name="trash-outline" size={28} color={'white'} style={{ paddingRight: 15 }} />
        </TouchableOpacity> : null

    const headerLeft = () => highlightedItemsFound ?
        <TouchableOpacity onPress={cancelHighlighted}>
            <ArrowLeft size={28} color="white" style={{ paddingLeft: 55 }} />
        </TouchableOpacity> : null

    const headerTitle = highlightedItemsFound ? '' : 'Downloads'

    const renderFooter = () => {
        if (data.length === downloads.length) return null;

        return (
            <YStack justifyContent="center" alignItems="center" padding="$4">
                <ActivityIndicator size="large" color={purple} />
            </YStack>
        );
    };

    return (
        <>
            <Stack.Screen options={{
                headerTitle,
                headerRight,
                headerLeft,
            }} />
            <SectionList
                sections={sections()}
                keyExtractor={(item, index) => item.id + index}
                renderItem={({ item, section: { title } }) => (
                    <DownloadItem
                        download={item}
                        status={title}
                        highlight={!!highlighted[item.id]}
                        setHighlightedId={updateHighlighted}
                        highlightedItemsFound={highlightedItemsFound}
                    />
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <YStack width="100%">
                        <XStack justifyContent="space-between" alignItems="center" backgroundColor={'$background'}
                                py={'$3'}>
                            <Text fontSize={'$6'} fontWeight="bold" pl={'$4'}>{title}</Text>
                        </XStack>
                    </YStack>
                )}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[purple]}
                        tintColor={purple}
                    />
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
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
