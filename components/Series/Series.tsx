import React, {useCallback, useEffect, useMemo, useState} from "react";
import {FlatList, RefreshControl} from "react-native";
import {router, useFocusEffect} from "expo-router";
import SeriesEpisode from "./SeriesEpisode";
import SeriesHeader from "./SeriesHeader";
import {Podcast} from "@/interfaces/podcast";
import {Episode} from "@/interfaces/episode";
import {getPercentage} from "@/utils/percentage/get-percentage";
import {useEpisodes} from "@/hooks/useEpisodes";
import {useTheme} from "tamagui";

export default function SeriesPage({podcast, play, playingEpisodeId}: {
    podcast: Podcast,
    playingEpisodeId?: string,
    play: () => void
}) {
    const {episodes, retry, loading} = useEpisodes();
    const [refreshing, setRefreshing] = useState(false);

    const setEpisodeHistory = useCallback(() => {
        if (episodes.length > 0) {
            for (const episode of episodes) {
                if (podcast.episodes[episode.episodeId]) {
                    podcast.episodes[episode.episodeId].duration = episode.duration;
                    podcast.episodes[episode.episodeId].position = episode.position;
                }
            }
        }
    }, [episodes, podcast.episodes]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await retry();
        setEpisodeHistory();
        setRefreshing(false);
    }, [retry, setEpisodeHistory]);

    useEffect(() => {
        setEpisodeHistory();
    }, [loading, setEpisodeHistory]);

    useFocusEffect(setEpisodeHistory);

    const theme = useTheme();
    const purple = theme.purple.get();

    const ListHeader = useMemo(() => (
        <SeriesHeader
            title={podcast.name}
            description={podcast.description}
            image={podcast.image}
            play={play}
        />
    ), [podcast, play]);

    const openEpisode = useCallback((episodeId: string) => {
        router.push({
            pathname: "/episode/",
            params: {podcastId: podcast.id, episodeId}
        });
    }, [podcast.id]);

    const renderEpisodeItem = useCallback(({item}: { item: Episode }) => (
        <SeriesEpisode
            key={item.id}
            title={`Episode ${item.number}`}
            description={item.description}
            openEpisode={() => openEpisode(item.id)}
            playing={playingEpisodeId === item.id}
            percentage={getPercentage(item.position, item.duration)}
        />
    ), [openEpisode, playingEpisodeId]);

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
}
