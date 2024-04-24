import {
    Text,
    YStack,
    XStack,
    Image,
    Stack,
    H5,
    Card,
    H6, useTheme, Input
} from 'tamagui';
import {PlayCircle} from "@tamagui/lucide-icons";
import {router} from "expo-router";
import {FlatList, ImageSourcePropType, RefreshControl, TouchableOpacity, SectionList} from "react-native";
import CompactAudioPlayer from "../../components/Media/AudioPlayer/CompactAudioPlayer/CompactAudioPlayer";
import React, {useCallback, useRef, useState} from "react";
import {Podcasts} from "@/utils/data/podcasts";
import {Podcast} from "@/interfaces/podcast";
import {useEpisodes} from "@/hooks/useEpisodes";

export default function App() {
    const sections = [
        {
            title: "Popular Podcasts",
            data: Object.values(Podcasts) // Assuming Podcasts is an array
        }
    ];

    const renderItem = ({ item }) => {
        return <PodcastElement {...item} />;
    };

    return (
        <Stack f={1} backgroundColor={'$background'}>
            <Input width={'100%'} placeholder={'Search'}/>

            <SectionList
                sections={sections}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingHorizontal: 10, rowGap: 10 }}
                showsVerticalScrollIndicator={false}
                backgroundColor={'$backgroundStrong'}
            />
            <CompactAudioPlayer edges={[]} />
        </Stack>
    )
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
