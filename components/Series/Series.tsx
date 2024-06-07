import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { router, useFocusEffect } from "expo-router";
import SeriesEpisode from "./SeriesEpisode";
import SeriesHeader from "./SeriesHeader";
import { Podcast } from "@/interfaces/podcast";
import { Episode } from "@/interfaces/episode";
import { getPercentage } from "@/utils/percentage/get-percentage";
import { useEpisodes } from "@/hooks/useEpisodes";
import { useTheme } from "tamagui";
import { useDownloads } from "@/hooks/useDownloads";
import { State, usePlaybackState } from "react-native-track-player";
import { FlashList } from "@shopify/flash-list";

const PAGE_SIZE = 20; // Number of items to load per page

interface Props {
    podcast: Podcast,
    playingEpisodeId?: string,
    play: () => void
}

export default ({ podcast, play, playingEpisodeId }: Props) => {
    const { episodes, retry, loading } = useEpisodes(podcast.id);
    const { downloads, retry: retryDownloads } = useDownloads(podcast.id);

    const { state } = usePlaybackState();

    const podcastEpisodes = Object.values(podcast.episodes)

    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [data, setData] = useState(podcastEpisodes.slice(0, PAGE_SIZE));
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        setData(podcastEpisodes.slice(0, page * PAGE_SIZE));
    }, [episodes, page]);

    const loadMore = () => {
        if (!isLoadingMore && data.length < podcastEpisodes.length) {
            setIsLoadingMore(true);
            setPage(prevPage => prevPage + 1);
            setIsLoadingMore(false);
        }
    };

    const updateDownloadedEpisodes = async () => {
        await retryDownloads()
        setEpisodeHistory()
    }

    const setEpisodeHistory = useCallback(() => {
        for (const episode of episodes) {
            if (podcast.episodes[episode.episodeId]) {
                podcast.episodes[episode.episodeId].duration = episode.duration;
                podcast.episodes[episode.episodeId].position = episode.position;
                podcast.episodes[episode.episodeId].downloaded = false;
            }
        }

        for (const download of downloads) {
            if (podcast.episodes[download.episodeId]) {
                podcast.episodes[download.episodeId].downloaded = download.downloaded;
            }
        }
    }, [episodes, podcast.episodes, downloads]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await retry();
        await updateDownloadedEpisodes()
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
            author={podcast.author}
            description={podcast.description}
            image={podcast.image}
            play={play}
            continuePlaying={episodes.length > 0}
        />
    ), [podcast, play]);

    const openEpisode = useCallback((episodeId: string) => {
        router.push({
            pathname: "/notification.click/",
            params: { podcastId: podcast.id, episodeId }
        });
    }, [podcast.id]);

    const renderEpisodeItem = useCallback(({ item }: { item: Episode }) => (
        <SeriesEpisode
            key={item.id}
            title={`Episode ${item.number}`}
            description={item.description}
            openEpisode={() => openEpisode(item.id)}
            active={playingEpisodeId === item.id}
            playing={state === State.Playing && playingEpisodeId === item.id}
            percentage={getPercentage(item.position, item.duration)}
            downloaded={item.downloaded ?? false}
        />
    ), [openEpisode, playingEpisodeId]);

    return (
        <FlashList
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={purple}
                />
            }
            estimatedItemSize={60}
            ListHeaderComponent={ListHeader}
            data={podcastEpisodes}
            renderItem={renderEpisodeItem}
            keyExtractor={item => item.id}
        />
    );
}
