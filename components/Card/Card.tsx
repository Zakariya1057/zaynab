import {Card, Image, Text, useTheme, XStack} from "tamagui";
import {getPercentage} from "@/utils/percentage/get-percentage";
import {router} from "expo-router";
import {getPodcastById} from "@/utils/data/getPodcastById";
import {TouchableOpacity} from "react-native";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import React from "react";

export default function DemoCard({title, position, duration, podcastId, episodeId}: {
    title: string,
    position?: number,
    duration?: number,
    podcastId: string,
    episodeId?: string
}) {
    const theme = useTheme();
    const purple = theme.purple.get()

    const percentage = getPercentage(position, duration) ?? 0

    const openPodcast = () => router.push({pathname: "/series/", params: { id: podcastId }})
    const openEpisode = () => router.push({pathname: "/notification.click/", params: {podcastId, episodeId}});

    const open = () => episodeId ? openEpisode() : openPodcast()

    const {image} = getPodcastById(podcastId)

    return (
        <TouchableOpacity onPress={open}>
            <Card size="$3" bordered width={180} br={'$5'} overflow={'hidden'}>
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
                        <Text f={1} lineHeight={'$1'} numberOfLines={2} fontWeight={'500'} fontSize={'$4'}>{title}</Text>
                        {
                            (position && duration) ? (
                                <XStack alignItems={'center'} justifyContent={'flex-end'}>
                                    <AnimatedCircularProgress
                                        size={43}
                                        width={3}
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
                            ) : <></>
                        }
                    </XStack>
                </Card.Header>
            </Card>
        </TouchableOpacity>
    );
}
