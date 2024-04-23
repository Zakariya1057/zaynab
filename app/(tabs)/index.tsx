import {
    Text,
    YStack,
    XStack,
    Image,
    Stack,
    H5,
    Card,
    H6, useTheme
} from 'tamagui';
import {PlayCircle} from "@tamagui/lucide-icons";
import {router} from "expo-router";
import {FlatList, ImageSourcePropType, RefreshControl, TouchableOpacity, SectionList} from "react-native";
import CompactAudioPlayer from "../../components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import React, {useCallback, useRef, useState} from "react";
import {Podcasts} from "@/utils/data/podcasts";
import {Podcast} from "@/interfaces/podcast";
import {useEpisodes} from "@/hooks/useEpisodes";
import {EpisodeModel} from "@/utils/database/models/episode-model";
import {getPercentage} from "@/utils/percentage/get-percentage";
import {AnimatedCircularProgress} from "react-native-circular-progress";

export default function App() {
    const {episodes, retry} = useEpisodes()
    const [refreshing, setRefreshing] = useState(false);

    const theme = useTheme();
    const purple = theme.purple.get()

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        await retry()
        setRefreshing(false)
    }, [])

    const sections = [
        ...episodes.length > 0 ? [{
            title: "Continue Listening",
            data: [1]
        }] : [], // Only add this section if there are episodes
        {
            title: "Popular Podcasts",
            data: Object.values(Podcasts) // Assuming Podcasts is an array
        }
    ];

    const renderItem = ({ section, item }) => {
        if (section.title === "Continue Listening") {
            // Render a horizontal list for this section
            return (
                <FlatList
                    horizontal={true}
                    data={episodes}
                    renderItem={({ item }) => (
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
                    contentContainerStyle={{ gap: 20 }}
                />
            );
        } else {
            // Render a single item for other sections
            return <PodcastElement {...item} />;
        }
    };


    return (
        <Stack f={1} backgroundColor={'$background'}>
            <SectionList
                sections={sections}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => (
                    <YStack width="100%">
                        <XStack justifyContent="space-between" alignItems="center" backgroundColor={'$background'} py={'$3'}>
                            <Text fontSize={20} fontWeight="bold">{title}</Text>
                        </XStack>
                    </YStack>
                )}
                contentContainerStyle={{ paddingHorizontal: 10, rowGap: 10 }}
                showsVerticalScrollIndicator={false}
                backgroundColor={'$backgroundStrong'}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={purple}/>
                }
            />
            <CompactAudioPlayer edges={[]} />
        </Stack>
    )
}

const HorizontalTabs = ({episodes}: { episodes: EpisodeModel[] }) => {
    episodes.map((a) => console.log(a.title))
    return (
        <FlatList
            horizontal={true}
            data={episodes}
            renderItem={({item}) =>
                <DemoCard
                    title={item.title}
                    position={item.position}
                    duration={item.duration}
                    episodeId={item.episodeId}
                    podcastId={item.podcastId}
                />
            }

            keyExtractor={item => item.episodeId}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{gap: 20}} // Adjust padding as necessary
        />
    );
}

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

    const openEpisode = () => router.push({pathname: "/episode/", params: {podcastId, episodeId}});

    console.log(percentage, duration, percentage)
    return (
        <TouchableOpacity onPress={openEpisode}>
            <Card size="$3" bordered width={230} br={'$5'} overflow={'hidden'}>
                <XStack>
                    <Image
                        resizeMode="cover"
                        alignSelf="center"
                        w={'100%'}
                        height={150}
                        // source={image}
                        source={require('@/assets/images/podcasts/a3bc8692-476f-4d2d-98df-3fc498321517/cover.webp')}
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

export const PodcastElement = (podcast: Podcast) => {
    const {name, subTitle, image} = podcast

    return (
        <TouchableOpacity onPress={
            () => router.push({pathname: "/series/", params: {id: podcast.id}})
        } >
            <XStack
                gap="$3"
                alignItems="center"
                borderRadius="$3"
            >
                <Image
                    src={image}
                    width={80}
                    aspectRatio={1}
                    borderRadius={'$3'}
                    overflow={'hidden'}
                    resizeMode="cover"
                />
                <YStack f={1} justifyContent="center" space="$2">
                    <H5 lineHeight="$4" numberOfLines={2}>{name}</H5>
                    <Text fontSize={'$4'} numberOfLines={2}>{subTitle}</Text>
                </YStack>
                <TouchableOpacity
                    onPress={() => router.push({pathname: "/series/", params: {id: podcast.id, play: true}})}>
                    <PlayCircle size="$4" strokeWidth={1.3} color={'$color.purple'}/>
                </TouchableOpacity>
            </XStack>
        </TouchableOpacity>
    )
}
