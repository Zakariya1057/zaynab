import React, {useCallback, useEffect, useState} from "react";
import {FlatList, RefreshControl} from "react-native";
import {router, useFocusEffect} from "expo-router";
import SeriesEpisode from "./SeriesEpisode";
import SeriesHeader from "./SeriesHeader";
import {Podcast} from "@/interfaces/podcast";
import {Episode} from "@/interfaces/episode";
import {EpisodeModel} from "@/utils/database/models/episode-model";
import {getPercentage} from "@/utils/percentage/get-percentage";
import {useEpisodes} from "@/hooks/useEpisodes";
import {useTheme} from "tamagui";

export default function ({podcast, play, playingEpisodeId}: {
    podcast: Podcast,
    playingEpisodeId?: string,
    play: () => void
}) {
    const {episodes, retry, loading } = useEpisodes();

    const [refreshing, setRefreshing] = useState(false);

    const setEpisodeHistory = () => {
        for (const episode of episodes) {
            podcast.episodes[episode.episodeId].duration = episode.duration
            podcast.episodes[episode.episodeId].position = episode.position
        }
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await retry()
        setEpisodeHistory()
        setRefreshing(false);
    }

    useEffect(() => {
        setEpisodeHistory()
    }, [loading]);

    useFocusEffect(
        useCallback(() => {
            setEpisodeHistory()
        }, [])
    )

    const theme = useTheme();
    const purple = theme.purple.get()

    const ListHeader = () => (
        <SeriesHeader
            title={podcast.name}
            description={podcast.description}
            image={podcast.image}
            play={play}
        />
    );

    const openEpisode = (episode: Episode) => router.push({
        pathname: "/episode/",
        params: {podcastId: podcast.id, episodeId: episode.id}
    })

    const renderEpisodeItem = ({item}: { item: Episode }) => {
        return <SeriesEpisode
            key={item.id}
            title={`Episode ${item.number}`}
            description={item.description}
            openEpisode={() => openEpisode(item)}
            playing={playingEpisodeId === item.id}
            percentage={getPercentage(item?.position, item?.duration)}
        />
    }

    return (
        <FlatList
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={purple}
                />
            }
            ListHeaderComponent={ListHeader}
            data={Object.values(podcast.episodes)}
            renderItem={renderEpisodeItem}
            keyExtractor={item => item.id}
        />
    );
};