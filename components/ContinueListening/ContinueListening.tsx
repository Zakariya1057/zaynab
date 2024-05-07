import React, {useEffect, useState} from 'react';
import {FlatList, Modal, RefreshControl, SectionList, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import {withObservables} from '@nozbe/watermelondb/react';
import {Q} from '@nozbe/watermelondb';
import {DownloadModel} from "@/utils/database/models/download-model";
import {database} from "@/utils/database/setup";
import {Button, Card, H6, Image, Separator, Text, useTheme, XStack, YStack} from "tamagui";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import {getPodcastById} from "@/utils/data/getPodcastById";
import {router} from "expo-router";
import {EpisodeModel} from "@/utils/database/models/episode-model";
import {getPercentage} from "@/utils/percentage/get-percentage";


export function DemoCard({title, position, duration, podcastId, episodeId}: {
    title: string,
    position: number,
    duration: number,
    podcastId: string,
    episodeId: string
}) {
    const theme = useTheme();
    const purple = theme.purple.get()

    const percentage = getPercentage(position, duration) ?? 0

    const openEpisode = () => router.push({pathname: "/notification.click/", params: {podcastId, episodeId}});

    const {image} = getPodcastById(podcastId)

    return (
        <TouchableOpacity onPress={openEpisode}>
            <Card size="$3" bordered width={200} br={'$5'} overflow={'hidden'}>
                <XStack>
                    <Image
                        resizeMode="cover"
                        alignSelf="center"
                        w={'100%'}
                        height={120}
                        source={image}
                    />
                </XStack>
                <Card.Header>
                    <XStack gap={'$2'}>
                        <H6 f={1} lineHeight={'$4'} numberOfLines={2}>{title}</H6>
                        <XStack alignItems={'center'} justifyContent={'flex-end'}>
                            <AnimatedCircularProgress
                                size={43}
                                width={4}
                                fill={(percentage * 100)}
                                tintColor={purple}
                                backgroundColor={'rgba(111,67,241,0.47)'}
                                rotation={0}
                            >
                                {
                                    (fill) => (
                                        <Text fontSize={'$2'}>
                                            {Math.ceil(percentage * 100)}%
                                        </Text>
                                    )
                                }
                            </AnimatedCircularProgress>
                        </XStack>
                    </XStack>
                </Card.Header>
            </Card>
        </TouchableOpacity>
    );
}

// Main component to display the list of downloads
const ContinueListening: React.FC<{ episodes: EpisodeModel[] }> = ({episodes}) => {
    return (
        <FlatList
            horizontal={true}
            data={episodes}
            renderItem={({item}) => (
                <DemoCard
                    title={item.title}
                    position={item.position}
                    duration={item.duration}
                    episodeId={item.episodeId}
                    podcastId={item.podcastId}
                />
            )}
            keyExtractor={item => item.episodeId}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{gap: 20}}
        />
    )
};

// This function specifies which observables the component subscribes to and watches column changes
const enhance = withObservables(['episodes'], () => ({
    episodes: database.collections.get<EpisodeModel>('episodes')
        .query(
            Q.sortBy('episodeUpdatedAt', Q.desc),
        )
        .observeWithColumns(['episodeUpdatedAt'])

}));


// Wrap the component with the database and observables
export default withDatabase(enhance(ContinueListening));
