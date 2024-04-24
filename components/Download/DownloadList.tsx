import React, {useRef} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import {withObservables} from '@nozbe/watermelondb/react';
import {Database, Q} from '@nozbe/watermelondb';
import {DownloadModel} from "@/utils/database/models/download-model";
import {database} from "@/utils/database/setup";
import {YStack, Text, useTheme, XStack, Separator} from "tamagui";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import {getPodcastById} from "@/utils/data/getPodcastById";
import {getEpisodeById} from "@/utils/data/getEpisodeById";
import {router} from "expo-router";

interface DownloadItemProps {
    download: DownloadModel
}

// This component renders a single download item

const DownloadItem: React.FC<DownloadItemProps> = ({download}) => {
    const animation = useRef(null);

    const theme = useTheme();
    const purple = theme.purple.get()

    const { podcastId, episodeId, totalBytesWritten, totalBytesExpectedToWrite, downloaded } = download

    const percentage = totalBytesWritten / totalBytesExpectedToWrite;
    const isDownloading = downloaded === false;

    const podcast = getPodcastById(podcastId)
    const episode = getEpisodeById(podcast, episodeId)

    const openEpisode = () => router.push({pathname: "/episode/", params: {podcastId, episodeId}});

    return (
        <TouchableOpacity onPress={openEpisode}>
            <XStack
                borderBottomWidth={1}
                paddingHorizontal="$4"
                paddingTop="$3"
                paddingBottom="$2"
                alignItems="center"
            >
                <YStack f={1}>
                    <Text fontSize={17} fontWeight="bold" mb="$1.5" color={'$charcoal'}>
                        {episode.number}. {episode.description}
                    </Text>
                    <Text fontSize={15} color={'$charcoal'}>
                        {podcast.name}
                    </Text>
                </YStack>

                <YStack justifyContent="center">
                    {/*{*/}
                    {/*    isDownloading &&*/}
                    {/*    <LottieView*/}
                    {/*        autoPlay*/}
                    {/*        loop*/}
                    {/*        ref={animation}*/}
                    {/*        style={{ width: 70, height: 50 }}*/}
                    {/*        source={require('@/assets/animation/download.json')}  // Assuming you have a similar Lottie file*/}
                    {/*    />*/}
                    {/*}*/}
                </YStack>

                {percentage > 0 &&
                    <YStack ml="$5">
                        <AnimatedCircularProgress
                            size={50}
                            width={4}
                            fill={percentage * 100}
                            tintColor={'rgb(189,0,0)'}
                            backgroundColor={'rgba(154,0,0,0.47)'}
                            rotation={0}
                        >
                            {(fill) => (
                                <Text>{Math.floor(percentage * 100)}%</Text>
                            )}
                        </AnimatedCircularProgress>
                    </YStack>
                }

            </XStack>

            <Separator alignSelf="stretch" vertical={false}/>
        </TouchableOpacity>
    );
}

interface DownloadsListProps {
    downloads: DownloadModel[];
}

// Main component to display the list of downloads
const DownloadsList: React.FC<DownloadsListProps> = ({downloads}) => (
    <FlatList
        data={downloads}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <DownloadItem download={item}/>}
    />
);

// This function specifies which observables the component subscribes to and watches column changes
const enhance = withObservables(['downloads'], () => ({
    downloads: database.collections.get<DownloadModel>('downloads')
        .query(
            Q.sortBy('downloadStartedAt', Q.desc)
        )
        .observeWithColumns(['totalBytesWritten', 'downloaded'])

}));

// Wrap the component with the database and observables
export default withDatabase(enhance(DownloadsList));
