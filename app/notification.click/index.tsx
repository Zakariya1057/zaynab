import React, { useEffect, useState } from 'react';
import Episode from '@/components/Episode/Episode';
import { useActiveTrack } from "react-native-track-player";
import { Spinner } from "tamagui";
import { useLocalSearchParams } from "expo-router";

export default function PodcastEpisode() {
    const [loading, setLoading] = useState(true);
    const { podcastId: initialPodcastId, episodeId: initialEpisodeId } = useLocalSearchParams<{podcastId: string, episodeId: string}>();
    const track = useActiveTrack();
    const [podcastId, setPodcastId] = useState(initialPodcastId);
    const [episodeId, setEpisodeId] = useState(initialEpisodeId);

    useEffect(() => {
        if (!podcastId || !episodeId) {
            if (track) {
                const [trackPodcastId, trackEpisodeId] = track.description?.split('|') ?? [];
                if (trackPodcastId && trackEpisodeId) {
                    setPodcastId(trackPodcastId);
                    setEpisodeId(trackEpisodeId);
                }
            }
        }
        setLoading(false);
    }, [track, podcastId, episodeId]);

    if (loading) {
        return <Spinner />;
    }

    return podcastId && episodeId ? (
        <>
            <Episode podcastId={podcastId} episodeId={episodeId} />
        </>

    ) : (
        <Spinner />
    );
}
