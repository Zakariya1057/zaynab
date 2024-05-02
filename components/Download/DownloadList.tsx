import React, {useEffect, useRef, useState} from 'react';
import {FlatList, RefreshControl, SectionList, TouchableOpacity, Modal, TouchableWithoutFeedback} from 'react-native';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import {withObservables} from '@nozbe/watermelondb/react';
import {Database, Q} from '@nozbe/watermelondb';
import {DownloadModel} from "@/utils/database/models/download-model";
import {database} from "@/utils/database/setup";
import {YStack, Text, useTheme, XStack, Separator, View, Button} from "tamagui";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import {getPodcastById} from "@/utils/data/getPodcastById";
import {getEpisodeById} from "@/utils/data/getEpisodeById";
import {router} from "expo-router";
import {SimpleLineIcons} from "@expo/vector-icons";

interface DownloadItemProps {
    download: DownloadModel
}

const DownloadItemModal = ({ modalVisible, setModalVisible, handlePauseDownload, handleDeleteDownload }) => {
    return (
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="rgba(0, 0, 0, 0.5)">
                    <YStack width={320} minHeight={200} padding={20} backgroundColor={'$background'} borderRadius={12} alignItems="center" elevation={5} gap={'$6'}>
                        <Text fontSize={'$7'} fontWeight="bold" color={'$text'}>
                            Manage Download
                        </Text>

                        <YStack gap={'$4'} alignItems={'center'} width={'100%'}>
                            <Button backgroundColor="$blue5" borderRadius={10} width="100%" onPress={handlePauseDownload}>
                                <Text fontSize={'$5'}>Pause Download</Text>
                            </Button>
                            <Button onPress={handleDeleteDownload} backgroundColor="$red5" borderRadius={10} width="100%">
                                <Text fontSize={'$5'}>Delete Download</Text>
                            </Button>
                        </YStack>

                        <Button onPress={() => setModalVisible(false)} backgroundColor="$gray5" borderRadius={10}  width="100%">
                            <Text fontSize={'$5'}>Cancel</Text>
                        </Button>
                    </YStack>
                </YStack>
            </Modal>
        </TouchableWithoutFeedback>
    );
};

const DownloadItem: React.FC<DownloadItemProps> = ({download}) => {
    const {podcastId, episodeId, totalBytesWritten, totalBytesExpectedToWrite, downloaded} = download

    const percentage = totalBytesWritten / totalBytesExpectedToWrite;
    const isDownloading = downloaded === false;

    const podcast = getPodcastById(podcastId)
    const episode = getEpisodeById(podcast, episodeId)

    const openEpisode = () => router.push({pathname: "/episode/", params: {podcastId, episodeId}});

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

    return (
        <TouchableOpacity onPress={openEpisode}>
            <XStack
                borderBottomWidth={1}
                paddingHorizontal="$4"
                paddingTop="$3"
                paddingBottom="$2"
                alignItems="center"
            >
                <YStack>
                    <AnimatedCircularProgress
                        size={50}
                        width={3}
                        fill={Math.round((percentage ?? 0) * 100)}
                        tintColor={'rgb(189,0,0)'}
                        backgroundColor={'rgba(154,0,0,0.47)'}
                        rotation={0}
                    >
                        {(fill) => (
                            <Text>{percentage ? Math.round((percentage) * 100) : 0}%</Text>
                        )}
                    </AnimatedCircularProgress>
                </YStack>

                <YStack f={1} mx={'$3'}>
                    <Text fontSize={17} fontWeight="bold" mb="$1.5" color={'$charcoal'} numberOfLines={1}>
                        {episode.number}. {episode.description}
                    </Text>
                    <Text fontSize={15} color={'$charcoal'}>
                        {podcast.name}
                    </Text>
                </YStack>

                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <SimpleLineIcons name="options-vertical" size={22} color={color} />
                </TouchableOpacity>
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
    const [refreshing, setRefreshing] = useState(false);
    const [sections, setSections] = useState<{ title: string, data: DownloadModel[] }[]>([]);

    const theme = useTheme();
    const purple = theme.purple.get()

    useEffect(() => {
        const waitingToDownload = downloads.filter(d => !d.downloaded && d.totalBytesWritten === 0);
        const completedDownloads = downloads.filter(d => d.downloaded);
        const inProgressPaused = downloads.filter(d => !d.downloaded && d.totalBytesWritten > 0 && d.totalBytesWritten < d.totalBytesExpectedToWrite);

        setSections(
            [
                {title: 'In Progress', data: inProgressPaused},
                {title: 'Waiting to Download', data: waitingToDownload},
                {title: 'Completed Download', data: completedDownloads},
            ].filter(section => section.data.length > 0)
        );
    }, [downloads]);

    const onRefresh = async () => {
        setRefreshing(true);
        console.log('Refresh action triggered');
        // You might want to trigger a refetch or some update logic
        // Here you would normally go and fetch new data or re-fetch existing data
        setRefreshing(false);
    };

    return (
        <SectionList
            sections={sections}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({item}) => <DownloadItem download={item}/>}
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
    );
};

// This function specifies which observables the component subscribes to and watches column changes
const enhance = withObservables(['downloads'], () => ({
    downloads: database.collections.get<DownloadModel>('downloads')
        .query(
            Q.sortBy('downloadUpdatedAt', Q.desc),
        )
        .observeWithColumns(['totalBytesWritten', 'downloaded'])

}));

// Wrap the component with the database and observables
export default withDatabase(enhance(DownloadsList));
