import React, {useEffect, useState} from 'react';
import {Modal, RefreshControl, SectionList, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import {withObservables} from '@nozbe/watermelondb/react';
import {Q} from '@nozbe/watermelondb';
import {DownloadModel} from "@/utils/database/models/download-model";
import {database} from "@/utils/database/setup";
import {Button, Separator, Text, useTheme, XStack, YStack} from "tamagui";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import {getPodcastById} from "@/utils/data/getPodcastById";
import {getEpisodeById} from "@/utils/data/getEpisodeById";
import {Stack, router, useFocusEffect} from "expo-router";
import {Ionicons, Octicons} from "@expo/vector-icons";
import {DownloadStatus} from "@/interfaces/download-status";
import {deleteDownload} from "@/utils/download/delete-download";
import {cancelDownload} from "@/utils/download/cancel-download";
import {useDownloads} from "@/contexts/download-context";
import useDownloadManager from "@/hooks/useDownloadManager";
import {getEpisodeNumberFromTitle} from "@/utils/episode/get-episode-number-from-title";
import {ArrowLeft} from "@tamagui/lucide-icons";
import {deleteDownloads} from "@/utils/download/delete-downloads";

interface DownloadItemProps {
    download: DownloadModel
    status: DownloadStatus
    highlight: boolean
    setHighlightedId: (id: string, download: DownloadModel) => void
    highlightedItemsFound: boolean
}

const DownloadItemModal = ({modalVisible, setModalVisible, handlePauseDownload, handleDeleteDownload}) => {
    return (
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="rgba(0, 0, 0, 0.5)">
                    <YStack width={320} minHeight={200} padding={20} backgroundColor={'$background'} borderRadius={12}
                            alignItems="center" elevation={5} gap={'$6'}>
                        <Text fontSize={'$7'} fontWeight="bold" color={'$text'}>
                            Manage Download
                        </Text>

                        <YStack gap={'$4'} alignItems={'center'} width={'100%'}>
                            <Button backgroundColor="$blue5" borderRadius={10} width="100%"
                                    onPress={handlePauseDownload}>
                                <Text fontSize={'$5'}>Pause Download</Text>
                            </Button>
                            <Button onPress={handleDeleteDownload} backgroundColor="$red5" borderRadius={10}
                                    width="100%">
                                <Text fontSize={'$5'}>Delete Download</Text>
                            </Button>
                        </YStack>

                        <Button onPress={() => setModalVisible(false)} backgroundColor="$gray5" borderRadius={10}
                                width="100%">
                            <Text fontSize={'$5'}>Cancel</Text>
                        </Button>
                    </YStack>
                </YStack>
            </Modal>
        </TouchableWithoutFeedback>
    );
};

const DownloadItem: React.FC<DownloadItemProps> = ({download, status, highlight, setHighlightedId, highlightedItemsFound}) => {
    const {podcastId, episodeId, totalBytesWritten, totalBytesExpectedToWrite, downloaded, error} = download

    const {getDownloadResumable, removeDownload} = useDownloads();

    const {downloadAudio, startNextDownload} = useDownloadManager();

    if (!podcastId || !episodeId) {
        return null
    }

    const podcast = getPodcastById(podcastId)
    const episode = getEpisodeById(podcast, episodeId)


    const theme = useTheme()
    const color = theme.color.get()

    const [modalVisible, setModalVisible] = useState(false);

    const handlePauseDownload = () => {
        console.log('Pausing the download');
        // Add logic to pause the download
        setModalVisible(false);
    };

    const handleDeleteDownload = () => {
        console.log('Deleting the download');
        // Add logic to delete the download
        setModalVisible(false);
    };

    const downloadEpisode = async (download: DownloadModel) => {
        await downloadAudio(download)
    }

    const onDelete = async () => {
        const resumable = getDownloadResumable(episodeId)
        await resumable?.cancelAsync()

        removeDownload(episodeId)
        await startNextDownload()
    }

    const onPress = () => {
        if (highlightedItemsFound) {
            handleLongPress()
        } else {
           router.push({pathname: "/notification.click/", params: {podcastId, episodeId}});
        }
    }

    const handleLongPress = () => {
        setHighlightedId(download.id, download);  // Toggle the highlighted state
    };

    const percentage = (totalBytesWritten / totalBytesExpectedToWrite);
    const percentageCompleted = download.downloaded ? 100 : (Number.isNaN(percentage) ? 0 : Math.round((percentage) * 100))

    const backgroundColor = highlight ? 'rgba(189, 0, 0, 0.5)' : 'transparent';

    return (
        <TouchableOpacity onPress={onPress} delayLongPress={100} onLongPress={handleLongPress}
                          style={{backgroundColor: backgroundColor}} activeOpacity={0.93}>
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
                    >
                        {(fill) => (
                            <Text>{percentageCompleted}%</Text>
                        )}
                    </AnimatedCircularProgress>
                </YStack>

                <YStack f={1} mx={'$3'}>
                    <Text fontSize={17} fontWeight="bold" mb="$1.5" color={'$charcoal'} numberOfLines={1}>
                        {episode.number}. {episode.description}
                    </Text>
                    <Text fontSize={15} color={'$charcoal'}>
                        {podcast.name}
                        {/*{percentage} - {totalBytesWritten} / {totalBytesExpectedToWrite}*/}
                    </Text>
                </YStack>

                {status === DownloadStatus.DownloadFailed && (
                    <TouchableOpacity onPress={() => downloadEpisode(download)} style={{padding: 10}}>
                        <Ionicons name="reload" size={25} color={color}/>
                    </TouchableOpacity>
                )}

            </XStack>

            <Separator alignSelf="stretch" vertical={false}/>

            <DownloadItemModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                handlePauseDownload={handlePauseDownload}
                handleDeleteDownload={handleDeleteDownload}
            />

        </TouchableOpacity>
    );
}

// Main component to display the list of downloads
const DownloadsList: React.FC<{ downloads: DownloadModel[] }> = ({downloads}) => {
    const theme = useTheme();
    const purple = theme.purple.get()

    const [refreshing, setRefreshing] = useState(false);
    const [sections, setSections] = useState<{ title: DownloadStatus, data: DownloadModel[] }[]>([]);
    const [highlighted, setHighlighted] = useState<Record<string, DownloadModel|null>>({})

    useEffect(() => {
        const waitingToDownload = downloads.filter(d => !d.error && !d.downloaded && d.totalBytesWritten === 0);
        const inProgressPaused = downloads.filter(d => !d.error && !d.downloaded && d.totalBytesWritten > 0 && d.totalBytesWritten < d.totalBytesExpectedToWrite);
        const failedToDownload = downloads.filter(d => d.error);
        const completedDownloads = downloads.filter(d => d.downloaded)

        setSections([
            {title: DownloadStatus.InProgress, data: inProgressPaused},
            {title: DownloadStatus.DownloadFailed, data: failedToDownload},
            {title: DownloadStatus.WaitingToDownload, data: waitingToDownload},
            {title: DownloadStatus.CompletedDownload, data: completedDownloads},
        ].filter(section => section.data.length > 0));
    }, [downloads]);

    const onRefresh = async () => {
        setRefreshing(true);
        console.log('Refresh action triggered');
        // You might want to trigger a refetch or some update logic
        // Here you would normally go and fetch new data or re-fetch existing data
        setRefreshing(false);
    };

    const updateHighlighted = (id: string, download: DownloadModel|null) => {
        setHighlighted((prev) => {
            return {...prev, [id]: download}
        })
    }

    const { startNextDownload } = useDownloadManager();

    const deleteHighlighted = () => {
        const validDownloads = Object.values(highlighted).filter((download): download is DownloadModel => download !== null);
        deleteDownloads(validDownloads, startNextDownload);
    }

    const cancelHighlighted = () => {
        setHighlighted({})
    }

    const highlightedItemsFound = Object.values(highlighted).length > 0

    const headerRight = () =>  highlightedItemsFound ?
        <TouchableOpacity onPress={deleteHighlighted}>
            <Ionicons name="trash-outline" size={28} color={'white'} style={{ paddingRight: 15 }}/>
        </TouchableOpacity> : null

    const headerLeft = () =>  highlightedItemsFound ?
        <TouchableOpacity onPress={cancelHighlighted}>
            <ArrowLeft size={28} color="white" style={{ paddingLeft: 55 }} />
        </TouchableOpacity> : null

    const headerTitle = highlightedItemsFound ? '' : 'Downloads'

    return (
        <>
            <Stack.Screen options={{
                headerTitle,
                headerRight,
                headerLeft,
            }}/>
            <SectionList
                sections={sections}
                keyExtractor={(item, index) => item.id + index}
                renderItem={({item, section: {title}}) => <DownloadItem download={item} status={title}
                                                                        highlight={highlighted[item.id]}
                                                                        setHighlightedId={updateHighlighted} highlightedItemsFound={highlightedItemsFound}/>}
                renderSectionHeader={({section: {title}}) => (
                    <YStack width="100%">
                        <XStack justifyContent="space-between" alignItems="center" backgroundColor={'$background'}
                                py={'$3'}>
                            <Text fontSize={20} fontWeight="bold" pl={'$4'}>{title}</Text>
                        </XStack>
                    </YStack>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['purple']} // Optional: you can set the colors of the indicator (Android)
                        tintColor={purple} // Optional: set the color of the indicator (iOS)
                    />
                }
            />
        </>

    );
};

// This function specifies which observables the component subscribes to and watches column changes
const enhance = withObservables(['downloads'], () => ({
    downloads: database.collections.get<DownloadModel>('downloads')
        .query(
            Q.sortBy('downloadUpdatedAt', Q.desc),
            Q.take(100)
        )
        .observeWithColumns(['totalBytesWritten', 'totalBytesExpectedToWrite', 'downloaded', 'error'])
}));


// Wrap the component with the database and observables
export default withDatabase(enhance(DownloadsList));
