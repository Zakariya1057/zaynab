import {Podcast} from "@/interfaces/podcast";
import {TouchableOpacity} from "react-native";
import {router} from "expo-router";
import {H5, Image, Text, XStack, YStack} from "tamagui";
import {PlayCircle} from "@tamagui/lucide-icons";
import React from "react";

interface PodcastElementProps {
    podcast: Podcast;
    showPlayIcon?: boolean;
}

export const PodcastElement: React.FC<PodcastElementProps>  = ({podcast, showPlayIcon = true }) => {
    const {name, subTitle, image} = podcast

    return (
        <TouchableOpacity onPress={
            () => router.push({pathname: "/series/", params: {id: podcast.id}})
        }>
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
                <YStack f={1} justifyContent="center" gap="$2">
                    <H5 lineHeight="$4" numberOfLines={2}>{name}</H5>
                    <Text fontSize={'$4'} numberOfLines={2}>{subTitle}</Text>
                </YStack>
                {
                    showPlayIcon && (
                        <TouchableOpacity
                            onPress={() => router.push({pathname: "/series/", params: {id: podcast.id, play: true}})}>
                            <PlayCircle size="$4" strokeWidth={1.3} color={'$color.purple'}/>
                        </TouchableOpacity>
                    )
                }
            </XStack>
        </TouchableOpacity>
    )
}
